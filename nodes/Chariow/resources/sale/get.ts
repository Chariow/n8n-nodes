import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Sale ID',
		name: 'saleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sale'],
				operation: ['get'],
			},
		},
		description: 'The ID of the sale to retrieve (e.g., sal_abc123xyz)',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const saleId = this.getNodeParameter('saleId', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.SALE(saleId));
	return extractData(response) as IDataObject;
}
