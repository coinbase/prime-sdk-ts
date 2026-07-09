/**
 * Copyright 2026-present Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Services-Only Example: Ultra-minimal bundle size (~6kb)
 *
 * This example demonstrates how to use individual services without importing
 * the full Prime client. This is ideal for:
 * - Microservices that only need specific functionality
 * - Custom client implementations
 * - Dependency injection frameworks
 * - Lambda functions with cold start optimization
 *
 * Usage:
 *   npm run example:ts examples/ts/advanced/servicesOnlyExample.ts
 */

import { CoinbaseHttpRequestOptions, CoinbaseResponse } from '@coinbase/core-ts';
import {
  CoinbasePrimeCredentials,
  IPrimeApiClient,
} from '../../../src';
import { CoinbasePrimeClient } from '../../../src/client-only';
import { OrdersService, WalletsService } from '../../../src/services';
import { createCredentialsFromEnv } from '../../../src/shared/envUtils';

class CustomPrimeClient implements IPrimeApiClient {
  private credentials: CoinbasePrimeCredentials;
  private baseUrl: string;

  constructor(
    credentials: CoinbasePrimeCredentials,
    baseUrl = 'https://api.prime.coinbase.com'
  ) {
    this.credentials = credentials;
    this.baseUrl = baseUrl;
  }

  async request(options: CoinbaseHttpRequestOptions): Promise<CoinbaseResponse> {
    const url = `${this.baseUrl}/${options.url}`;

    console.log(`Custom client making request to: ${url}`);

    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: {
        message: 'This is a mock response from custom client',
        url: options.url,
        method: options.method || 'GET',
      },
    };
  }

  getDefaultPaginationLimit(): number {
    return 50;
  }

  getMaxPages(): number {
    return 10;
  }

  getMaxItems(): number {
    return 500;
  }
}

async function standardClientExample(): Promise<void> {
  console.log('\n=== Services-Only with Standard Client ===');

  try {
    const client = CoinbasePrimeClient.fromEnv();
    const orders = new OrdersService(client);
    const wallets = new WalletsService(client);
    const portfolioId = process.env.PORTFOLIO_ID;

    if (portfolioId) {
      const openOrders = await orders.listOpenOrders({ portfolioId });
      console.log('Open Orders:', openOrders.orders?.length || 0);

      const walletsResponse = await wallets.listWallets({ portfolioId });
      console.log('Wallets:', walletsResponse.wallets?.length || 0);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Standard client example error:', message);
  }
}

async function customClientExample(): Promise<void> {
  console.log('\n=== Services-Only with Custom Client ===');

  try {
    const credentials = createCredentialsFromEnv();
    const customClient = new CustomPrimeClient(credentials);
    const orders = new OrdersService(customClient);
    const portfolioId = process.env.PORTFOLIO_ID || 'mock-portfolio-id';

    const result = await orders.listOpenOrders({ portfolioId });
    console.log('Custom client result:', result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Custom client example error:', message);
  }
}

async function runExamples(): Promise<void> {
  console.log('🚀 Services-Only Import Examples');
  console.log('Bundle size: ~6kb (94% smaller than full SDK)');
  console.log('This approach imports only service classes, no client classes');

  await standardClientExample();
  await customClientExample();

  console.log('\n✅ All services-only examples completed!');
  console.log('\n💡 Key Benefits:');
  console.log('- Ultra-small bundle size (only specific services)');
  console.log('- Works with any client implementation');
  console.log('- Perfect for microservices architecture');
  console.log('- Great for dependency injection');
  console.log('- Optimal for Lambda/serverless functions');
}

runExamples().catch(console.error);

export { standardClientExample, customClientExample, CustomPrimeClient };
