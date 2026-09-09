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
 * Example: Get Entity Rewards Rate (Beta)
 *
 * This example demonstrates how to retrieve the current rewards rate and
 * available rate tiers for an entity.
 *
 * Usage:
 *   node examples/financing/getEntityRewardsRate.js [entityId]
 *
 * Environment Variables Required:
 *   - ENTITY_ID: The Prime Entity ID
 */

// #docs operationId: PrimeBeta_GetEntityRewardsRate
// #docs operationName: Get Entity Rewards Rate

const { CoinbasePrimeClientWithServices } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const entityId = process.argv[2] || process.env.ENTITY_ID;

if (!entityId) {
  console.error(
    'Error: ENTITY_ID environment variable or command line argument is required'
  );
  process.exit(1);
}

async function getEntityRewardsRateExample() {
  try {
    console.log(`Getting entity rewards rate - Entity ID: ${entityId}`);

    const request = { entityId };

    const response = await client.financing.getEntityRewardsRate(request);

    console.dir(response, { depth: null });
  } catch (error) {
    console.error('Error:', error);
  }
}

getEntityRewardsRateExample();
