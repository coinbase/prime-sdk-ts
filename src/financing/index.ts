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
import { validate } from '../shared/validation';
import {
  createPaginatedResponse,
  getDefaultPaginationOptions,
  getQueryParams,
  ResponseExtractors,
} from '../shared/paginatedResponse';

import {
  ListExistingLocatesRequest,
  ListExistingLocatesResponse,
  ListInterestAccrualsRequest,
  ListInterestAccrualsResponse,
  ListPortfolioInterestAccrualsRequest,
  ListPortfolioInterestAccrualsResponse,
  ListMarginCallSummariesRequest,
  ListMarginCallSummariesResponse,
  ListMarginConversionsRequest,
  ListMarginConversionsResponse,
  GetEntityLocateAvailabilitiesRequest,
  GetEntityLocateAvailabilitiesResponse,
  GetMarginInformationRequest,
  GetMarginInformationResponse,
  GetPortfolioBuyingPowerRequest,
  GetPortfolioBuyingPowerResponse,
  GetPortfolioCreditInformationRequest,
  GetPortfolioCreditInformationResponse,
  GetPortfolioWithdrawalPowerRequest,
  GetPortfolioWithdrawalPowerResponse,
  GetTieredPricingFeesRequest,
  GetTieredPricingFeesResponse,
  GetFcmMarginCallDetailsRequest,
  GetFcmMarginCallDetailsResponse,
  GetFcmRiskLimitsRequest,
  GetFcmRiskLimitsResponse,
  CreateNewLocatesRequest,
  CreateNewLocatesResponse,
  GetCrossMarginOverviewRequest,
  GetCrossMarginOverviewResponse,
  ListTFObligationsRequest,
  ListTFObligationsResponse,
  ListFinancingEligibleAssetsRequest,
  ListFinancingEligibleAssetsResponse,
  GetConversionFeesRequest,
  GetConversionFeesResponse,
  GetCrossMarginRiskParametersRequest,
  GetCrossMarginRiskParametersResponse,
  GetCrossMarginPrimeOverviewRequest,
  GetCrossMarginPrimeOverviewResponse,
  UpdateFundingSettingsRequest,
  UpdateFundingSettingsResponse,
  SetFundingSettingsRequest,
  SetFundingSettingsResponse,
  ListMarketDataRequest,
  ListMarketDataResponse,
  GetCrossMarginLiquidationRequest,
  GetCrossMarginLiquidationResponse,
  ListCrossMarginLiquidationsRequest,
  ListCrossMarginLiquidationsResponse,
} from './types';

