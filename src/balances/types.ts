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
import { PortfolioBalanceType, VisibilityStatus } from '../model/enums/';
import {
  GetPortfolioBalancesResponse,
  GetWalletBalanceResponse as internalGetResp,
  ListWeb3WalletBalancesResponse,
  ListEntityBalancesResponse as internalListEntityBalances,
  Web3Balance,
  EntityBalance,
} from '../model/';
import {
  BasePaginatedRequest,
  PaginatedListResponse,
} from '../shared/paginatedResponse';

export type ListPortfolioBalancesRequest = {
  portfolioId: string;
  symbols?: string[];
  balanceType?: PortfolioBalanceType;
};

export type ListPortfolioBalancesResponse =
  Expand<GetPortfolioBalancesResponse>;

export type GetWalletBalanceRequest = {
  portfolioId: string;
  walletId: string;
};

export type GetWalletBalanceResponse = Expand<internalGetResp>;

export type ListOnchainWalletBalancesRequest = {
  portfolioId: string;
  walletId: string;
  visibilityStatuses?: VisibilityStatus[];
  cursor?: string;
  limit?: number;
};

export type ListOnchainWalletBalancesResponse = PaginatedListResponse<
  ListWeb3WalletBalancesResponse,
  ListOnchainWalletBalancesRequest & BasePaginatedRequest,
  Web3Balance
>;

export type ListEntityBalancesRequest = {
  entityId: string;
  symbols?: string;
  cursor?: string;
  limit?: number;
  aggregationType?: PortfolioBalanceType;
};

export type ListEntityBalancesResponse = PaginatedListResponse<
  internalListEntityBalances,
  ListEntityBalancesRequest & BasePaginatedRequest,
  EntityBalance
>;
