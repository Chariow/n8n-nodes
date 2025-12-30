import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ChariowApi implements ICredentialType {
	name = 'chariowApi';

	displayName = 'Chariow API';

	documentationUrl = 'https://docs.chariow.com/en/introduction/overview';

	icon = {
		light: 'file:../icons/chariow.svg',
		dark: 'file:../icons/chariow.svg',
	} as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Chariow API Key. Find it in your store settings under API Keys. It should start with sk_.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Platform-Source': 'n8n',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.chariow.com/v1',
			url: '/store',
		},
	};
}
