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
import { CoinbaseCallOptions, IPrimeApiClient } from '../clients';
import { validate } from '../shared/validation';

import {
  GetPortfolioRequest,
  GetPortfolioResponse,
  GetPortfolioCreditRequest,
  GetPortfolioCreditResponse,
  GetCounterpartyIdRequest,
  GetCounterpartyIdResponse,
  ListPortfoliosResponse,
  ListPortfoliosRequest,
} from './types';

export interface IPortfoliosService {
  /**
   * Get Portfolio by Portfolio ID
   *
   * Retrieve a given portfolio by its portfolio ID.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetPortfolioError}.
   */
  getPortfolio(
    request: GetPortfolioRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioResponse>;

  /**
   * Get Portfolio Credit Information
   *
   * Retrieve a portfolio's post-trade credit information.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetPortfolioCreditError}.
   */
  getPortfolioCredit(
    request: GetPortfolioCreditRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioCreditResponse>;

  /**
   * Get Portfolio Counterparty ID
   *
   * Retrieve the counterparty ID for a given portfolio.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link GetCounterpartyIdError}.
   */
  getCounterpartyId(
    request: GetCounterpartyIdRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCounterpartyIdResponse>;

  /**
   * List Portfolios
   *
   * List all portfolios for which the current API key has read access.
   *
   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ListPortfoliosError}.
   */
  listPortfolios(
    request: ListPortfoliosRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfoliosResponse>;
}

export class PortfoliosService implements IPortfoliosService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async getPortfolio(
    request: GetPortfolioRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}`,
      callOptions: options,
    });

    return response.data as GetPortfolioResponse;
  }

  async getPortfolioCredit(
    request: GetPortfolioCreditRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetPortfolioCreditResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/credit`,
      callOptions: options,
    });

    return response.data as GetPortfolioCreditResponse;
  }

  async getCounterpartyId(
    request: GetCounterpartyIdRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetCounterpartyIdResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/counterparty`,
      callOptions: options,
    });

    return response.data as GetCounterpartyIdResponse;
  }

  async listPortfolios(
    request?: ListPortfoliosRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfoliosResponse> {
    const response = await this.client.request({
      url: `portfolios`,
      callOptions: options,
    });

    return response.data as ListPortfoliosResponse;
  }
}
