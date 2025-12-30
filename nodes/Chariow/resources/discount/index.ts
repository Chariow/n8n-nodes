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
				resource: ['discount'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a discount by ID',
				action: 'Get a discount',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many discounts',
				action: 'Get many discounts',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [...get.description, ...getAll.description];

export { get, getAll };
