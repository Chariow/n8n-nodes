import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['get'],
			},
		},
		description: 'The ID of the customer to retrieve (e.g., cus_abc123xyz)',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const customerId = this.getNodeParameter('customerId', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', `/customers/${customerId}`);
	return extractData(response) as IDataObject;
}
