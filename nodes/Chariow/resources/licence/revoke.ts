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
				operation: ['revoke'],
			},
		},
		description: 'The ID or key of the licence to revoke',
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
				operation: ['revoke'],
			},
		},
		options: [
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description:
					'Optional reason for revoking the licence (max 500 characters). Useful for audit purposes and customer support records.',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const licenceId = this.getNodeParameter('licenceId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {};
	if (additionalFields.reason) {
		body.reason = additionalFields.reason;
	}

	const response = await chariowApiRequest.call(
		this,
		'POST',
		ENDPOINTS.LICENSE_REVOKE(licenceId),
		body,
	);
	return extractData(response) as IDataObject;
}
