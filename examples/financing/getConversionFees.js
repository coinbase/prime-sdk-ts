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
 * Example: Get Conversion Fees
 *
 * This example demonstrates how to retrieve your organization's stablecoin
 * conversion fee tiers and month-to-date net conversion volume per currency.
 * The organization is resolved from the authenticated API key.
 *
 * Usage:
 *   node examples/financing/getConversionFees.js
 */

// #docs operationId: PrimeRESTAPI_GetConversionFees
// #docs operationName: Get Conversion Fees

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();

async function getConversionFeesExample() {
  try {
    console.log('💱 Getting conversion fees...');

    const response = await client.financing.getConversionFees();
    console.dir(response, { depth: null });
  } catch (error) {
    console.error('❌ Error getting conversion fees:', error);
  }
}

getConversionFeesExample();
