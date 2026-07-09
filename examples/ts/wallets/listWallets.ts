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
 * Example: List Wallets
 *
 * This example demonstrates how to retrieve all wallets for a specific portfolio
 * using the Wallets service. Wallets can be filtered by type and symbols.
 *
 * Usage:
 *   npm run example:ts examples/ts/wallets/listWallets.ts [walletType] [symbols]
 *
 * Examples:
 *   npm run example:ts examples/ts/wallets/listWallets.ts
 *   npm run example:ts examples/ts/wallets/listWallets.ts TRADING BTC,ETH
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio to list wallets for
 */

// #docs operationId: PrimeRESTAPI_GetWallets
// #docs operationName: List Wallets

import {
  CoinbasePrimeClientWithServices,
  ListWalletsRequest,
  WalletType,
} from '../../../src';

const client = CoinbasePrimeClientWithServices.fromEnv();
const type = process.argv[2] as WalletType | undefined;
const symbolsCsv = process.argv[3];

async function listWalletsExample(): Promise<void> {
  const portfolioId = process.env.PORTFOLIO_ID;
  if (!portfolioId) {
    console.error('Error: PORTFOLIO_ID environment variable is required');
    return;
  }
  try {
    let requestMessage = `💼 Listing wallets - Portfolio ID: ${portfolioId}`;
    if (type) requestMessage += ` - Type: ${type}`;
    if (symbolsCsv) requestMessage += ` - Symbols: ${symbolsCsv}`;
    console.log(requestMessage);

    const request: ListWalletsRequest = {
      portfolioId,
      type,
      symbols: symbolsCsv ? symbolsCsv.split(',') : undefined,
    };

    const walletsResponse = await client.wallets.listWallets(request);

    console.dir(walletsResponse, { depth: null });
  } catch (error: unknown) {
    console.error('❌ Error listing wallets:', error);
  }
}

listWalletsExample();
