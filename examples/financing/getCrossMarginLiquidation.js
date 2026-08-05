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
 * Example: Get Cross Margin Liquidation
 *
 * Retrieves detailed liquidation data for a Cross Margin (XM) customer.
 * Omit liquidationId to get the active or most recent liquidation.
 *
 * Usage:
 *   node examples/financing/getCrossMarginLiquidation.js [entityId] [liquidationId]
 *
 * Examples:
 *   node examples/financing/getCrossMarginLiquidation.js
 *   node examples/financing/getCrossMarginLiquidation.js entity-123
 *   node examples/financing/getCrossMarginLiquidation.js entity-123 liquidation-uuid
 */

// #docs operationId: PrimeRESTAPI_GetXMLiquidation
// #docs operationName: Get Cross Margin Liquidation

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const entityId = process.argv[2] || process.env.ENTITY_ID;
const liquidationId = process.argv[3] || process.env.LIQUIDATION_ID;

if (!entityId) {
  console.error(
    'Error: ENTITY_ID environment variable or command line argument is required'
  );
  process.exit(1);
}

async function getCrossMarginLiquidationExample() {
  try {
    const request = {
      entityId,
      ...(liquidationId ? { liquidationId } : {}),
    };

    console.log(`📉 Getting Cross Margin liquidation - Entity ID: ${entityId}`);

    const response = await client.financing.getCrossMarginLiquidation(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error(error);
  }
}

getCrossMarginLiquidationExample();
