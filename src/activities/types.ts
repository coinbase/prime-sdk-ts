/**
 * Copyright 2024-present Coinbase Global, Inc.
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
import { Expand } from '../shared/brand';
import { ActivityCategory, ActivityStatus } from '../model/enums/';
import {
  GetActivityResponse as internalGet,
  GetEntityActivitiesResponse,
  GetPortfolioActivitiesResponse,
  GetPortfolioActivityResponse as internalGetPortAct,
  Activity,
} from '../model/';
import { Pagination } from '../shared/pagination';
import {
  BasePaginatedRequest,
  PaginatedListResponse,
} from '../shared/paginatedResponse';

export type ActivityFilters = Pagination & {
  symbols?: string[];
  categories?: ActivityCategory[];
  statuses?: ActivityStatus[];
  startTime?: string;
  endTime?: string;
  getNetworkUnifiedActivities?: boolean;
};

export type GetActivityRequest = {
  activityId: string;
};

export type GetActivityResponse = Expand<internalGet>;

export type ListEntityActivitiesRequest = Pagination &
  ActivityFilters & {
    entityId: string;
    activityLevel?: string;
  };

export type BaseListEntityActivitiesResponse = GetEntityActivitiesResponse;

/**
 * Response from listEntityActivities.
 *
 * - `activities` — Activities for the entity
 * - `pagination` — Cursor pagination metadata (`nextCursor`, `hasNext`, `sortDirection`)
 */
export type ListEntityActivitiesResponse = PaginatedListResponse<
  BaseListEntityActivitiesResponse,
  ListEntityActivitiesRequest & BasePaginatedRequest,
  Activity
>;

export type ListPortfolioActivitiesRequest = Pagination &
  ActivityFilters & {
    portfolioId: string;
  };

/**
 * Response from listPortfolioActivities.
 *
 * - `activities` — Activities for the portfolio
 * - `pagination` — Cursor pagination metadata (`nextCursor`, `hasNext`, `sortDirection`)
 */
export type ListPortfolioActivitiesResponse = PaginatedListResponse<
  GetPortfolioActivitiesResponse,
  ListPortfolioActivitiesRequest & BasePaginatedRequest,
  Activity
>;

export type GetPortfolioActivitiesRequest = {
  portfolioId: string;
  activityId: string;
};

export type GetPortfolioActivityResponse = Expand<internalGetPortAct>;

/* GENERATED-METHOD-ERRORS-START */
export type {
  GetActivityError,
  GetPortfolioActivityError,
  ListEntityActivitiesError,
  ListPortfolioActivitiesError,
} from '../model/errors/methodErrors';
/* GENERATED-METHOD-ERRORS-END */
