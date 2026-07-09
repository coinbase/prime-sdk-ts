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
 * Example: Create Order
 *
 * This example demonstrates how to create a market order using the Orders service.
 *
 * Usage:
 *   npm run example:ts examples/ts/orders/createOrder.ts [side] [productId] [baseQuantity] [type] [limitPrice]
 *
 * Examples:
 *   npm run example:ts examples/ts/orders/createOrder.ts
 *   npm run example:ts examples/ts/orders/createOrder.ts BUY BTC-USD 0.001
 *   npm run example:ts examples/ts/orders/createOrder.ts SELL ETH-USD 0.1
 *
 * Side values: BUY, SELL (or OrderSide member names: Buy, Sell)
 * Type values: MARKET, LIMIT, ... (or OrderType member names: Market, Limit, ...)
 */

// #docs operationId: PrimeRESTAPI_CreateOrder
// #docs operationName: Create Order

import {
  CoinbasePrimeClientWithServices,
  CreateOrderRequest,
  OrderSide,
  OrderType,
} from '../../../src';

function parseEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string | undefined,
  fallback: T[keyof T]
): T[keyof T] {
  if (!value) {
    return fallback;
  }

  const byKey = enumObject[value as keyof T];
  if (byKey !== undefined) {
    return byKey;
  }

  const byValue = Object.values(enumObject).find(
    (member) => member === value
  ) as T[keyof T] | undefined;
  if (byValue !== undefined) {
    return byValue;
  }

  const allowed = Object.values(enumObject).join(', ');
  throw new Error(`Invalid value "${value}". Expected one of: ${allowed}`);
}

const client = CoinbasePrimeClientWithServices.fromEnv();
const productId = process.argv[3] || 'ADA-USD';
const baseQuantity = process.argv[4] || '10';
const limitPrice = process.argv[6];

async function createOrderExample(): Promise<void> {
  const portfolioId = process.env.PORTFOLIO_ID;
  if (!portfolioId) {
    console.error('Error: PORTFOLIO_ID environment variable is required');
    return;
  }

  try {
    const side = parseEnumValue(OrderSide, process.argv[2], OrderSide.Buy);
    const type = parseEnumValue(OrderType, process.argv[5], OrderType.Market);

    const order: CreateOrderRequest = {
      portfolioId,
      side,
      productId,
      type,
      baseQuantity,
      clientOrderId: crypto.randomUUID(),
      ...(limitPrice ? { limitPrice } : {}),
    };

    console.log('📝 Creating order');
    console.dir(order);

    const response = await client.orders.createOrder(order);

    console.dir(response, { depth: null });
  } catch (error: unknown) {
    console.error(error);
  }
}

createOrderExample();
