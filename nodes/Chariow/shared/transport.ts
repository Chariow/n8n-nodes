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

		// Handle wrapped response format
		if (response && typeof response === 'object' && 'data' in response) {
			return response as IDataObject;
		}

		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated API request and return all items (handles pagination)
 */
export async function chariowApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const perPage = 100;

	query.per_page = perPage;

	let hasMore = true;

	while (hasMore) {
		query.page = page;

		const response = await chariowApiRequest.call(this, method, endpoint, body, query);

		// Handle paginated response
		if (response.data && Array.isArray(response.data)) {
			returnData.push(...(response.data as IDataObject[]));

			// Check if there are more pages
			const meta = response.meta as IDataObject | undefined;
			if (meta && meta.current_page && meta.last_page) {
				hasMore = (meta.current_page as number) < (meta.last_page as number);
			} else {
				hasMore = (response.data as IDataObject[]).length === perPage;
			}
		} else if (Array.isArray(response)) {
			returnData.push(...response);
			hasMore = response.length === perPage;
		} else {
			// Single item response
			returnData.push(response);
			hasMore = false;
		}

		page++;
	}

	return returnData;
}
