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
				description:
					'Unique identifier for the device (e.g., MAC address, UUID, device name). Maximum 255 characters.',
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

	const response = await chariowApiRequest.call(
		this,
		'POST',
		ENDPOINTS.LICENSE_ACTIVATE(licenceId),
		body,
	);
	return extractData(response) as IDataObject;
}
