# Coinbase Prime API TypeScript SDK

[![npm version](https://badge.fury.io/js/%40coinbase%2Fprime-sdk-ts.svg)](https://badge.fury.io/js/%40coinbase%2Fprime-sdk-ts)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Type-safe TypeScript client for the [Coinbase Prime API](https://docs.cdp.coinbase.com/prime/docs/welcome).

## Installation

```bash
npm install @coinbase/prime-sdk-ts
```

## Quick Start

Create a client with your API credentials, then call services directly:

```typescript
import {
  CoinbasePrimeClientWithServices,
  CoinbasePrimeCredentials,
} from '@coinbase/prime-sdk-ts';

const credentials = new CoinbasePrimeCredentials(
  process.env.PRIME_ACCESS_KEY!,
  process.env.PRIME_SECRET_KEY!,
  process.env.PRIME_PASSPHRASE!
);

const client = new CoinbasePrimeClientWithServices(credentials);

const portfolios = await client.portfolios.listPortfolios();
const orders = await client.orders.listPortfolioOrders({
  portfolioId: 'your-portfolio-id',
});
const wallets = await client.wallets.listWallets({
  portfolioId: 'your-portfolio-id',
});
```

`CoinbasePrimeClientWithServices` is the recommended client: services are lazy-loaded on first access.

### Authentication

Pass credentials into the client constructor. Load them from your secret manager, environment, or config — the SDK does not require a `.env` file.

| Field        | Description              |
| ------------ | ------------------------ |
| Access key   | Prime API access key     |
| Secret key   | Prime API secret key     |
| Passphrase   | Prime API passphrase     |

Portfolio, entity, and wallet IDs are **not** client bootstrap settings. Pass them as request parameters when calling endpoints that need them.

### Optional: load credentials from `PRIME_CREDENTIALS`

For local scripts, you can use `fromEnv()` instead of constructing credentials manually:

```typescript
import { CoinbasePrimeClientWithServices } from '@coinbase/prime-sdk-ts';

const client = CoinbasePrimeClientWithServices.fromEnv();
```

This reads a single environment variable:

```bash
export PRIME_CREDENTIALS='{"AccessKey":"...","SecretKey":"...","Passphrase":"..."}'
```

If `dotenv` is installed, `fromEnv()` will also load a local `.env` file when present. See [Development](#development) for running the repo examples.

## Usage Examples

### List Portfolios

```typescript
const portfolios = await client.portfolios.listPortfolios();
console.log(portfolios.portfolios);
```

### Get Assets

```typescript
const assets = await client.assets.listAssets({
  entityId: 'your-entity-id',
});
console.log(assets.assets);
```

### Create Order

```typescript
import { OrderSide, OrderType } from '@coinbase/prime-sdk-ts';

const order = await client.orders.createOrder({
  portfolioId: 'your-portfolio-id',
  productId: 'BTC-USD',
  side: OrderSide.Buy,
  type: OrderType.Market,
  baseQuantity: '0.001',
});
console.log(order.orderId);
```

See `examples/js/` and `examples/ts/` for more endpoint coverage.

## Configuration

### Pagination

Configure pagination at the client or request level:

```typescript
const client = new CoinbasePrimeClientWithServices(credentials, undefined, {
  maxPages: 5,
  maxItems: 1000,
  defaultLimit: 100,
});

const response = await client.transactions.listPortfolioTransactions(
  { portfolioId, limit: 50 },
  { maxPages: 10, maxItems: 500 }
);
```

Paginated responses also support manual control:

```typescript
const firstPage = await client.transactions.listPortfolioTransactions({
  portfolioId,
});

if (firstPage.hasNext()) {
  const secondPage = await firstPage.next();
}

const allTransactions = await firstPage.fetchAll(
  undefined,
  (page, totalItems) =>
    console.log(`Fetched page ${page}, total items: ${totalItems}`)
);
```

| Method                | Description                                | Returns                     |
| --------------------- | ------------------------------------------ | --------------------------- |
| **`hasNext()`**       | Check if more pages are available          | `boolean`                   |
| **`next()`**          | Fetch the next page                        | `Promise<Response \| null>` |
| **`fetchAll()`**      | Fetch all remaining pages and combine data | `Promise<DataArray[]>`      |
| **`getNextCursor()`** | Get the next page cursor                   | `string \| undefined`       |

## Alternative Import Patterns

The modular client above is recommended for most apps. These entry points are available when you need smaller bundles or explicit service wiring:

### Manual Client (`@coinbase/prime-sdk-ts/manual`)

```typescript
import {
  CoinbasePrimeClient,
  CoinbasePrimeCredentials,
  OrdersService,
  WalletsService,
} from '@coinbase/prime-sdk-ts/manual';

const client = new CoinbasePrimeClient(credentials);
const orders = new OrdersService(client);
const wallets = new WalletsService(client);
```

### Client + Services (`@coinbase/prime-sdk-ts/client` and `/services`)

```typescript
import {
  CoinbasePrimeClient,
  CoinbasePrimeCredentials,
} from '@coinbase/prime-sdk-ts/client';
import { OrdersService } from '@coinbase/prime-sdk-ts/services';

const client = new CoinbasePrimeClient(credentials);
const orders = new OrdersService(client);
```

### Bundle Size Comparison

| Import Pattern                   | Bundle Size | Use Case                             |
| -------------------------------- | ----------- | ------------------------------------ |
| **Modular Client** (recommended) | ~30kb       | Best developer experience            |
| **Manual Client**                | ~90kb       | Full control, all services available |
| **Services + Client**            | ~6kb        | Custom implementations               |
| **Individual Service**           | ~3kb        | Microservices, Lambda functions      |

### Type-Only Imports

```typescript
import type {
  CreateOrderRequest,
  OrderSide,
} from '@coinbase/prime-sdk-ts/types';
```

Prefer `import type` for annotations. Enums are also available as values from this entry if you need `OrderSide.Buy` at runtime.

### When to Use Which

- **Modular Client**: Default choice — best DX, good performance
- **Manual Client**: Need all services with explicit instantiation
- **Services-Only**: Microservices, custom clients, minimal bundles
- **Individual Services**: Lambda functions, single-purpose apps
- **Types-Only**: Shared libraries, type definitions

## TypeScript Support

```typescript
import {
  CoinbasePrimeClientWithServices,
  CoinbasePrimeCredentials,
  OrderSide,
  OrderType,
  CreateOrderRequest,
} from '@coinbase/prime-sdk-ts';

const client = new CoinbasePrimeClientWithServices(credentials);

const request: CreateOrderRequest = {
  portfolioId: 'your-id',
  productId: 'BTC-USD',
  side: OrderSide.Buy,
  type: OrderType.Market,
  baseQuantity: '0.001',
};

const order = await client.orders.createOrder(request);
```

## Development

For contributors working in this repository:

```bash
git clone https://github.com/coinbase/prime-sdk-ts.git
cd prime-sdk-ts
npm install
npm run build
```

### Running examples locally

Examples use `fromEnv()` and may read portfolio/entity/wallet IDs from the environment. Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

`.env.example` includes:

- `PRIME_CREDENTIALS` — required by the SDK client (`fromEnv()`)
- `PORTFOLIO_ID`, `ENTITY_ID`, `WALLET_ID` — used by examples as request parameters
- `BASE_URL` — optional API base URL override

#### JavaScript examples

Require a build first:

```bash
npm run build

node examples/js/portfolios/listPortfolios.js
node examples/js/orders/createOrder.js
node examples/js/wallets/listWallets.js
```

#### TypeScript examples

Run against source with `tsx` (no build required):

```bash
npm run example:ts examples/ts/portfolios/listPortfolios.ts
npm run example:ts examples/ts/orders/createOrder.ts
npm run example:ts examples/ts/wallets/listWallets.ts
npm run example:ts examples/ts/activities/getActivity.ts <activityId>

# Optional: typecheck all TypeScript examples
npm run check:examples
```

## License

This library is released under the [Apache License, Version 2.0](LICENSE).
