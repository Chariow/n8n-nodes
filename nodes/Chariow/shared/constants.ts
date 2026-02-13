/**
 * Centralized constants for the Chariow n8n integration
 * All app-wide configuration values should be defined here
 */

export const API_BASE_URL = 'https://api.chariow.com/v1';

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

	// Licenses
	LICENSES: '/licenses',
	LICENSE: (id: string) => `/licenses/${id}`,
	LICENSE_ACTIVATE: (id: string) => `/licenses/${id}/activate`,
	LICENSE_REVOKE: (id: string) => `/licenses/${id}/revoke`,
	LICENSE_ACTIVATIONS: (id: string) => `/licenses/${id}/activations`,

	// Discounts
	DISCOUNTS: '/discounts',
	DISCOUNT: (id: string) => `/discounts/${id}`,

	// Pulses (webhooks)
	PULSES: '/pulses',
	PULSE: (id: string) => `/pulses/${id}`,

	// Checkout
	CHECKOUT: '/checkout',

	// Connections (webhooks)
	CONNECTIONS_N8N: '/connections/n8n',
	CONNECTION_N8N: (id: string) => `/connections/n8n/${id}`,

	// Affiliates
	AFFILIATE: (code: string) => `/affiliates/${code}`,
	AFFILIATE_INVITATIONS: '/affiliates/invitations',
} as const;
