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
 * Example: List Portfolio Activities
 *
 * This example demonstrates how to retrieve a list of activities for a portfolio
 * with optional filtering by categories and statuses.
 *
 * Usage:
 *   npm run example:ts examples/ts/activities/listPortfolioActivities.ts [symbols] [categories] [statuses]
 *
 * Examples:
 *   npm run example:ts examples/ts/activities/listPortfolioActivities.ts
 *   npm run example:ts examples/ts/activities/listPortfolioActivities.ts BTC,ETH ACTIVITY_CATEGORY_TRANSACTION ACTIVITY_STATUS_COMPLETED
 *
 * Environment Variables Required:
 *   - PORTFOLIO_ID: The ID of the portfolio to list activities for
 */

// #docs operationId: PrimeRESTAPI_GetPortfolioActivities
// #docs operationName: List Portfolio Activities

import {
  ActivityCategory,
  ActivityStatus,
  CoinbasePrimeClientWithServices,
  ListPortfolioActivitiesRequest,
} from '../../../src';

const client = CoinbasePrimeClientWithServices.fromEnv();
const symbolsArg = process.argv[2];
const categoriesArg = process.argv[3];
const statusesArg = process.argv[4];

async function listPortfolioActivitiesExample(): Promise<void> {
  const portfolioId = process.env.PORTFOLIO_ID;
  if (!portfolioId) {
    console.error('Error: PORTFOLIO_ID environment variable is required');
    return;
  }

  try {
    let requestMessage = `📋 Listing portfolio activities - Portfolio ID: ${portfolioId}`;
    if (symbolsArg) requestMessage += `, Symbols: ${symbolsArg}`;
    if (categoriesArg) requestMessage += `, Categories: ${categoriesArg}`;
    if (statusesArg) requestMessage += `, Statuses: ${statusesArg}`;

    console.log(requestMessage);

    const request: ListPortfolioActivitiesRequest = {
      portfolioId,
    };

    if (symbolsArg) request.symbols = symbolsArg.split(',');
    if (categoriesArg) {
      request.categories = categoriesArg.split(',') as ActivityCategory[];
    }
    if (statusesArg) {
      request.statuses = statusesArg.split(',') as ActivityStatus[];
    }

    const activitiesResponse =
      await client.activities.listPortfolioActivities(request);

    console.dir(activitiesResponse, { depth: null });
  } catch (error: unknown) {
    console.error('❌ Error listing portfolio activities:', error);
  }
}

listPortfolioActivitiesExample();
