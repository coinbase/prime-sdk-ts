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
 * Handle a typed Prime API error
 *
 * Demonstrates catching CoinbasePrimeException and inspecting code/subcode/traceId.
 *
 * Usage:
 *   PORTFOLIO_ID=<uuid> node examples/advanced/handleApiError.js
 */
require('dotenv').config();
const {
  CoinbasePrimeClientWithServices,
  CoinbasePrimeClientException,
  isPrimeApiError,
} = require('../../dist');

const portfolioId = process.env.PORTFOLIO_ID;

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

async function main() {
  const client = CoinbasePrimeClientWithServices.fromEnv();

  try {
    await client.orders.createOrder({
      portfolioId,
      productId: 'BTC-USD',
      side: 'BUY',
      clientOrderId: '00000000-0000-0000-0000-000000000000',
      type: 'LIMIT',
      baseQuantity: '-1',
    });
    console.log('Order created unexpectedly');
  } catch (error) {
    if (error instanceof CoinbasePrimeClientException) {
      console.error('Validation error:', error.message);
      process.exit(1);
    }

    if (isPrimeApiError(error)) {
      console.log('API error status:', error.statusCode);
      console.log('code:', error.code);
      console.log('subcode:', error.subcode);
      console.log('traceId:', error.traceId);
      console.log('message:', error.body.message);
      return;
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
