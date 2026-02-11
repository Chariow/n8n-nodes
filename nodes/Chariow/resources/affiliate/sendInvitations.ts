import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Email Addresses',
		name: 'emails',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['affiliate'],
				operation: ['sendInvitations'],
			},
		},
		description:
			'Email addresses to send affiliate invitations to. Up to 25 emails allowed. Existing affiliates and pending invitations will be automatically skipped.',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const emails = this.getNodeParameter('emails', i) as string[];

	// Filter out empty values
	const emailList = emails.filter((e) => e && e.trim());

	if (emailList.length === 0) {
		throw new Error('At least one email address is required');
	}

	if (emailList.length > 25) {
		throw new Error('Maximum 25 email addresses allowed per request');
	}

	const response = await chariowApiRequest.call(this, 'POST', ENDPOINTS.AFFILIATE_INVITATIONS, {
		emails: emailList,
	});
	return extractData(response) as IDataObject;
}
