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
 * Example: Get Portfolio Derivatives Currency Summary
 *
 * This example demonstrates how to retrieve per-currency international
 * derivatives balances for a portfolio using the Futures service. US Futures
 * balances roll up to a single clearing account per entity rather than per
 * portfolio, and are available from the entity futures balance summary and
 * risk limits endpoints instead.
 *
 * Usage:
 *   node examples/futures/getDerivativesCurrencySummary.js
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio to get derivatives balances for
 */

// #docs operationId: PrimeRESTAPI_GetDerivativesCurrencySummary
// #docs operationName: Get Portfolio Derivatives Currency Summary

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  return;
}

async function getDerivativesCurrencySummaryExample() {
  try {
    console.log(
      `📊 Getting derivatives currency summary - Portfolio ID: ${portfolioId}`
    );

    const response = await client.futures.getDerivativesCurrencySummary({
      portfolioId,
    });

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('❌ Error getting derivatives currency summary:', error);
  }
}

getDerivativesCurrencySummaryExample();
