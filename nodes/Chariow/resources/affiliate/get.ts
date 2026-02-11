import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Affiliate Code',
		name: 'affiliateCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['affiliate'],
				operation: ['get'],
			},
		},
		description: 'The unique affiliate code (e.g., JOHN25, PROMO2025)',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const affiliateCode = this.getNodeParameter('affiliateCode', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.AFFILIATE(affiliateCode));
	return extractData(response) as IDataObject;
}
