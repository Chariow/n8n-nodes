import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { customer, product, sale, discount, licence, checkout, store } from './resources';

export class Chariow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Chariow',
		name: 'chariow',
		icon: 'file:../../icons/chariow.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Interact with Chariow - the digital products platform for creators and entrepreneurs',
		defaults: {
			name: 'Chariow',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'chariowApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Checkout', value: 'checkout' },
					{ name: 'Customer', value: 'customer' },
					{ name: 'Discount', value: 'discount' },
					{ name: 'Licence', value: 'licence' },
					{ name: 'Product', value: 'product' },
					{ name: 'Sale', value: 'sale' },
					{ name: 'Store', value: 'store' },
				],
				default: 'customer',
			},
			// Operations and fields for each resource
			...customer.operations,
			...customer.fields,
			...product.operations,
			...product.fields,
			...sale.operations,
			...sale.fields,
			...discount.operations,
			...discount.fields,
			...licence.operations,
			...licence.fields,
			...checkout.operations,
			...checkout.fields,
			...store.operations,
			...store.fields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// Customer operations
				if (resource === 'customer') {
					if (operation === 'get') {
						responseData = await customer.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await customer.getAll.execute.call(this, i);
					}
				}

				// Product operations
				if (resource === 'product') {
					if (operation === 'get') {
						responseData = await product.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await product.getAll.execute.call(this, i);
					}
				}

				// Sale operations
				if (resource === 'sale') {
					if (operation === 'get') {
						responseData = await sale.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await sale.getAll.execute.call(this, i);
					}
				}

				// Discount operations
				if (resource === 'discount') {
					if (operation === 'get') {
						responseData = await discount.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await discount.getAll.execute.call(this, i);
					}
				}

				// Licence operations
				if (resource === 'licence') {
					if (operation === 'get') {
						responseData = await licence.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await licence.getAll.execute.call(this, i);
					} else if (operation === 'activate') {
						responseData = await licence.activate.execute.call(this, i);
					} else if (operation === 'revoke') {
						responseData = await licence.revoke.execute.call(this, i);
					} else if (operation === 'getActivations') {
						responseData = await licence.getActivations.execute.call(this, i);
					}
				}

				// Checkout operations
				if (resource === 'checkout') {
					if (operation === 'create') {
						responseData = await checkout.create.execute.call(this, i);
					}
				}

				// Store operations
				if (resource === 'store') {
					if (operation === 'getInfo') {
						responseData = await store.getInfo.execute.call(this);
					}
				}

				// Return results
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
