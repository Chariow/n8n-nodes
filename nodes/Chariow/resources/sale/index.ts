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
				resource: ['sale'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sale by ID',
				action: 'Get a sale',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sales',
				action: 'Get many sales',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [...get.description, ...getAll.description];

export { get, getAll };
