import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import {
	chariowApiRequest,
	chariowApiRequestAllItems,
	extractData,
	buildListQuery,
	ENDPOINTS,
} from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['product'],
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
				resource: ['product'],
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
				resource: ['product'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search products by name',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Draft', value: 'draft' },
					{ name: 'Published', value: 'published' },
				],
				default: '',
				description: 'Filter by product status',
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
		return chariowApiRequestAllItems.call(this, 'GET', ENDPOINTS.PRODUCTS, {}, query);
	}

	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.PRODUCTS, {}, query);
	return extractData(response) as IDataObject[];
}
