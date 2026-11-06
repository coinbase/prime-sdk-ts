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
 * Example: Update Webhook Subscription
 *
 * This example demonstrates how to partially update a webhook subscription. Only the fields supplied on the
 * command line are changed; updateMask.paths is derived from them (snake_case field names).
 *
 * Usage:
 *   node examples/webhooks/updateWebhookSubscription.js <subscriptionId> [targetUrl] [isEnabled]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 *   - targetUrl (optional): New HTTPS delivery URL (use '-' to skip)
 *   - isEnabled (optional): 'true' or 'false' to enable/disable the subscription
 */

// #docs operationId: PrimeBeta_UpdateWebhookSubscription
// #docs operationName: Update Webhook Subscription

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];
const targetUrl =
  process.argv[3] && process.argv[3] !== '-' ? process.argv[3] : undefined;
const isEnabledArg = process.argv[4];
const isEnabled =
  isEnabledArg === undefined ? undefined : isEnabledArg === 'true';

const updateMaskFields = [];
if (targetUrl !== undefined) updateMaskFields.push('target_url');
if (isEnabled !== undefined) updateMaskFields.push('is_enabled');

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/updateWebhookSubscription.js <subscriptionId> [targetUrl] [isEnabled]'
  );
  process.exit(1);
}

if (updateMaskFields.length === 0) {
  console.error(
    'Error: provide at least one of targetUrl or isEnabled to update'
  );
  console.error(
    'Usage: node examples/webhooks/updateWebhookSubscription.js <subscriptionId> [targetUrl] [isEnabled]'
  );
  process.exit(1);
}

async function updateWebhookSubscriptionExample() {
  try {
    console.log(`
      Updating webhook subscription - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}
      Fields: ${updateMaskFields.join(', ')}`);

    const request = {
      portfolioId,
      subscriptionId,
      targetUrl,
      isEnabled,
      updateMask: { paths: updateMaskFields },
    };

    const response = await client.webhooks.updateWebhookSubscription(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: update webhook subscription failed:', error);
  }
}

updateWebhookSubscriptionExample();
