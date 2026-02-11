import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Pulse ID',
		name: 'pulseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pulse'],
				operation: ['get'],
			},
		},
		description: 'The ID of the pulse/webhook (e.g., pulse_abc123xyz)',
		placeholder: 'pulse_abc123xyz',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const pulseId = this.getNodeParameter('pulseId', i) as string;
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.PULSE(pulseId));
	return extractData(response) as IDataObject;
}
