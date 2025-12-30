/**
 * Centralized constants for the Chariow n8n integration
 * All app-wide configuration values should be defined here
 */

//export const API_BASE_URL = 'https://api.chariow.com/v1';

export const API_BASE_URL = 'https://api.almabique-dev.com/v1';

/**
 * API Endpoints
 */
export const ENDPOINTS = {
	// Store
	STORE: '/store',

	// Customers
	CUSTOMERS: '/customers',
	CUSTOMER: (id: string) => `/customers/${id}`,

	// Products
	PRODUCTS: '/products',
	PRODUCT: (id: string) => `/products/${id}`,

	// Sales
	SALES: '/sales',
	SALE: (id: string) => `/sales/${id}`,

	// Licences
	LICENCES: '/licences',
	LICENCE: (id: string) => `/licences/${id}`,
	LICENCE_ACTIVATE: (id: string) => `/licences/${id}/activate`,
	LICENCE_REVOKE: (id: string) => `/licences/${id}/revoke`,
	LICENCE_ACTIVATIONS: (id: string) => `/licences/${id}/activations`,

	// Discounts
	DISCOUNTS: '/discounts',
	DISCOUNT: (id: string) => `/discounts/${id}`,

	// Checkouts
	CHECKOUTS: '/checkouts',

	// Connections (webhooks)
	CONNECTIONS_N8N: '/connections/n8n',
	CONNECTION_N8N: (id: string) => `/connections/n8n/${id}`,
} as const;
