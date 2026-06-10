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
import { TransactionType, TravelRuleStatus } from '../model/enums/';
import {
  GetPortfolioTransactionsResponse,
  GetWalletTransactionsResponse,
  Transaction,
  GetTransactionResponse as internalGet,
  CreateConversionRequest as internalCreateConversion,
  CreateConversionResponse as internalCreateConversionResp,
  CreateATransferBetweenTwoWallets,
  CreateWalletWithdrawalRequest,
  CreateWalletWithdrawalResponse,
  CreateWalletTransferResponse,
  CreateOnchainTransactionRequest as internalCreate,
  CreateOnchainTransactionResponse as internalCreateResp,
  RequestToSubmitTravelRuleDataForAnExistingDepositTransaction,
  SubmitDepositTravelRuleDataResponse as internalSubmitTravelRuleResp,
  GetTransactionTravelRuleDataResponse as internalGetTransactionTravelRuleResp,
} from '../model/';
import { Pagination } from '../shared/pagination';
import {
  PaginatedListResponse,
  BasePaginatedRequest,
} from '../shared/paginatedResponse';

export type ListPortfolioTransactionsRequest = Pagination & {
  portfolioId: string;
  symbols?: string[];
  types?: TransactionType[];
  startTime?: string;
  endTime?: string;
  getNetworkUnifiedTransactions?: boolean;
  travelRuleStatus?: TravelRuleStatus[];
};

export type ListPortfolioTransactionsResponse = PaginatedListResponse<
  GetPortfolioTransactionsResponse,
  ListPortfolioTransactionsRequest & BasePaginatedRequest,
  Transaction
>;

export type ListWalletTransactionsRequest = Pagination & {
  portfolioId: string;
  walletId: string;
  types?: TransactionType[];
  startTime?: string;
  endTime?: string;
};

export type ListWalletTransactionsResponse = PaginatedListResponse<
  GetWalletTransactionsResponse,
  ListWalletTransactionsRequest & BasePaginatedRequest,
  Transaction
>;

export type GetTransactionRequest = {
  portfolioId: string;
  transactionId: string;
};

export type GetTransactionResponse = Expand<internalGet>;

export type CreateConversionRequest = internalCreateConversion & {
  portfolioId: string;
  walletId: string;
};

export type CreateConversionResponse = Expand<internalCreateConversionResp>;

export type CreateTransferRequest = CreateATransferBetweenTwoWallets & {
  portfolioId: string;
  walletId: string;
};

export type CreateTransferResponse = Expand<CreateWalletTransferResponse>;

export type CreateWithdrawalRequest = CreateWalletWithdrawalRequest & {
  portfolioId: string;
  walletId: string;
};

export type CreateWithdrawalResponse = Expand<CreateWalletWithdrawalResponse>;

export type CreateOnchainTransactionRequest = internalCreate & {
  portfolioId: string;
  walletId: string;
};

export type CreateOnchainTransactionResponse = Expand<internalCreateResp>;

export type SubmitDepositTravelRuleRequest =
  RequestToSubmitTravelRuleDataForAnExistingDepositTransaction & {
    portfolioId: string;
    transactionId: string;
  };

export type SubmitDepositTravelRuleResponse =
  Expand<internalSubmitTravelRuleResp>;

export type GetTransactionTravelRuleDataRequest = {
  portfolioId: string;
  transactionId: string;
};

export type GetTransactionTravelRuleDataResponse =
  Expand<internalGetTransactionTravelRuleResp>;
