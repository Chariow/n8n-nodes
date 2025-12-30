import type { INodeProperties } from 'n8n-workflow';

/**
 * Reusable "Return All" field for list operations
 */
export const returnAllField: INodeProperties = {
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	description: 'Whether to return all results or only up to a given limit',
};

/**
 * Reusable "Limit" field for list operations
 */
export const limitField: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
	description: 'Max number of results to return',
};

/**
 * Create a resource ID field with custom configuration
 */
export function createIdField(
	resourceName: string,
	fieldName: string,
	description: string,
	placeholder: string,
): INodeProperties {
	return {
		displayName: `${resourceName} ID`,
		name: fieldName,
		type: 'string',
		required: true,
		default: '',
		description,
		placeholder,
	};
}
