import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import { chariowApiRequest, extractData, ENDPOINTS } from '../../shared';

export const description: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'The product ID or slug to purchase (e.g., prd_abc123xyz or premium-course)',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'Customer email address (max 255 characters)',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'Customer first name (max 50 characters)',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'Customer last name (max 50 characters)',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'Phone number (numeric only)',
	},
	{
		displayName: 'Phone Country Code',
		name: 'phoneCountryCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		placeholder: 'US',
		description: 'ISO country code for phone number (e.g., US, FR, GB)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Affiliate Code',
				name: 'affiliateCode',
				type: 'string',
				default: '',
				description: 'Affiliate tracking code for commissions (max 50 characters)',
			},
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				description: 'Campaign ID or tracking code for analytics',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom field values matching product configuration',
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'The key of the custom field',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The value of the custom field',
							},
						],
					},
				],
			},
			{
				displayName: 'Custom Metadata',
				name: 'customMetadata',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description:
					'Custom key-value metadata to store with the sale (max 10 keys, 255 chars per value). Included in Pulse webhook payloads.',
				options: [
					{
						name: 'metadata',
						displayName: 'Metadata',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'The metadata key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The metadata value (max 255 characters)',
							},
						],
					},
				],
			},
			{
				displayName: 'Customer IP Address',
				name: 'customerIp',
				type: 'string',
				default: '',
				placeholder: '203.0.113.42',
				description:
					"The buyer's IP address (IPv4 or IPv6). Workflows run on your n8n instance, so without this the sale records the instance IP instead of the buyer's. Map it from the trigger that captured the buyer, such as a webhook or form submission.",
			},
			{
				displayName: 'Discount Code',
				name: 'discountCode',
				type: 'string',
				default: '',
				description: 'Discount code to apply (max 100 characters)',
			},
			{
				displayName: 'Payment Amount',
				name: 'paymentAmount',
				type: 'number',
				default: 0,
				description: 'Custom payment amount for pay-what-you-want products',
			},
			{
				displayName: 'Payment Currency',
				name: 'paymentCurrency',
				type: 'string',
				default: '',
				placeholder: 'USD',
				description: 'ISO 4217 currency code (defaults to store currency)',
			},
			{
				displayName: 'Price Variant ID',
				name: 'priceVariantId',
				type: 'string',
				default: '',
				description: 'Price variant ID to use for this checkout (max 100 characters)',
			},
			{
				displayName: 'Redirect URL',
				name: 'redirectUrl',
				type: 'string',
				default: '',
				description:
					'Custom URL to redirect customers after payment completion (max 2048 characters)',
			},
		],
	},
	{
		displayName: 'Shipping Address',
		name: 'shippingAddress',
		type: 'collection',
		placeholder: 'Add Shipping Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		description: 'Required when product has shipping enabled',
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Street address (max 255 characters)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name (max 100 characters)',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				placeholder: 'US',
				description: 'ISO 3166-1 alpha-2 country code (e.g., US, FR, GB)',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or region (max 100 characters)',
			},
			{
				displayName: 'ZIP Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Postal/ZIP code (max 20 characters)',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const productId = this.getNodeParameter('productId', i) as string;
	const email = this.getNodeParameter('email', i) as string;
	const firstName = this.getNodeParameter('firstName', i) as string;
	const lastName = this.getNodeParameter('lastName', i) as string;
	const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
	const phoneCountryCode = this.getNodeParameter('phoneCountryCode', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const shippingAddress = this.getNodeParameter('shippingAddress', i) as IDataObject;

	const body: IDataObject = {
		product_id: productId,
		email,
		first_name: firstName,
		last_name: lastName,
		phone: {
			number: phoneNumber,
			country_code: phoneCountryCode,
		},
	};

	// Optional fields
	if (additionalFields.discountCode) {
		body.discount_code = additionalFields.discountCode;
	}
	if (additionalFields.campaignId) {
		body.campaign_id = additionalFields.campaignId;
	}
	if (additionalFields.paymentCurrency) {
		body.payment_currency = additionalFields.paymentCurrency;
	}
	if (additionalFields.redirectUrl) {
		body.redirect_url = additionalFields.redirectUrl;
	}
	if (additionalFields.affiliateCode) {
		body.affiliate_code = additionalFields.affiliateCode;
	}
	if (additionalFields.priceVariantId) {
		body.price_variant_id = additionalFields.priceVariantId;
	}
	if (additionalFields.paymentAmount) {
		body.payment_amount = additionalFields.paymentAmount;
	}
	if (additionalFields.customerIp) {
		body.customer_ip = (additionalFields.customerIp as string).trim();
	}

	// Handle custom fields
	const customFieldsData = additionalFields.customFields as IDataObject | undefined;
	if (customFieldsData?.field) {
		const customFields: IDataObject = {};
		const fields = customFieldsData.field as Array<{ key: string; value: string }>;
		for (const field of fields) {
			customFields[field.key] = field.value;
		}
		body.custom_fields = customFields;
	}

	// Handle custom metadata
	const customMetadataData = additionalFields.customMetadata as IDataObject | undefined;
	if (customMetadataData?.metadata) {
		const customMetadata: IDataObject = {};
		const metadataItems = customMetadataData.metadata as Array<{ key: string; value: string }>;
		for (const item of metadataItems) {
			customMetadata[item.key] = item.value;
		}
		body.custom_metadata = customMetadata;
	}

	// Handle shipping address as nested object
	if (shippingAddress && Object.keys(shippingAddress).length > 0) {
		const shipping: IDataObject = {};
		if (shippingAddress.address) {
			shipping.address = shippingAddress.address;
		}
		if (shippingAddress.city) {
			shipping.city = shippingAddress.city;
		}
		if (shippingAddress.state) {
			shipping.state = shippingAddress.state;
		}
		if (shippingAddress.country) {
			shipping.country = shippingAddress.country;
		}
		if (shippingAddress.zip) {
			shipping.zip = shippingAddress.zip;
		}
		if (Object.keys(shipping).length > 0) {
			body.shipping = shipping;
		}
	}

	const response = await chariowApiRequest.call(this, 'POST', ENDPOINTS.CHECKOUT, body);
	return extractData(response) as IDataObject;
}
