# n8n-nodes-chariow

This is an n8n community node that lets you use [Chariow](https://chariow.com) in your n8n workflows.

Chariow is a digital products platform that helps creators and entrepreneurs sell their content, products, and services across borders without hassle.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-chariow
```

### Docker

If you're using Docker, add the package to your n8n instance:

```bash
docker exec -it n8n npm install n8n-nodes-chariow
```

Then restart your n8n instance.

## Operations

### Chariow Node (Actions)

This node supports the following resources and operations:

#### Customer
- **Get**: Retrieve a customer by ID
- **Get Many**: List customers with optional search filter

#### Product
- **Get**: Retrieve a product by ID
- **Get Many**: List products with optional filters (search, status)

#### Sale
- **Get**: Retrieve a sale by ID
- **Get Many**: List sales with optional filters (customer_id, product_id, status)

#### Discount
- **Get**: Retrieve a discount by ID or code
- **Get Many**: List discounts with optional filters (search, status)

#### Licence
- **Get**: Retrieve a licence by ID or key
- **Get Many**: List licences with optional filters (customer_id, product_id, search, status)
- **Activate**: Activate a licence with optional device information
- **Revoke**: Revoke a licence
- **Get Activations**: List activations for a licence

#### Checkout
- **Create**: Create a new checkout session with optional customer info, discount code, and custom fields

#### Store
- **Get Info**: Retrieve your store information

### Chariow Trigger Node (Webhooks)

Automatically start workflows when events occur in Chariow:

#### Sale Events
- `successful.sale` - When a sale is completed successfully
- `abandoned.sale` - When a sale is abandoned
- `failed.sale` - When a sale fails
- `refunded.sale` - When a sale is refunded

#### Licence Events
- `activated.licence` - When a licence is activated
- `expired.licence` - When a licence expires
- `issued.licence` - When a new licence is issued
- `revoked.licence` - When a licence is revoked

## Credentials

To use this node, you'll need a Chariow API key:

1. Log in to your [Chariow dashboard](https://app.chariow.com)
2. Go to **Settings** > **API Keys**
3. Create a new API key or copy an existing one
4. The API key should start with `sk_live_` (production) or `sk_test_` (testing)

## Compatibility

- Tested with n8n version 1.0.0 and above
- Requires Node.js 18.10 or higher

## Usage

### Basic Example: Get Customer Data

1. Add the **Chariow** node to your workflow
2. Select **Customer** as the resource
3. Select **Get** as the operation
4. Enter the Customer ID (e.g., `cus_abc123xyz`)
5. Execute the node

### Webhook Example: Process New Sales

1. Add the **Chariow Trigger** node to your workflow
2. Select **Sale** as the event category
3. Select **Successful** as the event type
4. Activate the workflow
5. The workflow will trigger whenever a new successful sale occurs

### Create Checkout Example

1. Add the **Chariow** node to your workflow
2. Select **Checkout** as the resource
3. Select **Create** as the operation
4. Enter the Product ID
5. Optionally add customer email, discount code, or custom fields
6. Execute to get a checkout URL

## Development

### Prerequisites

- Node.js 18.10+
- pnpm 9.1+
- n8n installed globally (for local testing)

### Setup

```bash
# Clone the repository
git clone https://github.com/Chariow/n8n-nodes.git
cd n8n-nodes

# Install dependencies
pnpm install

# Build the node
pnpm build
```

### Local Testing

There are two ways to test the node locally:

#### Option 1: Using n8n-node dev (Recommended)

```bash
# Build and start n8n with the custom node
pnpm test:local
```

This will start n8n with your custom node loaded. Access n8n at `http://localhost:5678`.

#### Option 2: Link to existing n8n installation

```bash
# Build the node
pnpm build

# Link to your global n8n
pnpm link --global

# In your n8n custom nodes directory (~/.n8n/custom)
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
pnpm link --global n8n-nodes-chariow

# Restart n8n
n8n start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build the node |
| `pnpm build:watch` | Build and watch for changes |
| `pnpm dev` | Start n8n with the custom node |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test:local` | Build and start n8n for testing |

### Project Structure

```
chariow-n8n/
├── credentials/
│   └── ChariowApi.credentials.ts
├── nodes/
│   └── Chariow/
│       ├── Chariow.node.ts
│       ├── ChariowTrigger.node.ts
│       ├── shared/
│       │   ├── transport.ts
│       │   ├── utils.ts
│       │   └── descriptions.ts
│       └── resources/
│           ├── customer/
│           ├── product/
│           ├── sale/
│           ├── discount/
│           ├── licence/
│           ├── checkout/
│           └── store/
├── icons/
│   └── chariow.svg
└── dist/                    # Built output
```

## Resources

* [Chariow Documentation](https://docs.chariow.com/)
* [Chariow API Reference](https://docs.chariow.com/api)
* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Support

For issues with this node, please [open an issue](https://github.com/Chariow/n8n-nodes/issues) on GitHub.

For questions about Chariow, contact [support@chariow.com](mailto:support@chariow.com).

## License

[MIT](LICENSE.md)