export interface IFinancingService {
  /**
   * List Existing Locates
   *
   * List locates for the portfolio
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListExistingLocatesError}.
   */
  listExistingLocates(
    request: ListExistingLocatesRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListExistingLocatesResponse>;
  /**
   * List Interest Accruals
   *
   * Lists interest accruals for an entity between the specified date range given
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListInterestAccrualsError}.
   */
  listInterestAccruals(
    request: ListInterestAccrualsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListInterestAccrualsResponse>;
  /**
   * List Interest Accruals For Portfolio
   *
   * Lists interest accruals between the specified date range for a specific portfolio ID
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListPortfolioInterestAccrualsError}.
   */
  listPortfolioInterestAccruals(
    request: ListPortfolioInterestAccrualsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioInterestAccrualsResponse>;
  /**
   * List Margin Call Summaries
   *
   * Lists the margin call history for a given entity ID.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListMarginCallSummariesError}.
   */
  listMarginCallSummaries(
    request: ListMarginCallSummariesRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListMarginCallSummariesResponse>;
  /**
   * List Margin Conversions
   *
   * Lists conversions and short collateral requirement between specified date range. This endpoint is deprecated and will be removed in the future. Use /v1/entities/\{entity_id\}/margin_summaries instead.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListMarginConversionsError}.
   */
  listMarginConversions(
    request: ListMarginConversionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListMarginConversionsResponse>;

  /**
   * Get Entity Locate Availabilities
   *
   * Get currencies available to be located with their corresponding amount and rate.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetEntityLocateAvailabilitiesError}.
   */
  getEntityLocateAvailabilities(
    request: GetEntityLocateAvailabilitiesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityLocateAvailabilitiesResponse>;
  /**
   * Get Margin Information
   *
   * Gets real-time evaluation of the margin model based on current positions and spot rates.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetMarginInformationError}.
   */
  getMarginInformation(
    request: GetMarginInformationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetMarginInformationResponse>;
  /**
   * Get Portfolio Buying Power
   *
   * Returns the size of a buy trade that can be performed based on existing holdings and available credit. The result will differ for different assets due to asset specific credit configurations and caps. Note that this result is changing based on asset price fluctuations, so may be rejected when submitted.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetPortfolioBuyingPowerError}.
   */
  getPortfolioBuyingPower(
    request: GetPortfolioBuyingPowerRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioBuyingPowerResponse>;
  /**
   * Get Portfolio Credit Information
   *
   * Retrieve a portfolio's post-trade credit information.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetPortfolioCreditInformationError}.
   */
  getPortfolioCreditInformation(
    request: GetPortfolioCreditInformationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioCreditInformationResponse>;
  /**
   * Get Portfolio Withdrawal Power
   *
   * Returns the nominal quantity of a given asset that can be withdrawn based on holdings and current portfolio equity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetPortfolioWithdrawalPowerError}.
   */
  getPortfolioWithdrawalPower(
    request: GetPortfolioWithdrawalPowerRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioWithdrawalPowerResponse>;
  /**
   * Get Trade Finance Tiered Pricing Fees
   *
   * Get trade finance tiered pricing fees for a given entity at a specific time, default to current time.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetTieredPricingFeesError}.
   */
  getTieredPricingFees(
    request: GetTieredPricingFeesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetTieredPricingFeesResponse>;
  /**
   * Get FCM Margin Call Details
   *
   * Retrieve the margin call details for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetFcmMarginCallDetailsError}.
   */
  getFcmMarginCallDetails(
    request: GetFcmMarginCallDetailsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetFcmMarginCallDetailsResponse>;
  /**
   * Get FCM Risk Limits
   *
   * Retrieve the risk limits for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetFcmRiskLimitsError}.
   */
  getFcmRiskLimits(
    request: GetFcmRiskLimitsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetFcmRiskLimitsResponse>;

  /**
   * List Existing Locates
   *
   * List locates for the portfolio
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link CreateNewLocatesError}.
   */
  createNewLocates(
    request: CreateNewLocatesRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateNewLocatesResponse>;

  /**
   * Get Exchange Cross Margin Overview
   *
   * Gets live data for Cross Margin (XM) for a specific XM customer
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetCrossMarginOverviewError}.
   */
  getCrossMarginOverview(
    request: GetCrossMarginOverviewRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginOverviewResponse>;

  /**
   * List Trade Finance Obligations
   *
   * List trade finance obligations for a given entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListTFObligationsError}.
   */
  listTFObligations(
    request: ListTFObligationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListTFObligationsResponse>;

  /**
   * List Financing Eligible Assets
   *
   * Get all assets eligible for Trade Finance with their adjustment factors.
   */
  listFinancingEligibleAssets(
    request?: ListFinancingEligibleAssetsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListFinancingEligibleAssetsResponse>;

  /**
   * Get Conversion Fees
   *
   * Get your organization's stablecoin conversion fee tiers and month-to-date net conversion volume per currency. The organization is resolved from the authenticated API key, which must be organization-scoped.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetConversionFeesError}.
   */
  getConversionFees(
    request?: GetConversionFeesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetConversionFeesResponse>;

  /**
   * Get Cross Margin Risk Parameters
   *
   * Gets the current Cross Margin (XM) risk parameters for an entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetCrossMarginRiskParametersError}.
   */
  getCrossMarginRiskParameters(
    request: GetCrossMarginRiskParametersRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginRiskParametersResponse>;

  /**
   * Get Prime Cross Margin Overview
   *
   * Returns real time risk data from the cross margin model.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetCrossMarginPrimeOverviewError}.
   */
  getCrossMarginPrimeOverview(
    request: GetCrossMarginPrimeOverviewRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginPrimeOverviewResponse>;

  /**
   * @deprecated Use {@link IFinancingService.updateFundingSettings} instead.
   *
   * Update Funding Settings
   *
   * Sets FCM funding configuration for the entity and submits the desired configuration to Prime API for approval.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link SetFundingSettingsError}.
   */
  setFundingSettings(
    request: SetFundingSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<SetFundingSettingsResponse>;

  /**
   * Update Funding Settings
   *
   * Sets FCM funding configuration for the entity and submits the desired configuration to Prime API for approval.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link UpdateFundingSettingsError}.
   */
  updateFundingSettings(
    request: UpdateFundingSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<UpdateFundingSettingsResponse>;

  /**
   * Get Cross Margin Liquidation
   *
   * Gets detailed liquidation data for an XM customer. Returns the active or most recent liquidation by default.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetCrossMarginLiquidationError}.
   */
  getCrossMarginLiquidation(
    request: GetCrossMarginLiquidationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginLiquidationResponse>;

  /**
   * List Cross Margin Liquidations
   *
   * Lists historical liquidation records for an XM customer
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListCrossMarginLiquidationsError}.
   */
  listCrossMarginLiquidations(
    request: ListCrossMarginLiquidationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListCrossMarginLiquidationsResponse>;

  /**
   * Get Market Data
   *
   * Retrieves market data including volatility and average daily volume for an entity.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListMarketDataError}.
   */
  listMarketData(
    request: ListMarketDataRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListMarketDataResponse>;
}

export class FinancingService implements IFinancingService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async listExistingLocates(
    request: ListExistingLocatesRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListExistingLocatesResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const { portfolioId, ...queryParams } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/locates`,
      queryParams,
      callOptions: options,
    });

    return response.data as ListExistingLocatesResponse;
  }

  async listInterestAccruals(
    request: ListInterestAccrualsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListInterestAccrualsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const { entityId, ...queryParams } = request;
    const response = await this.client.request({
      url: `entities/${entityId}/accruals`,
      callOptions: options,
      queryParams,
    });

    return response.data as ListInterestAccrualsResponse;
  }

  async listPortfolioInterestAccruals(
    request: ListPortfolioInterestAccrualsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioInterestAccrualsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const queryParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/accruals`,
      callOptions: options,
      queryParams,
    });

    return response.data as ListPortfolioInterestAccrualsResponse;
  }

  async listMarginCallSummaries(
    request: ListMarginCallSummariesRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListMarginCallSummariesResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const queryParams = {
      ...request,
      entityId: undefined,
    };
    const response = await this.client.request({
      url: `entities/${request.entityId}/margin_summaries`,
      callOptions: options,
      queryParams,
    });

    return response.data as ListMarginCallSummariesResponse;
  }

  async listMarginConversions(
    request: ListMarginConversionsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListMarginConversionsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const queryParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/margin_conversions`,
      callOptions: options,
      queryParams,
    });

    return response.data as ListMarginConversionsResponse;
  }

  async getEntityLocateAvailabilities(
    request: GetEntityLocateAvailabilitiesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetEntityLocateAvailabilitiesResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const queryParams = {
      ...request,
      entityId: undefined,
    };
    const response = await this.client.request({
      url: `entities/${request.entityId}/locates_availability`,
      callOptions: options,
      queryParams,
    });

    return response.data as GetEntityLocateAvailabilitiesResponse;
  }

  async getMarginInformation(
    request: GetMarginInformationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetMarginInformationResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/margin`,
      callOptions: options,
    });

    return response.data as GetMarginInformationResponse;
  }

  async getPortfolioBuyingPower(
    request: GetPortfolioBuyingPowerRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioBuyingPowerResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.baseCurrency)
      .requiredString((r) => r.quoteCurrency)
      .check();

    const queryParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/buying_power`,
      callOptions: options,
      queryParams,
    });

    return response.data as GetPortfolioBuyingPowerResponse;
  }

  async getPortfolioCreditInformation(
    request: GetPortfolioCreditInformationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioCreditInformationResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/credit`,
      callOptions: options,
    });

    return response.data as GetPortfolioCreditInformationResponse;
  }

  async getPortfolioWithdrawalPower(
    request: GetPortfolioWithdrawalPowerRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioWithdrawalPowerResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.symbol)
      .check();

    const queryParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/withdrawal_power`,
      callOptions: options,
      queryParams,
    });

    return response.data as GetPortfolioWithdrawalPowerResponse;
  }

  async getTieredPricingFees(
    request: GetTieredPricingFeesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetTieredPricingFeesResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const queryParams = {
      ...request,
      entityId: undefined,
    };
    const response = await this.client.request({
      url: `entities/${request.entityId}/tf_tiered_fees`,
      callOptions: options,
      queryParams,
    });

    return response.data as GetTieredPricingFeesResponse;
  }

  async getFcmMarginCallDetails(
    request: GetFcmMarginCallDetailsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetFcmMarginCallDetailsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/margin_call_details`,
      callOptions: options,
    });

    return response.data as GetFcmMarginCallDetailsResponse;
  }

  async getFcmRiskLimits(
    request: GetFcmRiskLimitsRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetFcmRiskLimitsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/futures/risk_limits`,
      callOptions: options,
    });

    return response.data as GetFcmRiskLimitsResponse;
  }

  async createNewLocates(
    request: CreateNewLocatesRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateNewLocatesResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const bodyParams = {
      ...request,
      portfolioId: undefined,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/locates`,
      callOptions: options,
      bodyParams,
    });

    return response.data as CreateNewLocatesResponse;
  }

  async getCrossMarginOverview(
    request: GetCrossMarginOverviewRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginOverviewResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/cross_margin`,
      callOptions: options,
    });

    return response.data as GetCrossMarginOverviewResponse;
  }

  async listTFObligations(
    request: ListTFObligationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListTFObligationsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/tf_obligations`,
      callOptions: options,
    });

    return response.data as ListTFObligationsResponse;
  }

  async listFinancingEligibleAssets(
    request?: ListFinancingEligibleAssetsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListFinancingEligibleAssetsResponse> {
    const response = await this.client.request({
      url: `financing/eligible-assets`,
      callOptions: options,
    });

    return response.data as ListFinancingEligibleAssetsResponse;
  }

  async getConversionFees(
    request?: GetConversionFeesRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetConversionFeesResponse> {
    const response = await this.client.request({
      url: `conversion/fees`,
      callOptions: options,
    });

    return response.data as GetConversionFeesResponse;
  }

  async getCrossMarginRiskParameters(
    request: GetCrossMarginRiskParametersRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginRiskParametersResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const response = await this.client.request({
      url: `entities/${request.entityId}/cross_margin/risk_parameters`,
      callOptions: options,
    });

    return response.data as GetCrossMarginRiskParametersResponse;
  }

  async getCrossMarginPrimeOverview(
    request: GetCrossMarginPrimeOverviewRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginPrimeOverviewResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    // This endpoint is on the v2 API path; use a relative URL that resolves
    // correctly against the v1 base URL for both auth signing and HTTP dispatch.
    const response = await this.client.request({
      url: `../v2/entities/${request.entityId}/cross_margin/prime`,
      callOptions: options,
    });

    return response.data as GetCrossMarginPrimeOverviewResponse;
  }

  /**
   * @deprecated Use {@link FinancingService.updateFundingSettings} instead.
   */
  async setFundingSettings(
    request: SetFundingSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<SetFundingSettingsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const {
      entityId,
      designatedFundingPortfolioId,
      automaticConversionEnabled,
      automaticLoanEnabled,
      automaticExcessReturnEnabled,
      excessFundsTargetAmount,
    } = request;

    const response = await this.client.request({
      url: `entities/${entityId}/funding_settings`,
      bodyParams: {
        designatedFundingPortfolioId,
        automaticConversionEnabled,
        automaticLoanEnabled,
        automaticExcessReturnEnabled,
        excessFundsTargetAmount,
      },
      method: Method.POST,
      callOptions: options,
    });

    return response.data as SetFundingSettingsResponse;
  }

  async updateFundingSettings(
    request: UpdateFundingSettingsRequest,
    options?: CoinbaseCallOptions
  ): Promise<UpdateFundingSettingsResponse> {
    return this.setFundingSettings(request, options);
  }

  async getCrossMarginLiquidation(
    request: GetCrossMarginLiquidationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCrossMarginLiquidationResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const { entityId, ...queryParams } = request;
    const response = await this.client.request({
      url: `entities/${entityId}/cross_margin/liquidation`,
      queryParams,
      callOptions: options,
    });

    return response.data as GetCrossMarginLiquidationResponse;
  }

  async listCrossMarginLiquidations(
    request: ListCrossMarginLiquidationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListCrossMarginLiquidationsResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const paginationParams = getQueryParams(this.client, request);
    const { limit, cursor, sortDirection, entityId, ...queryParams } = request;
    const finalQueryParams = { ...paginationParams, ...queryParams };

    const response = await this.client.request({
      url: `entities/${entityId}/cross_margin/liquidations`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listCrossMarginLiquidations.bind(this),
      request,
      ResponseExtractors.liquidations,
      paginationOptions
    ) as ListCrossMarginLiquidationsResponse;
  }

  async listMarketData(
    request: ListMarketDataRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListMarketDataResponse> {
    validate(request)
      .requiredUUID((r) => r.entityId)
      .check();

    const paginationParams = getQueryParams(this.client, request);
    const { limit, cursor, sortDirection, entityId, ...queryParams } = request;
    const finalQueryParams = { ...paginationParams, ...queryParams };

    const response = await this.client.request({
      url: `entities/${entityId}/market_data`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listMarketData.bind(this),
      request,
      ResponseExtractors.marketData,
      paginationOptions
    ) as ListMarketDataResponse;
  }
}
