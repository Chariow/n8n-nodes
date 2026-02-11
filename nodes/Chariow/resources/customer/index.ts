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
				resource: ['customer'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a customer by ID',
				action: 'Get a customer',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many customers',
				action: 'Get many customers',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [...get.description, ...getAll.description];

export { get, getAll };
