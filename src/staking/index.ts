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
import { IPrimeApiClient, CoinbaseCallOptions, Method } from '../clients';
import {
  createPaginatedResponse,
  getDefaultPaginationOptions,
} from '../shared/paginatedResponse';
import { validate } from '../shared/validation';

import {
  CreateStakeRequest,
  CreateStakeResponse,
  CreateUnstakeRequest,
  CreateUnstakeResponse,
  CreatePortfolioStakeRequest,
  CreatePortfolioStakeResponse,
  CreatePortfolioUnstakeRequest,
  CreatePortfolioUnstakeResponse,
  QueryTransactionValidatorsRequest,
  QueryTransactionValidatorsResponse,
  ClaimRewardsRequest,
  ClaimRewardsResponse,
  PreviewUnstakeRequest,
  PreviewUnstakeResponse,
  GetUnstakingStatusRequest,
  GetUnstakingStatusResponse,
  GetStakingStatusRequest,
  GetStakingStatusResponse,
} from './types';

export interface IStakingService {
  /**
   * Request to stake or delegate a wallet
   *
   * Creates an execution request to stake or delegate funds to a validator
   */
  createStake(
    request: CreateStakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateStakeResponse>;
  /**
   * Request to unstake a wallet
   *
   * Creates an execution request to unstake delegated or staked funds in a wallet
   */
  createUnstake(
    request: CreateUnstakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateUnstakeResponse>;
  /**
   * Request to stake currency in a portfolio
   *
   * Creates an execution request to stake funds across a portfolio.  This will stake funds in one or more wallets in the portfolio, with a total bondable balance up to the requested stake amount. This feature is gated. Please contact your account manager or primeops\@coinbase.com to enable.
   */
  createPortfolioStake(
    request: CreatePortfolioStakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreatePortfolioStakeResponse>;
  /**
   * Request to unstake currency across a portfolio
   *
   * Creates an execution request to unstake funds across a portfolio.  This will unstake funds in one or more wallets in the portfolio, with a total bonded balance up to the requested unstake amount. This feature is gated. Please contact your account manager or primeops\@coinbase.com to enable.
   */
  createPortfolioUnstake(
    request: CreatePortfolioUnstakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreatePortfolioUnstakeResponse>;
  /**
   * List Transaction Validators
   *
   * List ETH 0x02 validators associated with wallet-level stake transactions for a given portfolio. It will not return data for unstake transactions, portfolio stake transactions, transactions which staked different currencies, or which staked to Ethereum 0x01 validators.
   */
  queryTransactionValidators(
    request: QueryTransactionValidatorsRequest,
    options?: CoinbaseCallOptions
  ): Promise<QueryTransactionValidatorsResponse>;
  /**
   * Claim Wallet Staking Rewards (Alpha)
   *
   * Request to claim staking rewards. This feature is only for ETH Pectra (0x02) validators.
   */
  claimRewards(
    request: ClaimRewardsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ClaimRewardsResponse>;

  /**
   * Preview Unstake
   *
   * Previews an unstaking request with the given amount and returns the estimated amount that would be unstaked. This feature currently only supports ETH.
   */
  previewUnstake(
    request: PreviewUnstakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<PreviewUnstakeResponse>;

  /**
   * Get Unstaking Status
   *
   * Get unstaking estimates for a wallet. Returns estimated completion times for active unstaking requests.
   */
  getUnstakingStatus(
    request: GetUnstakingStatusRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetUnstakingStatusResponse>;

  /**
   * Get Staking Status
   *
   * Get staking status for a wallet. Returns estimated completion times for active staking requests.
   */
  getStakingStatus(
    request: GetStakingStatusRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetStakingStatusResponse>;
}

export class StakingService implements IStakingService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async createStake(
    request: CreateStakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateStakeResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.walletId)
      .requiredUUID((r) => r.idempotencyKey)
      .check();

    const bodyParams = {
      ...request,
      portfolioId: undefined,
      walletId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/wallets/${request.walletId}/staking/initiate`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    return response.data as CreateStakeResponse;
  }

  async createUnstake(
    request: CreateUnstakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateUnstakeResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.walletId)
      .requiredUUID((r) => r.idempotencyKey)
      .check();

    const bodyParams = {
      ...request,
      portfolioId: undefined,
      walletId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/wallets/${request.walletId}/staking/unstake`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    return response.data as CreateUnstakeResponse;
  }

  async createPortfolioStake(
    request: CreatePortfolioStakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreatePortfolioStakeResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.idempotencyKey)
      .requiredString((r) => r.currencySymbol)
      .requiredString((r) => r.amount)
      .check();

    const bodyParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/staking/initiate`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    return response.data as CreatePortfolioStakeResponse;
  }

  async createPortfolioUnstake(
    request: CreatePortfolioUnstakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreatePortfolioUnstakeResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.idempotencyKey)
      .requiredString((r) => r.currencySymbol)
      .requiredString((r) => r.amount)
      .check();

    const bodyParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/staking/unstake`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    return response.data as CreatePortfolioUnstakeResponse;
  }

  async queryTransactionValidators(
    request: QueryTransactionValidatorsRequest,
    options?: CoinbaseCallOptions
  ): Promise<QueryTransactionValidatorsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredArray((r) => r.transactionIds)
      .check();

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    const { transactionIds, cursor, limit, sortDirection } = request;
    const bodyParams = {
      transactionIds,
      cursor,
      limit,
      sortDirection,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/staking/transaction-validators/query`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    const responseData = response.data;

    return createPaginatedResponse(
      responseData,
      this.queryTransactionValidators.bind(this),
      request,
      (r) => r.transactionValidators || [],
      paginationOptions
    ) as QueryTransactionValidatorsResponse;
  }

  async claimRewards(
    request: ClaimRewardsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ClaimRewardsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.walletId)
      .requiredUUID((r) => r.idempotencyKey)
      .check();

    const { idempotencyKey, inputs, portfolioId, walletId } = request;
    const bodyParams = {
      idempotencyKey,
      inputs,
    };
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/wallets/${walletId}/staking/claim_rewards`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    return response.data as ClaimRewardsResponse;
  }

  async previewUnstake(
    request: PreviewUnstakeRequest,
    options?: CoinbaseCallOptions
  ): Promise<PreviewUnstakeResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.walletId)
      .requiredString((r) => r.amount)
      .check();

    const bodyParams = {
      ...request,
      portfolioId: undefined,
      walletId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/wallets/${request.walletId}/staking/unstake/preview`,
      method: Method.POST,
      bodyParams,
      callOptions: options,
    });

    return response.data as PreviewUnstakeResponse;
  }

  async getUnstakingStatus(
    request: GetUnstakingStatusRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetUnstakingStatusResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.walletId)
      .check();

    const { portfolioId, walletId } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/wallets/${walletId}/staking/unstake/status`,
      callOptions: options,
    });

    return response.data as GetUnstakingStatusResponse;
  }

  async getStakingStatus(
    request: GetStakingStatusRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetStakingStatusResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.walletId)
      .check();

    const { portfolioId, walletId } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/wallets/${walletId}/staking/status`,
      callOptions: options,
    });

    return response.data as GetStakingStatusResponse;
  }
}
