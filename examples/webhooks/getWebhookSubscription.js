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
 * Example: Get Webhook Subscription
 *
 * This example demonstrates how to retrieve a single webhook subscription by ID.
 *
 * Usage:
 *   node examples/webhooks/getWebhookSubscription.js <subscriptionId>
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 */

// #docs operationId: PrimeBeta_GetWebhookSubscription
// #docs operationName: Get Webhook Subscription

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/getWebhookSubscription.js <subscriptionId>'
  );
  process.exit(1);
}

async function getWebhookSubscriptionExample() {
  try {
    console.log(`
      Getting webhook subscription - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}`);

    const request = { portfolioId, subscriptionId };

    const response = await client.webhooks.getWebhookSubscription(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: get webhook subscription failed:', error);
  }
}

getWebhookSubscriptionExample();
