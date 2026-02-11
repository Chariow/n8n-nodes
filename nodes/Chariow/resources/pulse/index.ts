import type { INodeProperties } from 'n8n-workflow';
import * as get from './get';
import * as getAll from './getAll';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pulse'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a pulse/webhook by ID',
				action: 'Get a pulse',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many pulses/webhooks',
				action: 'Get many pulses',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [...get.description, ...getAll.description];

export { get, getAll };
