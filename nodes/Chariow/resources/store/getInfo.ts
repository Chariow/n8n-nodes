import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [];

export async function execute(this: IExecuteFunctions): Promise<IDataObject> {
	const response = await chariowApiRequest.call(this, 'GET', ENDPOINTS.STORE);
	return extractData(response) as IDataObject;
}
