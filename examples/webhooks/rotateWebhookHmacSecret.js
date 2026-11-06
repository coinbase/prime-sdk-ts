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
 * Example: Rotate Webhook HMAC Secret
 *
 * This example demonstrates how to rotate the HMAC signing secret of a subscription. The new secret is returned
 * exactly once; it is redacted in the output unless SHOW_HMAC_SECRET=true is set.
 *
 * Usage:
 *   node examples/webhooks/rotateWebhookHmacSecret.js <subscriptionId> [revokePreviousImmediately]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *   - SHOW_HMAC_SECRET: (Optional) Set to 'true' to print the returned HMAC secret
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 *   - revokePreviousImmediately (optional): 'true' to invalidate the old secret at once
 *     instead of keeping it valid for the server grace window
 */

// #docs operationId: PrimeBeta_RotateWebhookHMACSecret
// #docs operationName: Rotate Webhook HMAC Secret

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];
const revokePreviousImmediately = process.argv[3] === 'true';

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/rotateWebhookHmacSecret.js <subscriptionId> [revokePreviousImmediately]'
  );
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

async function rotateWebhookHmacSecretExample() {
  try {
    console.log(`
      Rotating webhook HMAC secret - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}
      Revoke previous immediately: ${revokePreviousImmediately}`);

    const request = { portfolioId, subscriptionId, revokePreviousImmediately };

    const response = await client.webhooks.rotateWebhookHmacSecret(request);

    console.dir(redactSecret(response), { depth: null });
  } catch (error) {
    console.error('Error: rotate webhook hmac secret failed:', error);
  }
}

rotateWebhookHmacSecretExample();
