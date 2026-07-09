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
 * Example: Get Activity Details
 *
 * This example demonstrates how to retrieve detailed information about a specific activity
 * using the Activities service.
 *
 * Usage:
 *   npm run example:ts examples/ts/activities/getActivity.ts <activityId>
 *
 * Example:
 *   npm run example:ts examples/ts/activities/getActivity.ts 550e8400-e29b-41d4-a716-446655440000
 */

// #docs operationId: PrimeRESTAPI_GetActivity
// #docs operationName: Get Activity

import {
  CoinbaseError,
  CoinbasePrimeClientException,
  CoinbasePrimeClientWithServices,
} from '../../../src';

const client = CoinbasePrimeClientWithServices.fromEnv();
const activityId = process.argv[2];

if (!activityId) {
  console.error(
    `
    Error: Activity ID is required
    Usage: npm run example:ts examples/ts/activities/getActivity.ts <activityId>
    Example: npm run example:ts examples/ts/activities/getActivity.ts 550e8400-e29b-41d4-a716-446655440000
    `
  );
  process.exit(1);
}

function handleGetActivityError(error: unknown): void {
  if (error instanceof CoinbasePrimeClientException) {
    console.error('❌ Invalid request:', error.message);
    return;
  }

  if (error instanceof CoinbaseError) {
    console.error(`❌ API error (${error.statusCode}):`, error.message);
    return;
  }

  throw error;
}

async function getActivityExample(): Promise<void> {
  try {
    console.log(`🔍 Fetching activity details - Activity ID: ${activityId}`);

    const activity = await client.activities.getActivity({
      activityId,
    });

    console.dir(activity, { depth: null });
  } catch (error: unknown) {
    handleGetActivityError(error);
  }
}

getActivityExample();
