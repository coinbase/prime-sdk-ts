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
 * Example: Delete Webhook Subscription
 *
 * This example demonstrates how to soft-delete a webhook subscription. The subscription stops matching events
 * immediately; audit history is retained.
 *
 * Usage:
 *   node examples/webhooks/deleteWebhookSubscription.js <subscriptionId>
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 */

// #docs operationId: PrimeBeta_DeleteWebhookSubscription
// #docs operationName: Delete Webhook Subscription

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
    'Usage: node examples/webhooks/deleteWebhookSubscription.js <subscriptionId>'
  );
  process.exit(1);
}

async function deleteWebhookSubscriptionExample() {
  try {
    console.log(`
      Deleting webhook subscription - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}`);

    const request = { portfolioId, subscriptionId };

    const response = await client.webhooks.deleteWebhookSubscription(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: delete webhook subscription failed:', error);
  }
}

deleteWebhookSubscriptionExample();
