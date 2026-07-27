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
 * Example: List Cross Margin Liquidations
 *
 * Lists historical Cross Margin (XM) liquidation records for an entity.
 *
 * Usage:
 *   node examples/financing/listCrossMarginLiquidations.js [entityId] [limit]
 *
 * Examples:
 *   node examples/financing/listCrossMarginLiquidations.js
 *   node examples/financing/listCrossMarginLiquidations.js entity-123 25
 */

// #docs operationId: PrimeRESTAPI_ListXMLiquidations
// #docs operationName: List Cross Margin Liquidations

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const entityId = process.argv[2] || process.env.ENTITY_ID;
const limit = process.argv[3] ? Number.parseInt(process.argv[3], 10) : 10;

if (!entityId) {
  console.error(
    'Error: ENTITY_ID environment variable or command line argument is required'
  );
  process.exit(1);
}

async function listCrossMarginLiquidationsExample() {
  try {
    if (Number.isNaN(limit)) {
      console.error('Error: limit must be a number');
      process.exit(1);
    }

    const request = {
      entityId,
      limit,
    };

    console.log(
      `📋 Listing Cross Margin liquidations - Entity ID: ${entityId}, limit: ${limit}`
    );

    const response = await client.financing.listCrossMarginLiquidations(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error(error);
  }
}

listCrossMarginLiquidationsExample();
