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
 * Example: List Portfolio Derivative Positions
 *
 * This example demonstrates how to retrieve all active derivative positions
 * for a portfolio using the Futures service. You can optionally filter by a
 * specific product ID.
 *
 * Usage:
 *   node examples/futures/listDerivativePositions.js [productId]
 *
 * Examples:
 *   node examples/futures/listDerivativePositions.js
 *   node examples/futures/listDerivativePositions.js BTC-PERP
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio to list derivative positions for
 */

// #docs operationId: PrimeRESTAPI_GetDerivativePositions
// #docs operationName: List Portfolio Derivative Positions

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const productId = process.argv[2];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  return;
}

async function listDerivativePositionsExample() {
  try {
    let requestMessage = `📈 Listing derivative positions - Portfolio ID: ${portfolioId}`;
    if (productId) requestMessage += `, Product ID: ${productId}`;
    console.log(requestMessage);

    const request = {
      portfolioId,
    };

    if (productId) request.productId = productId;

    const response = await client.futures.listDerivativePositions(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('❌ Error listing derivative positions:', error);
  }
}

listDerivativePositionsExample();
