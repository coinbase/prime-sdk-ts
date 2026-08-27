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
 * Example: List Products
 *
 * This example demonstrates how to retrieve all available trading products for a specific
 * portfolio using the Products service. Products include trading pairs (like BTC-USD, ETH-USD)
 * with their trading rules, size limits, and permissions.
 *
 * Usage:
 *   node examples/products/listProducts.js
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio to list products for
 *
 * Optional Environment Variables:
 *   - PRODUCT_TYPE: Filter by product type (SPOT, FUTURE, OPTION)
 *   - CONTRACT_EXPIRY_TYPE: Filter futures by expiry type
 *     (CONTRACT_EXPIRY_TYPE_EXPIRING or CONTRACT_EXPIRY_TYPE_PERPETUAL)
 *   - EXPIRING_CONTRACT_STATUS: Filter expiring futures by expiry status
 *     (EXPIRING_CONTRACT_STATUS_UNEXPIRED, EXPIRING_CONTRACT_STATUS_EXPIRED,
 *     or EXPIRING_CONTRACT_STATUS_ALL)
 */

// #docs operationId: PrimeRESTAPI_GetPortfolioProducts
// #docs operationName: List Products

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  return;
}

async function listProductsExample() {
  try {
    console.log(`📦 Listing products - Portfolio ID: ${portfolioId}`);

    const request = {
      portfolioId,
    };

    if (process.env.PRODUCT_TYPE) {
      request.productType = process.env.PRODUCT_TYPE;
    }
    if (process.env.CONTRACT_EXPIRY_TYPE) {
      request.contractExpiryType = process.env.CONTRACT_EXPIRY_TYPE;
    }
    if (process.env.EXPIRING_CONTRACT_STATUS) {
      request.expiringContractStatus = process.env.EXPIRING_CONTRACT_STATUS;
    }

    const productsResponse = await client.products.listProducts(request);

    console.dir(productsResponse, { depth: null });
  } catch (error) {
    console.error('❌ Error listing products:', error);
  }
}

listProductsExample();
