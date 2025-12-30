import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import {
	chariowApiRequest,
	chariowApiRequestAllItems,
	extractData,
	buildListQuery,
} from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['sale'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['sale'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['sale'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'Filter by customer ID',
			},
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				default: '',
				description: 'Filter by product ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Abandoned', value: 'abandoned' },
					{ name: 'All', value: '' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Refunded', value: 'refunded' },
				],
				default: '',
				description: 'Filter by sale status',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const filters = this.getNodeParameter('filters', i) as IDataObject;
	const limit = this.getNodeParameter('limit', i, 50) as number;

	const query = buildListQuery(limit, returnAll, filters);

	if (returnAll) {
		return chariowApiRequestAllItems.call(this, 'GET', '/sales', {}, query);
	}

	const response = await chariowApiRequest.call(this, 'GET', '/sales', {}, query);
	return extractData(response) as IDataObject[];
}
