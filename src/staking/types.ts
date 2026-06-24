/**
 * Copyright 2025-present Coinbase Global, Inc.
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
  BasePaginatedRequest,
  PaginatedListResponse,
} from '../shared/paginatedResponse';
import {
  StakingInitiateResponse,
  StakingInitiateRequest,
  StakingUnstakeResponse,
  PortfolioStakingInitiateRequest,
  PortfolioStakingInitiateResponse,
  PortfolioStakingUnstakeRequest,
  PortfolioStakingUnstakeResponse,
  ListTransactionValidatorsResponse as internalListTransactionValidatorsResponse,
  StakingClaimRewardsRequest as internalStakingClaimRewardsRequest,
  StakingClaimRewardsResponse as internalStakingClaimRewardsResponse,
  PreviewUnstakeResponse as internalPreviewUnstakeResponse,
  GetUnstakingStatusResponse as internalGetUnstakingStatusResponse,
  GetStakingStatusResponse as internalGetStakingStatusResponse,
  TransactionValidator,
} from '../model/';

export type CreateStakeRequest = StakingInitiateRequest & {
  portfolioId: string;
  walletId: string;
};

export type CreateStakeResponse = Expand<StakingInitiateResponse>;

// Staking Initiate Request is same for unstake, double check this when updating models if need to split
export type CreateUnstakeRequest = StakingInitiateRequest & {
  portfolioId: string;
  walletId: string;
};

export type CreateUnstakeResponse = Expand<StakingUnstakeResponse>;

export type CreatePortfolioStakeRequest = PortfolioStakingInitiateRequest & {
  portfolioId: string;
};

export type CreatePortfolioStakeResponse =
  Expand<PortfolioStakingInitiateResponse>;

export type CreatePortfolioUnstakeRequest = PortfolioStakingUnstakeRequest & {
  portfolioId: string;
};

export type CreatePortfolioUnstakeResponse =
  Expand<PortfolioStakingUnstakeResponse>;

export type QueryTransactionValidatorsRequest = BasePaginatedRequest & {
  portfolioId: string;
  transactionIds: string[];
};

export type QueryTransactionValidatorsResponse = PaginatedListResponse<
  internalListTransactionValidatorsResponse,
  QueryTransactionValidatorsRequest,
  TransactionValidator
>;

export type ClaimRewardsRequest = internalStakingClaimRewardsRequest & {
  portfolioId: string;
  walletId: string;
};

export type ClaimRewardsResponse = Expand<internalStakingClaimRewardsResponse>;

export type PreviewUnstakeRequest = {
  portfolioId: string;
  walletId: string;
  amount: string;
};

export type PreviewUnstakeResponse = Expand<internalPreviewUnstakeResponse>;

export type GetUnstakingStatusRequest = {
  portfolioId: string;
  walletId: string;
};

export type GetUnstakingStatusResponse =
  Expand<internalGetUnstakingStatusResponse>;

export type GetStakingStatusRequest = {
  portfolioId: string;
  walletId: string;
};

export type GetStakingStatusResponse = Expand<internalGetStakingStatusResponse>;
