import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Discount ID',
		name: 'discountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['discount'],
				operation: ['get'],
			},
		},
		description: 'The ID of the discount to retrieve (e.g., dis_abc123xyz)',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const discountId = this.getNodeParameter('discountId', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.DISCOUNT(discountId));
	return extractData(response) as IDataObject;
}
