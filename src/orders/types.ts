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
import { OrderSide, OrderStatus, OrderType } from '../model/enums/';
import {
  Fill,
  GetOpenOrdersResponse,
  GetOrderFillsResponse,
  GetOrderResponse as internalGet,
  GetOrdersResponse,
  GetPortfolioFillsResponse,
  Order,
  GetOrderEditHistoryResponse as internalEditHistory,
  OrderPreviewRequest,
  PostOrderPreviewResponse,
  CancelOrderResponse as internalCancel,
  CreateOrderResponse as internalCreateResp,
  CreateOrderRequest as internalCreate,
  QuoteResponse,
  AcceptQuoteRequest as internalAcceptQuoteReq,
  AcceptQuoteResponse as internalAcceptQuoteResp,
  EditOrderRequest as internalEditOrderRequest,
  EditOrderResponse as internalEditOrderResponse,
} from '../model/';
import { Pagination } from '../shared/pagination';
import {
  BasePaginatedRequest,
  PaginatedListResponse,
} from '../shared/paginatedResponse';

export type GetOrderRequest = {
  portfolioId: string;
  orderId: string;
};

export type GetOrderResponse = Expand<internalGet>;

export type ListPortfolioFillsRequest = Pagination & {
  portfolioId: string;
  startDate?: string;
  endDate?: string;
};

export type ListPortfolioFillsResponse = PaginatedListResponse<
  GetPortfolioFillsResponse,
  ListPortfolioFillsRequest & BasePaginatedRequest,
  Fill
>;

export type ListPortfolioOrdersRequest = Pagination & {
  portfolioId: string;
  orderStatuses?: OrderStatus[];
  productIds?: string[];
  orderType?: OrderType;
  orderSide?: OrderSide;
  startDate?: string;
  endDate?: string;
};

export type ListPortfolioOrdersResponse = PaginatedListResponse<
  GetOrdersResponse,
  ListPortfolioOrdersRequest & BasePaginatedRequest,
  Order
>;

export type ListOrderFillsRequest = Pagination & {
  portfolioId: string;
  orderId: string;
};

export type ListOrderFillsResponse = PaginatedListResponse<
  GetOrderFillsResponse,
  ListOrderFillsRequest & BasePaginatedRequest,
  Fill
>;

export type ListOpenOrdersRequest = Pagination & {
  portfolioId: string;
  productIds?: string[];
  orderType?: OrderType;
  orderSide?: OrderSide;
  startDate?: string;
  endDate?: string;
};

export type ListOpenOrdersResponse = PaginatedListResponse<
  GetOpenOrdersResponse,
  ListOpenOrdersRequest & BasePaginatedRequest,
  Order
>;

export type CreateOrderPreviewRequest = OrderPreviewRequest & {
  portfolioId: string;
};

export type CreateOrderPreviewResponse = Expand<PostOrderPreviewResponse>;

export type CancelOrderRequest = {
  portfolioId: string;
  orderId: string;
};

export type CancelOrderResponse = Expand<internalCancel>;

export type CreateOrderRequest = internalCreate & {
  portfolioId: string;
};
export type CreateOrderResponse = Expand<internalCreateResp>;

export type CreateQuoteRequest = internalCreate & {
  portfolioId: string;
};

export type CreateQuoteResponse = Expand<QuoteResponse>;

export type AcceptQuoteRequest = internalAcceptQuoteReq & {
  portfolioId: string;
};

export type AcceptQuoteResponse = Expand<internalAcceptQuoteResp>;

export type GetOrderEditHistoryRequest = {
  portfolioId: string;
  orderId: string;
};

export type GetOrderEditHistoryResponse = Expand<
  Omit<internalEditHistory, 'orderEditHistory'>
>;

export type EditOrderRequest = internalEditOrderRequest & {
  portfolioId: string;
  orderId: string;
};

export type EditOrderResponse = Expand<internalEditOrderResponse>;
