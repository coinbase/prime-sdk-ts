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
 * Example: Get Webhook Event Types
 *
 * This example demonstrates how to list the registered webhook event types available to subscribe to.
 *
 * Usage:
 *   node examples/webhooks/getWebhookEventTypes.js
 *
 * Arguments:
 *   (none)
 */

// #docs operationId: PrimeBeta_GetWebhookEventTypes
// #docs operationName: Get Webhook Event Types

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();

async function getWebhookEventTypesExample() {
  try {
    console.log(`
      Getting webhook event types`);

    const response = await client.webhooks.getWebhookEventTypes();

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error: get webhook event types failed:', error);
  }
}

getWebhookEventTypesExample();
