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
import { CoinbaseCallOptions, Method, IPrimeApiClient } from '../clients';
import { validate } from '../shared/validation';

import {
  ListEntityFuturesSweepsRequest,
  ListEntityFuturesSweepsResponse,
  GetEntityFuturesBalanceRequest,
  GetEntityFuturesBalanceResponse,
  GetEntityFuturesPositionsRequest,
  GetEntityFuturesPositionsResponse,
  ScheduleEntityFuturesSweepRequest,
  ScheduleEntityFuturesSweepResponse,
  UpdateEntityFuturesAutoSweepRequest,
  UpdateEntityFuturesAutoSweepResponse,
  CancelEntitySweepRequest,
  CancelEntitySweepResponse,
  GetEntityFuturesRiskLimitsRequest,
  GetEntityFuturesRiskLimitsResponse,
  GetEntityFuturesMarginCallDetailsRequest,
  GetEntityFuturesMarginCallDetailsResponse,
  GetFcmSettingsRequest,
  GetFcmSettingsResponse,
  SetFcmSettingsRequest,
  SetFcmSettingsResponse,
  GetEntityFcmEquityRequest,
  GetEntityFcmEquityResponse,
  GetDerivativesCurrencySummaryRequest,
  GetDerivativesCurrencySummaryResponse,
  ListDerivativePositionsRequest,
  ListDerivativePositionsResponse,
} from './types';

export interface IFuturesService {
  /**
   * List Entity Futures Sweeps
   *
   * Retrieve fcm sweeps in open status, including pending and processing sweeps.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListEntitySweepsError}.
   */
  listEntitySweeps(
    request: ListEntityFuturesSweepsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListEntityFuturesSweepsResponse>;

  /**
   * Get Entity FCM Balance
   *
   * Retrieve fcm balance for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetEntityBalanceError}.
   */
  getEntityBalance(
    request: GetEntityFuturesBalanceRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesBalanceResponse>;

  /**
   * Get Entity Positions
   *
   * Retrieve all active fcm positions for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetEntityPositionsError}.
   */
  getEntityPositions(
    request: GetEntityFuturesPositionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesPositionsResponse>;

  /**
   * Schedule Entity Futures Sweep
   *
   * Schedule a sweep for a given entity from FCM wallet to USD Spot wallet. Only one pending sweep is allowed at a time per entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ScheduleEntitySweepError}.
   */
  scheduleEntitySweep(
    request: ScheduleEntityFuturesSweepRequest,
    options?: CoinbaseCallOptions
  ): Promise<ScheduleEntityFuturesSweepResponse>;

  /**
   * Set Auto Sweep
   *
   * Set auto sweep for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link UpdateEntityAutoSweepError}.
   */
  updateEntityAutoSweep(
    request: UpdateEntityFuturesAutoSweepRequest,
    options?: CoinbaseCallOptions
  ): Promise<UpdateEntityFuturesAutoSweepResponse>;

  /**
   * Cancel Entity Futures Sweep
   *
   * Cancel the pending sweep for a given entity. A user will only be able to have one pending sweep at a time. If the sweep is not found, a 404 will be returned.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link CancelEntitySweepError}.
   */
  cancelEntitySweep(
    request: CancelEntitySweepRequest,
    options?: CoinbaseCallOptions
  ): Promise<CancelEntitySweepResponse>;

  /**
   * Get FCM Risk Limits
   *
   * Retrieve the risk limits for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetRiskLimitsError}.
   */
  getRiskLimits(
    request: GetEntityFuturesRiskLimitsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesRiskLimitsResponse>;

  /**
   * Get FCM Margin Call Details
   *
   * Retrieve the margin call details for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetMarginCallDetailsError}.
   */
  getMarginCallDetails(
    request: GetEntityFuturesMarginCallDetailsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesMarginCallDetailsResponse>;

  /**
   * Get FCM Settings
   *
   * Get settings related to FCM.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetFcmSettingsError}.
   */
  getFcmSettings(
    request: GetFcmSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetFcmSettingsResponse>;

  /**
   * Set FCM Settings
   *
   * Update settings related to FCM.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link SetFcmSettingsError}.
   */
  setFcmSettings(
    request: SetFcmSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<SetFcmSettingsResponse>;

  /**
   * Get FCM Equity
   *
   * Retrieve the equity data for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetEntityEquityError}.
   */
  getEntityEquity(
    request: GetEntityFcmEquityRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFcmEquityResponse>;

  /**
   * Get Portfolio Derivatives Currency Summary
   *
   * Retrieve per-currency international derivatives balances for a given portfolio. US Futures balances roll up to a single clearing account per entity rather than per portfolio, and are available from the entity futures balance summary and risk limits endpoints instead.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetDerivativesCurrencySummaryError}.
   */
  getDerivativesCurrencySummary(
    request: GetDerivativesCurrencySummaryRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetDerivativesCurrencySummaryResponse>;

  /**
   * List Portfolio Derivative Positions
   *
   * Retrieve all active derivative positions for a given portfolio.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListDerivativePositionsError}.
   */
  listDerivativePositions(
    request: ListDerivativePositionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListDerivativePositionsResponse>;
}

export class FuturesService implements IFuturesService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async listEntitySweeps(
    request: ListEntityFuturesSweepsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListEntityFuturesSweepsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/sweeps`,
      callOptions: options,
    });

    return response.data as ListEntityFuturesSweepsResponse;
  }

  async getEntityBalance(
    request: GetEntityFuturesBalanceRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesBalanceResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/balance_summary`,
      callOptions: options,
    });

    return response.data as GetEntityFuturesBalanceResponse;
  }

  async getEntityPositions(
    request: GetEntityFuturesPositionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesPositionsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const queryParams = { ...request, entityId: undefined };
    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/positions`,
      queryParams,
      callOptions: options,
    });

    return response.data as GetEntityFuturesPositionsResponse;
  }

  async scheduleEntitySweep(
    request: ScheduleEntityFuturesSweepRequest,
    options?: CoinbaseCallOptions
  ): Promise<ScheduleEntityFuturesSweepResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .requiredString((r) => r.currency)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/sweeps`,
      method: Method.POST,
      bodyParams: { ...request, entityId: undefined },
      callOptions: options,
    });

    return response.data as ScheduleEntityFuturesSweepResponse;
  }

  async updateEntityAutoSweep(
    request: UpdateEntityFuturesAutoSweepRequest,
    options?: CoinbaseCallOptions
  ): Promise<UpdateEntityFuturesAutoSweepResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .requiredBoolean((r) => r.autoSweep)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/auto_sweep`,
      method: Method.POST,
      bodyParams: { ...request, entityId: undefined },
      callOptions: options,
    });

    return response.data as UpdateEntityFuturesAutoSweepResponse;
  }

  async cancelEntitySweep(
    request: CancelEntitySweepRequest,
    options?: CoinbaseCallOptions
  ): Promise<CancelEntitySweepResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/sweeps`,
      method: Method.DELETE,
      callOptions: options,
    });

    return response.data as CancelEntitySweepResponse;
  }

  async getRiskLimits(
    request: GetEntityFuturesRiskLimitsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesRiskLimitsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/risk_limits`,
      callOptions: options,
    });

    return response.data as GetEntityFuturesRiskLimitsResponse;
  }

  async getMarginCallDetails(
    request: GetEntityFuturesMarginCallDetailsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFuturesMarginCallDetailsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/margin_call_details`,
      callOptions: options,
    });

    return response.data as GetEntityFuturesMarginCallDetailsResponse;
  }

