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
 * Example: Send Webhook Simulation
 *
 * This example demonstrates how to send a synthetic test event to a subscription's endpoint for integration
 * testing.
 *
 * Usage:
 *   node examples/webhooks/sendWebhookSimulation.js <subscriptionId> <eventType>
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 *   - eventType (required): The event type to simulate (see getWebhookEventTypes.js)
 */

// #docs operationId: PrimeBeta_SendWebhookSimulation
// #docs operationName: Send Webhook Simulation

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];
const eventType = process.argv[3];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/sendWebhookSimulation.js <subscriptionId> <eventType>'
  );
  process.exit(1);
}

if (!eventType) {
  console.error('Error: eventType command line argument is required');
  console.error(
    'Usage: node examples/webhooks/sendWebhookSimulation.js <subscriptionId> <eventType>'
  );
  process.exit(1);
}

async function sendWebhookSimulationExample() {
  try {
    console.log(`
      Sending webhook simulation - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}
      Event type: ${eventType}`);

    const request = { portfolioId, subscriptionId, eventType };

    const response = await client.webhooks.sendWebhookSimulation(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: send webhook simulation failed:', error);
  }
}

sendWebhookSimulationExample();
