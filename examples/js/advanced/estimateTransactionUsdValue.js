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
 * Advanced Example: Estimate Transaction USD Value via Order Preview
 *
 * Fetches a transaction, then uses a SELL MARKET order preview to estimate
 * how much the transaction amount would be worth in USD at current market prices.
 *
 * Usage:
 *   node examples/js/advanced/estimateTransactionUsdValue.js <transactionId>
 *
 * Example:
 *   node examples/js/advanced/estimateTransactionUsdValue.js 550e8400-e29b-41d4-a716-446655440000
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The portfolio that owns the transaction
 *   - PRIME_CREDENTIALS: API credentials JSON
 */

const {
  OrdersService,
  TransactionsService,
  OrderSide,
  OrderType,
} = require('../../../dist/services');
const { CoinbasePrimeClient } = require('../../../dist/client-only');

require('dotenv').config();

const USD_STABLECOINS = new Set(['USD', 'USDC', 'USDT', 'DAI', 'PYUSD']);

const portfolioId = process.env.PORTFOLIO_ID;
const transactionId = process.argv[2];

if (!transactionId) {
  console.error(`
    Error: Transaction ID is required
    Usage: node examples/js/advanced/estimateTransactionUsdValue.js <transactionId>
    Example: node examples/js/advanced/estimateTransactionUsdValue.js 550e8400-e29b-41d4-a716-446655440000
  `);
  process.exit(1);
}

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

function getAbsoluteAmount(amount) {
  if (!amount) {
    return null;
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount === 0) {
    return null;
  }

  return Math.abs(numericAmount).toString();
}

async function estimateTransactionUsdValue() {
  try {
    const client = CoinbasePrimeClient.fromEnv();
    const transactions = new TransactionsService(client);
    const orders = new OrdersService(client);

    console.log(
      `Fetching transaction ${transactionId} in portfolio ${portfolioId}...`
    );

    const { transaction } = await transactions.getTransaction({
      portfolioId,
      transactionId,
    });

    if (!transaction) {
      console.error('Transaction not found');
      return;
    }

    const { symbol, amount, type, status } = transaction;
    const absoluteAmount = getAbsoluteAmount(amount);

    console.log('\nTransaction details:');
    console.log(`  ID: ${transaction.id ?? transactionId}`);
    console.log(`  Type: ${type ?? 'unknown'}`);
    console.log(`  Status: ${status ?? 'unknown'}`);
    console.log(`  Symbol: ${symbol ?? 'unknown'}`);
    console.log(`  Amount: ${amount ?? 'unknown'}`);

    if (!symbol || !absoluteAmount) {
      console.error(
        '\nCannot estimate USD value: transaction is missing symbol or amount'
      );
      return;
    }

    if (USD_STABLECOINS.has(symbol.toUpperCase())) {
      console.log('\nEstimated USD value:');
      console.log(`  ${absoluteAmount} USD (${symbol} treated as ~1:1 with USD)`);
      return;
    }

    const productId = `${symbol.toUpperCase()}-USD`;

    console.log(
      `\nRequesting SELL MARKET order preview for ${absoluteAmount} ${symbol} (${productId})...`
    );

    const preview = await orders.createOrderPreview({
      portfolioId,
      productId,
      side: OrderSide.Sell,
      type: OrderType.Market,
      baseQuantity: absoluteAmount,
    });

    const estimatedUsdValue = preview.orderTotal;
    const estimatedPrice = preview.averageFilledPrice;

    console.log('\nOrder preview:');
    console.log(`  Product: ${preview.productId ?? productId}`);
    console.log(`  Best bid: ${preview.bestBid ?? 'n/a'}`);
    console.log(`  Best ask: ${preview.bestAsk ?? 'n/a'}`);
    console.log(`  Average filled price: ${estimatedPrice ?? 'n/a'}`);
    console.log(`  Order total (quote): ${estimatedUsdValue ?? 'n/a'}`);
    if (preview.commission) {
      console.log(`  Estimated commission: ${preview.commission}`);
    }
    if (preview.slippage) {
      console.log(`  Estimated slippage: ${preview.slippage}`);
    }

    console.log('\nEstimated USD value:');
    if (estimatedUsdValue) {
      console.log(`  ${estimatedUsdValue} USD`);
    } else if (estimatedPrice) {
      const fallbackValue = Number(estimatedPrice) * Number(absoluteAmount);
      console.log(
        `  ${fallbackValue} USD (derived from average filled price x amount)`
      );
    } else {
      console.log('  Unable to derive an estimate from the order preview response');
    }
  } catch (error) {
    console.error('Error estimating transaction USD value:', error.message);
  }
}

estimateTransactionUsdValue();
