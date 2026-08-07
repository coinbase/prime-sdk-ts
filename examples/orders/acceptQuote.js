/**
 * Copyright 2025-present Coinbase Global, Inc.
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
 * Example: Accept Quote
 *
 * This example demonstrates how to accept an RFQ quote and create an order.
 * Run createQuote.js first to obtain a quoteId, then pass it to this example.
 *
 * Usage:
 *   node examples/orders/acceptQuote.js <quoteId> [productId] [side]
 *
 * Examples:
 *   node examples/orders/acceptQuote.js abc123-quote-id BTC-USD BUY
 *   node examples/orders/acceptQuote.js abc123-quote-id ETH-USD SELL
 *
 * Available Sides: BUY, SELL
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio that owns the quote
 */

// #docs operationId: PrimeRESTAPI_AcceptQuote
// #docs operationName: Accept Quote

const { CoinbasePrimeClientWithServices, OrderSide } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const quoteId = process.argv[2];
const productId = process.argv[3] || 'BTC-USD';
const side = process.argv[4] || OrderSide.Buy;
const clientOrderId = crypto.randomUUID();

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  return;
}

if (!quoteId) {
  console.error(
    'Missing required argument: quoteId\n\nUsage: node examples/orders/acceptQuote.js <quoteId> [productId] [side]'
  );
  process.exit(1);
}

async function acceptQuoteExample() {
  try {
    const request = {
      portfolioId,
      productId,
      side,
      quoteId,
      clientOrderId,
    };

    console.log('✅ Accepting quote');
    console.dir(request);

    const response = await client.orders.acceptQuote(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('❌ Error accepting quote:', error);
  }
}

acceptQuoteExample();
