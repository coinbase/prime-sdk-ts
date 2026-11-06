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
 * Example: Replay Webhook Event
 *
 * This example demonstrates how to replay a previously published event. When a subscriptionId is supplied the
 * event is re-delivered to that subscription only; otherwise it is re-delivered to
 * every matching subscription for the portfolio.
 *
 * Usage:
 *   node examples/webhooks/replayWebhookEvent.js <eventId> [subscriptionId]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - eventId (required): The webhook event ID to replay
 *   - subscriptionId (optional): Re-deliver to this subscription only
 */

// #docs operationId: PrimeBeta_ReplayWebhookEvent
// #docs operationName: Replay Webhook Event

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const eventId = process.argv[2];
const subscriptionId = process.argv[3];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

if (!eventId) {
  console.error('Error: eventId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/replayWebhookEvent.js <eventId> [subscriptionId]'
  );
  process.exit(1);
}

async function replayWebhookEventExample() {
  try {
    console.log(`
      Replaying webhook event - Portfolio ID: ${portfolioId}
      Event ID: ${eventId}`);

    const request = { portfolioId, eventId, subscriptionId };

    const response = await client.webhooks.replayWebhookEvent(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: replay webhook event failed:', error);
  }
}

replayWebhookEventExample();
