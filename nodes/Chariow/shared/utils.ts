import type { IDataObject } from 'n8n-workflow';

/**
 * Extract the data from a paginated response
 */
export function extractData(response: IDataObject): IDataObject | IDataObject[] {
	if (response.data !== undefined) {
		return response.data as IDataObject | IDataObject[];
	}
	return response;
}

/**
 * Build query parameters for list operations
 */
export function buildListQuery(
	limit: number,
	returnAll: boolean,
	additionalFields: IDataObject = {},
): IDataObject {
	const query: IDataObject = {
		...additionalFields,
	};

	if (!returnAll) {
		query.per_page = limit;
	}

	return query;
}
