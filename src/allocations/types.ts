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
import {
  CreateAllocationRequest as internalCreate,
  CreateAllocationResponse as internalResponse,
  CreateNetAllocationResponse as internalNetCreate,
  Allocation,
  GetPortfolioAllocationsResponse,
  GetAllocationResponse as internalGet,
  GetAllocationsByClientNettingIdResponse,
} from '../model/';
import { OrderSide } from '../model/enums/';
import { Pagination } from '../shared/pagination';
import {
  BasePaginatedRequest,
  PaginatedListResponse,
} from '../shared/paginatedResponse';

export type CreateAllocationRequest = Expand<internalCreate>;

export type CreateAllocationResponse = Expand<internalResponse>;

export type CreateNetAllocationRequest = Expand<internalCreate>;

export type CreateNetAllocationResponse = Expand<internalNetCreate>;

export type ListPortfolioAllocationsRequest = Pagination & {
  portfolioId: string;
  productIds?: string[];
  orderSide?: OrderSide;
  startDate?: string;
  endDate?: string;
};

export type ListPortfolioAllocationsResponse = PaginatedListResponse<
  GetPortfolioAllocationsResponse,
  ListPortfolioAllocationsRequest & BasePaginatedRequest,
  Allocation
>;

export type ListNetAllocationsRequest = {
  portfolioId: string;
  nettingId: string;
  allocationId?: string;
};

export type ListNetAllocationsResponse =
  Expand<GetAllocationsByClientNettingIdResponse>;

export type GetAllocationRequest = {
  portfolioId: string;
  allocationId: string;
};

export type GetAllocationResponse = Expand<internalGet>;
