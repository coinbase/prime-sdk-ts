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
 * Example: Get Webhook Delivery Attempts
 *
 * This example demonstrates how to list every HTTP delivery attempt for an event on a subscription.
 *
 * Usage:
 *   node examples/webhooks/getWebhookDeliveryAttempts.js <subscriptionId> <eventId>
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 *   - eventId (required): The webhook event ID (see getWebhookDeliveryLogs.js)
 */

// #docs operationId: PrimeBeta_GetWebhookDeliveryAttempts
// #docs operationName: Get Webhook Delivery Attempts

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];
const eventId = process.argv[3];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/getWebhookDeliveryAttempts.js <subscriptionId> <eventId>'
  );
  process.exit(1);
}

if (!eventId) {
  console.error('Error: eventId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/getWebhookDeliveryAttempts.js <subscriptionId> <eventId>'
  );
  process.exit(1);
}

async function getWebhookDeliveryAttemptsExample() {
  try {
    console.log(`
      Getting webhook delivery attempts - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}
      Event ID: ${eventId}`);

    const request = { portfolioId, subscriptionId, eventId };

    const response = await client.webhooks.getWebhookDeliveryAttempts(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: get webhook delivery attempts failed:', error);
  }
}

getWebhookDeliveryAttemptsExample();
