import type { IDataObject } from 'n8n-workflow';

/**
 * Extract the items array from an API response
 *
 * The API returns responses in the format:
 * { message, data: { data: [...], pagination: {...} }, errors: [] }
 * or for single resources:
 * { message, data: { ...resource }, errors: [] }
 */
export function extractData(response: IDataObject): IDataObject | IDataObject[] {
	const outerData = response.data as IDataObject | undefined;

	if (outerData && typeof outerData === 'object' && !Array.isArray(outerData)) {
		// Collection response: data.data contains the items array
		if (Array.isArray(outerData.data)) {
			return outerData.data as IDataObject[];
		}

		// Single resource response: data is the resource itself
		return outerData as IDataObject;
	}

	if (Array.isArray(outerData)) {
		return outerData as IDataObject[];
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
