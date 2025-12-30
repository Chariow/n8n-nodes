import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import {
	chariowApiRequest,
	chariowApiRequestAllItems,
	extractData,
	buildListQuery,
} from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Licence ID or Key',
		name: 'licenceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['licence'],
				operation: ['getActivations'],
			},
		},
		description: 'The ID or key of the licence to get activations for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['licence'],
				operation: ['getActivations'],
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
				resource: ['licence'],
				operation: ['getActivations'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const licenceId = this.getNodeParameter('licenceId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const limit = this.getNodeParameter('limit', i, 50) as number;

	const query = buildListQuery(limit, returnAll);

	if (returnAll) {
		return chariowApiRequestAllItems.call(
			this,
			'GET',
			`/licences/${licenceId}/activations`,
			{},
			query,
		);
	}

	const response = await chariowApiRequest.call(
		this,
		'GET',
		`/licences/${licenceId}/activations`,
		{},
		query,
	);
	return extractData(response) as IDataObject[];
}
