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
				resource: ['product'],
				operation: ['get'],
			},
		},
		description: 'The ID of the product to retrieve (e.g., prd_abc123xyz)',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const productId = this.getNodeParameter('productId', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.PRODUCT(productId));
	return extractData(response) as IDataObject;
}
