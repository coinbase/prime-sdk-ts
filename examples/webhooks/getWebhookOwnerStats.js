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
 * Example: Get Webhook Owner Stats
 *
 * This example demonstrates how to retrieve a rollup of delivery statistics across all webhook subscriptions for
 * a portfolio.
 *
 * Usage:
 *   node examples/webhooks/getWebhookOwnerStats.js [period]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - period (optional): WEBHOOK_STATS_PERIOD_24H, WEBHOOK_STATS_PERIOD_7D or
 *     WEBHOOK_STATS_PERIOD_30D
 */

// #docs operationId: PrimeBeta_GetWebhookOwnerStats
// #docs operationName: Get Webhook Owner Stats

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const period = process.argv[2];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

async function getWebhookOwnerStatsExample() {
  try {
    console.log(`
      Getting webhook owner stats - Portfolio ID: ${portfolioId}`);

    const request = { portfolioId, period };

    const response = await client.webhooks.getWebhookOwnerStats(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: get webhook owner stats failed:', error);
  }
}

getWebhookOwnerStatsExample();
