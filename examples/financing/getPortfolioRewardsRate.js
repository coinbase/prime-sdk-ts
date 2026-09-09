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
 * Example: Get Portfolio Rewards Rate (Beta)
 *
 * This example demonstrates how to retrieve the current rewards rate and
 * available rate tiers for a portfolio.
 *
 * Usage:
 *   node examples/financing/getPortfolioRewardsRate.js [portfolioId]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The Prime Portfolio ID
 */

// #docs operationId: PrimeBeta_GetPortfolioRewardsRate
// #docs operationName: Get Portfolio Rewards Rate

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.argv[2] || process.env.PORTFOLIO_ID;

if (!portfolioId) {
  console.error(
    'Error: PORTFOLIO_ID environment variable or command line argument is required'
  );
  process.exit(1);
}

async function getPortfolioRewardsRateExample() {
  try {
    console.log(
      `Getting portfolio rewards rate - Portfolio ID: ${portfolioId}`
    );

    const request = { portfolioId };

    const response = await client.financing.getPortfolioRewardsRate(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error:', error);
  }
}

getPortfolioRewardsRateExample();
