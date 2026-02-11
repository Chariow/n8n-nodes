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
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Business & Finance', value: 'business_and_finance' },
					{ name: 'Creative Arts', value: 'creative_arts' },
					{ name: 'Education & Learning', value: 'education_and_learning' },
					{ name: 'Entertainment', value: 'entertainment' },
					{ name: 'Health & Wellness', value: 'health_and_wellness' },
					{ name: 'Literature & Publishing', value: 'literature_and_publishing' },
					{ name: 'Media & Communication', value: 'media_and_communication' },
					{ name: 'Miscellaneous', value: 'miscellaneous' },
					{ name: 'Personal Development', value: 'personal_development' },
					{ name: 'Technology', value: 'technology' },
				],
				default: '',
				description: 'Filter by product category',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search products by name or slug',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Bundle', value: 'bundle' },
					{ name: 'Coaching', value: 'coaching' },
					{ name: 'Course', value: 'course' },
					{ name: 'Downloadable', value: 'downloadable' },
					{ name: 'License', value: 'license' },
					{ name: 'Service', value: 'service' },
				],
				default: '',
				description: 'Filter by product type',
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
