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
 * Example: Create Quote Request
 *
 * This example demonstrates how to request an RFQ quote using the Orders service.
 * A quote request is the first step in the RFQ process. Use the returned quoteId
 * with acceptQuote.js to accept the quote and create an order.
 *
 * Usage:
 *   node examples/orders/createQuote.js [productId] [side] [baseQuantity] [limitPrice]
 *
 * Examples:
 *   node examples/orders/createQuote.js BTC-USD BUY 0.001 120000
 *   node examples/orders/createQuote.js ETH-USD SELL 1.0 3500
 *
 * Available Sides: BUY, SELL
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio to request the quote for
 */

// #docs operationId: PrimeRESTAPI_CreateQuoteRequest
// #docs operationName: Create Quote Request

const {
  CoinbasePrimeClientWithServices,
  OrderSide,
  OrderType,
} = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;
const productId = process.argv[2] || 'BTC-USD';
const side = process.argv[3] || OrderSide.Buy;
const baseQuantity = process.argv[4] || '0.001';
const limitPrice = process.argv[5] || '130000';
const clientOrderId = crypto.randomUUID();

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  return;
}

async function createQuoteExample() {
  try {
    const request = {
      portfolioId,
      productId,
      side,
      type: OrderType.Limit,
      baseQuantity,
      limitPrice,
      clientOrderId,
    };

    console.log('📋 Creating quote request');
    console.dir(request);

    const response = await client.orders.createQuote(request);

    console.dir(response, { depth: null });

    if (response.quoteId) {
      console.log(
        `\nTo accept this quote, run:\n  node examples/orders/acceptQuote.js ${response.quoteId} ${productId} ${side}`
      );
    }
  } catch (error) {
    console.error('❌ Error creating quote request:', error);
  }
}

createQuoteExample();
