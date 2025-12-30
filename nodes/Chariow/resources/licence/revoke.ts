import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData } from '../../shared';

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
				operation: ['revoke'],
			},
		},
		description: 'The ID or key of the licence to revoke',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const licenceId = this.getNodeParameter('licenceId', i) as string;
	const response = await chariowApiRequest.call(this, 'POST', `/licences/${licenceId}/revoke`);
	return extractData(response) as IDataObject;
}
