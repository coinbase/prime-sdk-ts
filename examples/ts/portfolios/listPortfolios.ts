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
 * Example: List Portfolios
 *
 * This example demonstrates how to list all portfolios for the authenticated entity.
 *
 * Usage:
 *   npm run example:ts examples/ts/portfolios/listPortfolios.ts
 *
 * Example:
 *   npm run example:ts examples/ts/portfolios/listPortfolios.ts
 */

// #docs operationId: PrimeRESTAPI_GetPortfolios
// #docs operationName: List Portfolios

import { CoinbasePrimeClientWithServices } from '../../../src';

const client = CoinbasePrimeClientWithServices.fromEnv();

async function listPortfoliosExample(): Promise<void> {
  try {
    console.log('📁 Listing portfolios');

    const response = await client.portfolios.listPortfolios();

    console.dir(response, { depth: null });
  } catch (error: unknown) {
    console.error(error);
  }
}

listPortfoliosExample();
