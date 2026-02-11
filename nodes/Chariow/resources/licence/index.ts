import type { INodeProperties } from 'n8n-workflow';
import * as get from './get';
import * as getAll from './getAll';
import * as activate from './activate';
import * as revoke from './revoke';
import * as getActivations from './getActivations';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['licence'],
			},
		},
		options: [
			{
				name: 'Activate',
				value: 'activate',
				description: 'Activate a licence',
				action: 'Activate a licence',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a licence by ID or key',
				action: 'Get a licence',
			},
			{
				name: 'Get Activations',
				value: 'getActivations',
				description: 'Get activations for a licence',
				action: 'Get licence activations',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many licences',
				action: 'Get many licences',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke a licence',
				action: 'Revoke a licence',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	...get.description,
	...getAll.description,
	...activate.description,
	...revoke.description,
	...getActivations.description,
];

export { get, getAll, activate, revoke, getActivations };
