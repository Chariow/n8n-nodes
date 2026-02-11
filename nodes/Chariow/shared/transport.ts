import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import { API_BASE_URL } from './constants';

/**
 * Make an authenticated API request to Chariow
 *
 * The API returns responses wrapped in { message, data, errors }.
 * For collection endpoints, data contains { data: [...], pagination: {...} }.
 * For single-resource endpoints, data contains the resource directly.
 */
export async function chariowApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `${API_BASE_URL}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'chariowApi',
			options,
		);

		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated API request and return all items (handles cursor-based pagination)
 *
 * The API uses cursor-based pagination with the following structure:
 * { message, data: { data: [...], pagination: { next_cursor, prev_cursor, has_more } }, errors: [] }
 */
export async function chariowApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const perPage = 100;

	query.per_page = perPage;

	let hasMore = true;

	while (hasMore) {
		const response = await chariowApiRequest.call(this, method, endpoint, body, query);

		// The API wraps responses in { message, data, errors }
		const outerData = response.data as IDataObject | undefined;

		if (outerData && typeof outerData === 'object') {
			// Collection response: data contains { data: [...], pagination: {...} }
			const innerData = outerData.data;
			const pagination = outerData.pagination as IDataObject | undefined;

			if (Array.isArray(innerData)) {
				returnData.push(...(innerData as IDataObject[]));

				// Use cursor-based pagination
				if (pagination && pagination.has_more && pagination.next_cursor) {
					query.cursor = pagination.next_cursor as string;
				} else {
					hasMore = false;
				}
			} else if (innerData !== undefined) {
				// Single item wrapped in data.data
				returnData.push(outerData as IDataObject);
				hasMore = false;
			} else {
				// data is the actual content (single resource or flat collection)
				if (Array.isArray(outerData)) {
					returnData.push(...(outerData as IDataObject[]));
					hasMore = false;
				} else {
					returnData.push(outerData as IDataObject);
					hasMore = false;
				}
			}
		} else if (Array.isArray(response)) {
			returnData.push(...response);
			hasMore = false;
		} else {
			returnData.push(response);
			hasMore = false;
		}
	}

	return returnData;
}
