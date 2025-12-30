import type { INodeProperties } from 'n8n-workflow';
import * as getInfo from './getInfo';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['store'],
			},
		},
		options: [
			{
				name: 'Get Info',
				value: 'getInfo',
				description: 'Get store information',
				action: 'Get store info',
			},
		],
		default: 'getInfo',
	},
];

export const fields: INodeProperties[] = [...getInfo.description];

export { getInfo };
