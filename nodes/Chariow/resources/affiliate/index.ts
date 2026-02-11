import type { INodeProperties } from 'n8n-workflow';
import * as get from './get';
import * as sendInvitations from './sendInvitations';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['affiliate'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an affiliate by their unique code',
				action: 'Get an affiliate',
			},
			{
				name: 'Send Invitations',
				value: 'sendInvitations',
				description: 'Send affiliate invitations to email addresses',
				action: 'Send affiliate invitations',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [...get.description, ...sendInvitations.description];

export { get, sendInvitations };
