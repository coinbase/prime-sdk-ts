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
 * Example: Create Webhook Subscription
 *
 * This example demonstrates how to create a webhook subscription. The HMAC signing secret is returned exactly
 * once; it is redacted in the output unless SHOW_HMAC_SECRET=true is set.
 * Use getWebhookEventTypes.js to list the available event types.
 *
 * Usage:
 *   node examples/webhooks/createWebhookSubscription.js <eventTypes> <targetUrl> [authType]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *   - SHOW_HMAC_SECRET: (Optional) Set to 'true' to print the returned HMAC secret
 *
 * Arguments:
 *   - eventTypes (required): Comma-separated list of event types to subscribe to
 *   - targetUrl (required): HTTPS URL that will receive webhook deliveries
 *   - authType (optional): WebhookAuthType value (default: WEBHOOK_AUTH_TYPE_HMAC)
 */

// #docs operationId: PrimeBeta_CreateWebhookSubscription
// #docs operationName: Create Webhook Subscription

const { randomUUID } = require('crypto');
const {
  CoinbasePrimeClientWithServices,
  WebhookAuthType,
} = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const eventTypes = (process.argv[2] || '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);
const targetUrl = process.argv[3];
const authType = process.argv[4] || WebhookAuthType.WebhookAuthTypeHmac;

if (eventTypes.length === 0 || !targetUrl) {
  console.error(
    'Error: eventTypes and targetUrl command line arguments are required'
  );
  console.error(
    'Usage: node examples/webhooks/createWebhookSubscription.js <eventTypes> <targetUrl> [authType]'
  );
  process.exit(1);
}

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

// The HMAC secret is only returned once and is a credential, so it is redacted
// unless explicitly requested with SHOW_HMAC_SECRET=true.
function redactSecret(response) {
  if (process.env.SHOW_HMAC_SECRET === 'true' || !response.hmacSecret) {
    return response;
  }
  return {
    ...response,
    hmacSecret: '[REDACTED - set SHOW_HMAC_SECRET=true to display]',
  };
}

async function createWebhookSubscriptionExample() {
  try {
    console.log(`
      Creating webhook subscription - Portfolio ID: ${portfolioId}
      Target URL: ${targetUrl}
      Event types: ${eventTypes.join(', ')}`);

    const request = {
      portfolioId,
      eventTypes,
      targetUrl,
      authType,
      description: 'Created by prime-sdk-ts example',
      idempotencyKey: randomUUID(),
    };

    const response = await client.webhooks.createWebhookSubscription(request);

    console.dir(redactSecret(response), { depth: null });
  } catch (error) {
    console.error('Error: create webhook subscription failed:', error);
  }
}

createWebhookSubscriptionExample();
