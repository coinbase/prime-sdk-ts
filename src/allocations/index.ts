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
import { CoinbaseCallOptions, Method, IPrimeApiClient } from '../clients';
import { validate } from '../shared/validation';
import {
  CreateAllocationRequest,
  CreateAllocationResponse,
  CreateNetAllocationRequest,
  CreateNetAllocationResponse,
  ListPortfolioAllocationsRequest,
  ListPortfolioAllocationsResponse,
  ListNetAllocationsRequest,
  ListNetAllocationsResponse,
  GetAllocationRequest,
  GetAllocationResponse,
} from './types';
import {
  createPaginatedResponse,
  getDefaultPaginationOptions,
  getQueryParams,
  ResponseExtractors,
} from '../shared/paginatedResponse';

export interface IAllocationService {
  /**
   * Create Portfolio Allocations
   *
   * Create allocation for a given portfolio.
   */
  createAllocation(
    request: CreateAllocationRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateAllocationResponse>;

  /**
   * Create Portfolio Net Allocations
   *
   * Create net allocation for a given portfolio.
   */
  createNetAllocation(
    request: CreateNetAllocationRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateNetAllocationResponse>;

  /**
   * List Portfolio Allocations
   *
   * List historical allocations for a given portfolio.
   */
  listPortfolioAllocations(
    request: ListPortfolioAllocationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioAllocationsResponse>;

  /**
   * Get Net Allocations by Netting ID
   *
   * Retrieve an allocation by netting ID.
   */
  listNetAllocations(
    request: ListNetAllocationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListNetAllocationsResponse>;

  /**
   * Get Allocation by ID
   *
   * Retrieve an allocation by allocation ID.
   */
  getAllocation(
    request: GetAllocationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetAllocationResponse>;
}

export class AllocationService implements IAllocationService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async createAllocation(
    request: CreateAllocationRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateAllocationResponse> {
    const response = await this.client.request({
      url: `allocations`,
      bodyParams: request,
      method: Method.POST,
      callOptions: options,
    });

    return response.data as CreateAllocationResponse;
  }

  async createNetAllocation(
    request: CreateNetAllocationRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateNetAllocationResponse> {
    const response = await this.client.request({
      url: `allocations/net`,
      bodyParams: request,
      method: Method.POST,
      callOptions: options,
    });

    return response.data as CreateNetAllocationResponse;
  }

  async listPortfolioAllocations(
    request: ListPortfolioAllocationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioAllocationsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .check();

    const paginationParams = getQueryParams(this.client, request);
    const { limit, cursor, sortDirection, portfolioId, ...queryParams } =
      request;
    const finalQueryParams = {
      ...paginationParams,
      ...queryParams,
    };

    const response = await this.client.request({
      url: `portfolios/${portfolioId}/allocations`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listPortfolioAllocations.bind(this),
      request,
      ResponseExtractors.allocations,
      paginationOptions
    ) as ListPortfolioAllocationsResponse;
  }

  async listNetAllocations(
    request: ListNetAllocationsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListNetAllocationsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.nettingId)
      .check();

    const queryParams = {
      allocationId: request.allocationId,
    };
    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/allocations/net/${request.nettingId}`,
      queryParams,
      callOptions: options,
    });

    return response.data as ListNetAllocationsResponse;
  }

  async getAllocation(
    request: GetAllocationRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetAllocationResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.allocationId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/allocations/${request.allocationId}`,
      callOptions: options,
    });

    return response.data as GetAllocationResponse;
  }
}
