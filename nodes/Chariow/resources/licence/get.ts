import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Licence ID or Key',
		name: 'licenceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['licence'],
				operation: ['get'],
			},
		},
		description: 'The ID or key of the licence to retrieve (e.g., lic_abc123xyz or XXXX-XXXX-XXXX)',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const licenceId = this.getNodeParameter('licenceId', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.LICENCE(licenceId));
	return extractData(response) as IDataObject;
}
