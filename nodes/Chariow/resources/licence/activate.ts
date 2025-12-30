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
				operation: ['activate'],
			},
		},
		description: 'The ID or key of the licence to activate',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['licence'],
				operation: ['activate'],
			},
		},
		options: [
			{
				displayName: 'Device Identifier',
				name: 'device_identifier',
				type: 'string',
				default: '',
				description: 'Unique identifier for the device',
			},
			{
				displayName: 'Device Name',
				name: 'device_name',
				type: 'string',
				default: '',
				description: 'Human-readable name for the device',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const licenceId = this.getNodeParameter('licenceId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {};
	if (additionalFields.device_identifier) {
		body.device_identifier = additionalFields.device_identifier;
	}
	if (additionalFields.device_name) {
		body.device_name = additionalFields.device_name;
	}

	const response = await chariowApiRequest.call(
		this,
		'POST',
		`/licences/${licenceId}/activate`,
		body,
	);
	return extractData(response) as IDataObject;
}
