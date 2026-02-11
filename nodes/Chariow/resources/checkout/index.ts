import type { INodeProperties } from 'n8n-workflow';
import * as create from './create';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new checkout session',
				action: 'Create a checkout',
			},
		],
		default: 'create',
	},
];

export const fields: INodeProperties[] = [...create.description];

export { create };