  async getFcmSettings(
    request: GetFcmSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetFcmSettingsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/settings`,
      callOptions: options,
    });

    return response.data as GetFcmSettingsResponse;
  }

  async setFcmSettings(
    request: SetFcmSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<SetFcmSettingsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/settings`,
      method: Method.POST,
      bodyParams: { targetDerivativesExcess: request.targetDerivativesExcess },
      callOptions: options,
    });

    return response.data as SetFcmSettingsResponse;
  }

  async getEntityEquity(
    request: GetEntityFcmEquityRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityFcmEquityResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/equity`,
      callOptions: options,
    });

    return response.data as GetEntityFcmEquityResponse;
  }

  async getDerivativesCurrencySummary(
    request: GetDerivativesCurrencySummaryRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetDerivativesCurrencySummaryResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/derivatives/currency_summary`,
      callOptions: options,
    });

    return response.data as GetDerivativesCurrencySummaryResponse;
  }

  async listDerivativePositions(
    request: ListDerivativePositionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListDerivativePositionsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const queryParams: Record<string, string> = {};
    if (request.productId) {
      queryParams.product_id = request.productId;
    }

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/derivatives/positions`,
      queryParams,
      callOptions: options,
    });

    return response.data as ListDerivativePositionsResponse;
  }
}

export type {
  ListEntityFuturesSweepsRequest,
  ListEntityFuturesSweepsResponse,
  GetEntityFuturesBalanceRequest,
  GetEntityFuturesBalanceResponse,
  GetEntityFuturesPositionsRequest,
  GetEntityFuturesPositionsResponse,
  ScheduleEntityFuturesSweepRequest,
  ScheduleEntityFuturesSweepResponse,
  UpdateEntityFuturesAutoSweepRequest,
  UpdateEntityFuturesAutoSweepResponse,
  CancelEntitySweepRequest,
  CancelEntitySweepResponse,
  GetEntityFuturesRiskLimitsRequest,
  GetEntityFuturesRiskLimitsResponse,
  GetEntityFuturesMarginCallDetailsRequest,
  GetEntityFuturesMarginCallDetailsResponse,
  GetFcmSettingsRequest,
  GetFcmSettingsResponse,
  SetFcmSettingsRequest,
  SetFcmSettingsResponse,
  GetEntityFcmEquityRequest,
  GetEntityFcmEquityResponse,
  GetDerivativesCurrencySummaryRequest,
  GetDerivativesCurrencySummaryResponse,
  ListDerivativePositionsRequest,
  ListDerivativePositionsResponse,
} from './types';
