import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'The ID of the product to create a checkout for (e.g., prd_abc123xyz)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Cancel URL',
				name: 'cancel_url',
				type: 'string',
				default: '',
				description: 'URL to redirect to if the checkout is cancelled',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom fields to pass with the checkout',
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'The key of the custom field',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The value of the custom field',
							},
						],
					},
				],
			},
			{
				displayName: 'Customer Email',
				name: 'customer_email',
				type: 'string',
				default: '',
				description: 'Pre-fill the customer email',
			},
			{
				displayName: 'Customer Name',
				name: 'customer_name',
				type: 'string',
				default: '',
				description: 'Pre-fill the customer name',
			},
			{
				displayName: 'Discount Code',
				name: 'discount_code',
				type: 'string',
				default: '',
				description: 'Apply a discount code to the checkout',
			},
			{
				displayName: 'Success URL',
				name: 'success_url',
				type: 'string',
				default: '',
				description: 'URL to redirect to after successful payment',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const productId = this.getNodeParameter('productId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {
		product_id: productId,
	};

	if (additionalFields.customer_email) {
		body.customer_email = additionalFields.customer_email;
	}
	if (additionalFields.customer_name) {
		body.customer_name = additionalFields.customer_name;
	}
	if (additionalFields.discount_code) {
		body.discount_code = additionalFields.discount_code;
	}
	if (additionalFields.success_url) {
		body.success_url = additionalFields.success_url;
	}
	if (additionalFields.cancel_url) {
		body.cancel_url = additionalFields.cancel_url;
	}

	// Handle custom fields
	const customFieldsData = additionalFields.customFields as IDataObject | undefined;
	if (customFieldsData?.field) {
		const customFields: IDataObject = {};
		const fields = customFieldsData.field as Array<{ key: string; value: string }>;
		for (const field of fields) {
			customFields[field.key] = field.value;
		}
		body.custom_fields = customFields;
	}

	const response = await chariowApiRequest.call(this, 'POST', ENDPOINTS.CHECKOUTS, body);
	return extractData(response) as IDataObject;
}
