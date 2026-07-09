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
 * Example: List Assets
 *
 * This example demonstrates how to retrieve a list of assets for an entity
 * using the Assets service.
 *
 * Usage:
 *   npm run example:ts examples/ts/assets/listAssets.ts
 *
 * Environment Variables Required:
 *   - ENTITY_ID: The ID of the entity to list assets for
 */

// #docs operationId: PrimeRESTAPI_GetEntityAssets
// #docs operationName: List Assets

import {
  CoinbasePrimeClientWithServices,
  ListAssetsRequest,
} from '../../../src';

const client = CoinbasePrimeClientWithServices.fromEnv();

async function listAssetsExample(): Promise<void> {
  const entityId = process.env.ENTITY_ID;
  if (!entityId) {
    console.error('Error: ENTITY_ID environment variable is required');
    return;
  }
  try {
    console.log(`📋 Listing assets - Entity ID: ${entityId}`);

    const request: ListAssetsRequest = {
      entityId,
    };

    const assetsResponse = await client.assets.listAssets(request);

    console.dir(assetsResponse, { depth: null });
  } catch (error: unknown) {
    console.error(error);
  }
}

listAssetsExample();
