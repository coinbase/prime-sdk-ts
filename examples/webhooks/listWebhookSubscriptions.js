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
 * Example: List Webhook Subscriptions
 *
 * This example demonstrates how to list the webhook subscriptions for a portfolio. Results are cursor-paginated;
 * the response exposes hasNext()/next()/fetchAll() helpers.
 *
 * Usage:
 *   node examples/webhooks/listWebhookSubscriptions.js [eventTypeFilter] [includeDisabled]
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the webhook subscriptions
 *
 * Arguments:
 *   - eventTypeFilter (optional): Only return subscriptions for this event type
 *   - includeDisabled (optional): 'true' to include disabled subscriptions
 */

// #docs operationId: PrimeBeta_ListWebhookSubscriptions
// #docs operationName: List Webhook Subscriptions

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const eventTypeFilter = process.argv[2];
const includeDisabled = process.argv[3] === 'true';

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

async function listWebhookSubscriptionsExample() {
  try {
    console.log(`
      Listing webhook subscriptions - Portfolio ID: ${portfolioId}`);

    const request = {
      portfolioId,
      eventTypeFilter,
      includeDisabled,
    };

    const response = await client.webhooks.listWebhookSubscriptions(request);

    console.dir(response, { depth: null });

    if (response.hasNext()) {
      console.log(
        'More pages available. Next cursor:',
        response.getNextCursor()
      );
    }
  } catch (error) {
    console.error('Error: list webhook subscriptions failed:', error);
  }
}

listWebhookSubscriptionsExample();
