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
  ListOpenOrdersResponse,
  ListOpenOrdersRequest,
  ListOrderFillsRequest,
  ListOrderFillsResponse,
  ListPortfolioOrdersResponse,
  ListPortfolioOrdersRequest,
  GetOrderResponse,
  GetOrderRequest,
  GetOrderEditHistoryRequest,
  GetOrderEditHistoryResponse,
  ListPortfolioFillsRequest,
  ListPortfolioFillsResponse,
  CreateOrderPreviewRequest,
  CreateOrderPreviewResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateQuoteRequest,
  CreateQuoteResponse,
  AcceptQuoteRequest,
  AcceptQuoteResponse,
  EditOrderRequest,
  EditOrderResponse,
} from './types';
import {
  createPaginatedResponse,
  getDefaultPaginationOptions,
  getQueryParams,
  ResponseExtractors,
} from '../shared/paginatedResponse';

export interface IOrdersService {
  /**
   * Get Order by Order ID
   *
   * Retrieve an order by order ID.
   */
  getOrder(
    request: GetOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetOrderResponse>;

  /**
   * List Order Edit History
   *
   * List edit history for a specific order
   */
  getOrderEditHistory(
    request: GetOrderEditHistoryRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetOrderEditHistoryResponse>;

  /**
   * List Portfolio Fills
   *
   * Retrieve fills on a given portfolio. This endpoint requires a start_date, and returns a payload with a default limit of 100 if not specified by the user. The maximum allowed limit is 3000.
   */
  listPortfolioFills(
    request: ListPortfolioFillsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioFillsResponse>;

  /**
   * List Portfolio Orders
   *
   * List historical orders for a given portfolio. This endpoint returns a payload with a default limit of 100 if not specified by the user. The maximum allowed limit is 3000. <br /><br />**Caution:** Currently, you cannot query open orders with this endpoint: use List Open Orders if you have less than 1000 open orders, otherwise use Websocket API, or FIX API to stream open orders.
   */
  listPortfolioOrders(
    request: ListPortfolioOrdersRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioOrdersResponse>;

  /**
   * List Order Fills
   *
   * Retrieve fills on a given order. This endpoint returns a payload with a default limit of 100 if not specified by the user. The maximum allowed limit is 3000.
   */
  listOrderFills(
    request: ListOrderFillsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListOrderFillsResponse>;

  /**
   * List Open Orders
   *
   * List all open orders. <br /><br />**Caution:** The maximum number of orders returned is 5000. If a client has more than 5000 open orders, an error is returned prompting the user to use Websocket API, or FIX API to stream open orders.
   */
  listOpenOrders(
    request: ListOpenOrdersRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListOpenOrdersResponse>;

  /**
   * Get Order Preview
   *
   * Retrieve an order preview.
   */
  createOrderPreview(
    request: CreateOrderPreviewRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateOrderPreviewResponse>;

  /**
   * Cancel Order
   *
   * Cancel an order. (Filled orders cannot be canceled.)
   */
  cancelOrder(
    request: CancelOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<CancelOrderResponse>;

  /**
   * Create Order
   *
   * Create an order.
   */
  createOrder(
    request: CreateOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateOrderResponse>;

  /**
   * Create Quote Request
   *
   * A Quote Request is the start of the RFQ process. Coinbase Prime sends a Quote Request to Liquidity Providers (LPs) on behalf of a customer looking to participate in an RFQ trade.
   *
   * Always required: portfolio_id, product_id, side, client_quote_id, and limit_price. One of either base_quantity or quote_value is always required.
   */
  createQuote(
    request: CreateQuoteRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateQuoteResponse>;

  /**
   * Accept Quote
   *
   * Accepts the quote received by the quote request and creates an order with the provided quote ID.
   *
   * Always required: portfolio_id, product_id, side, quote_id, client_quote_id.
   */
  acceptQuote(
    request: AcceptQuoteRequest,
    options?: CoinbaseCallOptions
  ): Promise<AcceptQuoteResponse>;

  /**
   * Edit Order
   *
   * Edit an open order.
   */
  editOrder(
    request: EditOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<EditOrderResponse>;
}

export class OrdersService implements IOrdersService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async getOrder(
    request: GetOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetOrderResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.orderId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/orders/${request.orderId}`,
      callOptions: options,
    });

    return response.data as GetOrderResponse;
  }

  async getOrderEditHistory(
    request: GetOrderEditHistoryRequest,
    options?: CoinbaseCallOptions
  ): Promise<GetOrderEditHistoryResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.orderId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/orders/${request.orderId}/edit_history`,
      callOptions: options,
    });

    // drop deprecated field
    delete response.data.orderEditHistory;

    return response.data as GetOrderEditHistoryResponse;
  }

  async listPortfolioFills(
    request: ListPortfolioFillsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioFillsResponse> {
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
      url: `portfolios/${portfolioId}/fills`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listPortfolioFills.bind(this),
      request,
      ResponseExtractors.fills,
      paginationOptions
    ) as ListPortfolioFillsResponse;
  }

  async listPortfolioOrders(
    request: ListPortfolioOrdersRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListPortfolioOrdersResponse> {
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
      url: `portfolios/${portfolioId}/orders`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listPortfolioOrders.bind(this),
      request,
      ResponseExtractors.orders,
      paginationOptions
    ) as ListPortfolioOrdersResponse;
  }

  async listOrderFills(
    request: ListOrderFillsRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListOrderFillsResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.orderId)
      .check();

    const paginationParams = getQueryParams(this.client, request);
    const {
      limit,
      cursor,
      sortDirection,
      portfolioId,
      orderId,
      ...queryParams
    } = request;
    const finalQueryParams = {
      ...paginationParams,
      ...queryParams,
    };
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/orders/${orderId}/fills`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listOrderFills.bind(this),
      request,
      ResponseExtractors.fills,
      paginationOptions
    ) as ListOrderFillsResponse;
  }

  async listOpenOrders(
    request: ListOpenOrdersRequest,
    options?: CoinbaseCallOptions
  ): Promise<ListOpenOrdersResponse> {
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
      url: `portfolios/${portfolioId}/open_orders`,
      queryParams: finalQueryParams,
      callOptions: options,
    });

    const paginationOptions = getDefaultPaginationOptions(this.client, options);

    return createPaginatedResponse(
      response.data,
      this.listOpenOrders.bind(this),
      request,
      ResponseExtractors.orders,
      paginationOptions
    ) as ListOpenOrdersResponse;
  }

  async createOrderPreview(
    request: CreateOrderPreviewRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateOrderPreviewResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.productId)
      .requiredString((r) => r.side)
      .requiredString((r) => r.type)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/order_preview`,
      method: Method.POST,
      bodyParams: request,
      callOptions: options,
    });
    return response.data as CreateOrderPreviewResponse;
  }

  async cancelOrder(
    request: CancelOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<CancelOrderResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.orderId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/orders/${request.orderId}/cancel`,
      method: Method.POST,
      callOptions: options,
    });
    return response.data as CancelOrderResponse;
  }

  async createOrder(
    request: CreateOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateOrderResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.productId)
      .requiredString((r) => r.side)
      .requiredUUID((r) => r.clientOrderId)
      .requiredString((r) => r.type)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/order`,
      method: Method.POST,
      bodyParams: request,
      callOptions: options,
    });
    return response.data as CreateOrderResponse;
  }

  async createQuote(
    request: CreateQuoteRequest,
    options?: CoinbaseCallOptions
  ): Promise<CreateQuoteResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.productId)
      .requiredString((r) => r.side)
      .requiredUUID((r) => r.clientOrderId)
      .requiredString((r) => r.type)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/rfq`,
      method: Method.POST,
      bodyParams: request,
      callOptions: options,
    });
    return response.data as CreateQuoteResponse;
  }

  async acceptQuote(
    request: AcceptQuoteRequest,
    options?: CoinbaseCallOptions
  ): Promise<AcceptQuoteResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredString((r) => r.productId)
      .requiredString((r) => r.side)
      .requiredUUID((r) => r.clientOrderId)
      .requiredString((r) => r.quoteId)
      .check();

    const response = await this.client.request({
      url: `portfolios/${request.portfolioId}/accept_quote`,
      method: Method.POST,
      bodyParams: request,
      callOptions: options,
    });
    return response.data as AcceptQuoteResponse;
  }

  async editOrder(
    request: EditOrderRequest,
    options?: CoinbaseCallOptions
  ): Promise<EditOrderResponse> {
    validate(request)
      .requiredUUID((r) => r.portfolioId)
      .requiredUUID((r) => r.orderId)
      .requiredUUID((r) => r.clientOrderId)
      .requiredString((r) => r.origClientOrderId)
      .check();

    const { portfolioId, orderId, ...bodyParams } = request;
    const response = await this.client.request({
      url: `portfolios/${portfolioId}/orders/${orderId}/edit`,
      method: Method.PUT,
      bodyParams,
      callOptions: options,
    });

    return response.data as EditOrderResponse;
  }
}
