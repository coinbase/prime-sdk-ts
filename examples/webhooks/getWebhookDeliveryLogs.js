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
 * Example: Get Webhook Delivery Logs
 *
 * This example demonstrates how to list the delivery logs for a subscription. Results are cursor-paginated; the
 * response exposes hasNext()/next()/fetchAll() helpers.
 *
 * Usage:
 *   node examples/webhooks/getWebhookDeliveryLogs.js <subscriptionId> [statusFilter] [eventTypeFilter]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - subscriptionId (required): The webhook subscription ID
 *   - statusFilter (optional): WebhookDeliveryStatus value, e.g. WEBHOOK_DELIVERY_STATUS_FAILED
 *   - eventTypeFilter (optional): Only return deliveries for this event type
 */

// #docs operationId: PrimeBeta_GetWebhookDeliveryLogs
// #docs operationName: Get Webhook Delivery Logs

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const subscriptionId = process.argv[2];
const statusFilter = process.argv[3];
const eventTypeFilter = process.argv[4];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}
if (!subscriptionId) {
  console.error('Error: subscriptionId command line argument is required');
  console.error(
    'Usage: node examples/webhooks/getWebhookDeliveryLogs.js <subscriptionId> [statusFilter] [eventTypeFilter]'
  );
  process.exit(1);
}

async function getWebhookDeliveryLogsExample() {
  try {
    console.log(`
      Getting webhook delivery logs - Portfolio ID: ${portfolioId}
      Subscription ID: ${subscriptionId}`);

    const request = {
      portfolioId,
      subscriptionId,
      statusFilter,
      eventTypeFilter,
    };

    const response = await client.webhooks.getWebhookDeliveryLogs(request);

    console.dir(response, { depth: null });

    if (response.hasNext()) {
      console.log(
        'More pages available. Next cursor:',
        response.getNextCursor()
      );
    }
  } catch (error) {
    console.error('Error: get webhook delivery logs failed:', error);
  }
}

getWebhookDeliveryLogsExample();
