import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { chariowApiRequest, ENDPOINTS } from './shared';

export class ChariowTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Chariow Trigger',
		name: 'chariowTrigger',
		icon: 'file:../../icons/chariow.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["eventCategory"]}}',
		description: 'Starts the workflow when Chariow events occur',
		defaults: {
			name: 'Chariow Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'chariowApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Category',
				name: 'eventCategory',
				type: 'options',
				options: [
					{
						name: 'Affiliate',
						value: 'affiliate',
					},
					{
						name: 'License',
						value: 'license',
					},
					{
						name: 'Sale',
						value: 'sale',
					},
				],
				default: 'sale',
				description: 'The category of events to listen for',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				displayOptions: {
					show: {
						eventCategory: ['affiliate'],
					},
				},
				options: [
					{
						name: 'Joined',
						value: 'affiliate_joined',
						description: 'Triggered when an affiliate joins your store',
					},
				],
				default: ['affiliate_joined'],
				required: true,
				description: 'The affiliate events to trigger on',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				displayOptions: {
					show: {
						eventCategory: ['sale'],
					},
				},
				options: [
					{
						name: 'Abandoned',
						value: 'abandoned_sale',
						description: 'Triggered when a sale is abandoned',
					},
					{
						name: 'Failed',
						value: 'failed_sale',
						description: 'Triggered when a sale fails',
					},
					{
						name: 'Successful',
						value: 'successful_sale',
						description: 'Triggered when a sale is completed successfully',
					},
				],
				default: ['successful_sale'],
				required: true,
				description: 'The sale events to trigger on',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				displayOptions: {
					show: {
						eventCategory: ['license'],
					},
				},
				options: [
					{
						name: 'Activated',
						value: 'license_activated',
						description: 'Triggered when a license is activated',
					},
					{
						name: 'Expired',
						value: 'license_expired',
						description: 'Triggered when a license expires',
					},
					{
						name: 'Issued',
						value: 'license_issued',
						description: 'Triggered when a new license is issued',
					},
					{
						name: 'Revoked',
						value: 'license_revoked',
						description: 'Triggered when a license is revoked',
					},
				],
				default: ['license_activated'],
				required: true,
				description: 'The license events to trigger on',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Product IDs',
						name: 'productIds',
						type: 'string',
						default: '',
						description:
							'Comma-separated list of product IDs to filter events. Leave empty for all products.',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				// If we have a stored webhook ID, assume it exists
				// The create method will handle re-creation if needed
				return webhookData.webhookId !== undefined;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const events = this.getNodeParameter('events') as string[];
				const options = this.getNodeParameter('options') as IDataObject;

				const body: IDataObject = {
					url: webhookUrl,
					triggers: events,
				};

				// Handle product IDs filter
				if (options.productIds) {
					const productIds = (options.productIds as string)
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
					if (productIds.length > 0) {
						body.product_ids = productIds;
					}
				}

				// Register webhook with Chariow
				const response = await chariowApiRequest.call(
					this,
					'POST',
					ENDPOINTS.CONNECTIONS_N8N,
					body,
				);
				const data = (response.data || response) as IDataObject;
				webhookData.webhookId = data.id;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await chariowApiRequest.call(
							this,
							'DELETE',
							ENDPOINTS.CONNECTION_N8N(webhookData.webhookId as string),
						);
					} catch {
						// Ignore errors - webhook might already be deleted
					}

					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
