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
 * Example: Get Webhook Subscription Stats
 *
 * This example demonstrates how to retrieve delivery statistics for a single subscription over a fixed window.
 *
 * Usage:
 *   node examples/webhooks/getWebhookSubscriptionStats.js <subscriptionId> [period]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 *   - period (optional): WEBHOOK_STATS_PERIOD_24H, WEBHOOK_STATS_PERIOD_7D or
 *     WEBHOOK_STATS_PERIOD_30D
 */

// #docs operationId: PrimeBeta_GetWebhookSubscriptionStats
// #docs operationName: Get Webhook Subscription Stats

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];
const period = process.argv[3];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/getWebhookSubscriptionStats.js <subscriptionId> [period]'
  );
  process.exit(1);
}

async function getWebhookSubscriptionStatsExample() {
  try {
    console.log(`
      Getting webhook subscription stats - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}`);

    const request = { portfolioId, subscriptionId, period };

    const response = await client.webhooks.getWebhookSubscriptionStats(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: get webhook subscription stats failed:', error);
  }
}

getWebhookSubscriptionStatsExample();
