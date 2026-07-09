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

// Types-only entry point - for users who only need TypeScript type definitions
// without importing any runtime code. Ideal for type-only imports and
// reducing bundle size when types are used for annotations only.

// Export all model types and enums
export type * from './model/';
export * from './model/enums/';

// Export service interfaces (no implementations)
export type { IAdvancedTransfersService } from './advancedTransfers';
export type { IActivitiesService } from './activities';
export type { IAddressBooksService } from './addressBooks';
export type { IAllocationService } from './allocations';
export type { IAssetsService } from './assets';
export type { IBalancesService } from './balances';
export type { ICommissionService } from './commission';
export type { IFinancingService } from './financing';
export type { IFuturesService } from './futures';
export type { IInvoicesService } from './invoices';
export type {
  IOnchainAddressBookService,
  OnchainAddressBookService,
} from './onchainAddressBook';
export type { IOrdersService } from './orders';
export type { IPaymentMethodsService } from './paymentMethods';
export type { IPortfoliosService } from './portfolios';
export type { IPositionsService } from './positions';
export type { IProductsService } from './products';
export type { IStakingService } from './staking';
export type { ITransactionsService } from './transactions';
export type { IUsersService } from './users';
export type { IWalletsService } from './wallets';

// Export client configuration types
export {
  IPrimeApiClient,
  CoinbasePrimeClientConfig,
  CoinbaseClient,
  CoinbaseHttpClientRetryOptions,
  CoinbaseCallOptions,
  Method,
  CoinbaseClientException,
  CoinbaseError,
  CoinbaseResponse,
  TransformRequestFn,
  TransformResponseFn,
} from './clients';

// Service request/response types (same surface as the main entry)
export type {
  CancelAdvancedTransferRequest,
  CancelAdvancedTransferResponse,
  CreateAdvancedTransferRequest,
  CreateAdvancedTransferResponse,
  ListAdvancedTransferTransactionsRequest,
  ListAdvancedTransferTransactionsResponse,
  ListAdvancedTransfersRequest,
  ListAdvancedTransfersResponse,
} from './advancedTransfers/types';
export type {
  GetActivityRequest,
  GetActivityResponse,
  GetPortfolioActivitiesRequest,
  GetPortfolioActivityResponse,
  ListEntityActivitiesRequest,
  ListEntityActivitiesResponse,
  ListPortfolioActivitiesRequest,
  ListPortfolioActivitiesResponse,
} from './activities/types';
export type {
  CreateAddressBookRequest,
  CreateAddressBookResponse,
  ListAddressBooksRequest,
  ListAddressBooksResponse,
} from './addressBooks/types';
export type {
  CreateAllocationRequest,
  CreateAllocationResponse,
  CreateNetAllocationRequest,
  CreateNetAllocationResponse,
  ListNetAllocationsRequest,
  ListNetAllocationsResponse,
  ListPortfolioAllocationsRequest,
  ListPortfolioAllocationsResponse,
  GetAllocationRequest,
  GetAllocationResponse,
} from './allocations/types';
export type { ListAssetsRequest, ListAssetsResponse } from './assets/types';
export type {
  GetWalletBalanceRequest,
  GetWalletBalanceResponse,
  ListOnchainWalletBalancesRequest,
  ListOnchainWalletBalancesResponse,
  ListPortfolioBalancesRequest,
  ListPortfolioBalancesResponse,
  ListEntityBalancesRequest,
  ListEntityBalancesResponse,
} from './balances/types';
export type {
  GetPortfolioCommissionRequest,
  GetPortfolioCommissionResponse,
} from './commission/types';
export type {
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
  GetFcmMarginCallDetailsRequest,
  GetFcmMarginCallDetailsResponse,
  GetFcmRiskLimitsRequest,
  GetFcmRiskLimitsResponse,
  GetTieredPricingFeesRequest,
  GetTieredPricingFeesResponse,
  CreateNewLocatesRequest,
  CreateNewLocatesResponse,
  GetCrossMarginOverviewRequest,
  GetCrossMarginOverviewResponse,
} from './financing/types';
export type {
  CancelEntitySweepRequest,
  CancelEntitySweepResponse,
  GetEntityFuturesBalanceRequest,
  GetEntityFuturesBalanceResponse,
  GetEntityFuturesPositionsRequest,
  GetEntityFuturesPositionsResponse,
  ListEntityFuturesSweepsRequest,
  ListEntityFuturesSweepsResponse,
  ScheduleEntityFuturesSweepRequest,
  ScheduleEntityFuturesSweepResponse,
  UpdateEntityFuturesAutoSweepRequest,
  UpdateEntityFuturesAutoSweepResponse,
  GetEntityFcmEquityRequest,
  GetEntityFcmEquityResponse,
} from './futures/types';
export type {
  ListInvoicesRequest,
  ListInvoicesResponse,
} from './invoices/types';
export type {
  CreateOnchainAddressBookEntryRequest,
  CreateOnchainAddressBookEntryResponse,
  DeleteOnchainAddressBookEntryRequest,
  DeleteOnchainAddressBookEntryResponse,
  ListOnchainAddressBookRequest,
  ListOnchainAddressBookResponse,
  UpdateOnchainAddressBookEntryRequest,
  UpdateOnchainAddressBookEntryResponse,
} from './onchainAddressBook/types';
export type {
  AcceptQuoteRequest,
  AcceptQuoteResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  CreateOrderPreviewRequest,
  CreateOrderPreviewResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateQuoteRequest,
  CreateQuoteResponse,
  GetOrderRequest,
  GetOrderResponse,
  GetOrderEditHistoryRequest,
  GetOrderEditHistoryResponse,
  ListOpenOrdersRequest,
  ListOpenOrdersResponse,
  ListOrderFillsRequest,
  ListOrderFillsResponse,
  ListPortfolioFillsRequest,
  ListPortfolioFillsResponse,
  ListPortfolioOrdersRequest,
  ListPortfolioOrdersResponse,
  EditOrderRequest,
  EditOrderResponse,
} from './orders/types';
export type {
  GetPaymentMethodRequest,
  GetPaymentMethodResponse,
  ListEntityPaymentMethodsRequest,
  ListEntityPaymentMethodsResponse,
} from './paymentMethods/types';
export type {
  ListPortfoliosRequest,
  ListPortfoliosResponse,
  GetPortfolioCreditRequest,
  GetPortfolioCreditResponse,
  GetPortfolioRequest,
  GetPortfolioResponse,
  GetCounterpartyIdRequest,
  GetCounterpartyIdResponse,
} from './portfolios/types';
export type {
  ListAggregateEntityPositionsRequest,
  ListAggregateEntityPositionsResponse,
  ListEntityPositionsRequest,
  ListEntityPositionsResponse,
} from './positions/types';
export type {
  ListProductsRequest,
  ListProductsResponse,
  ListProductCandlesRequest,
  ListProductCandlesResponse,
} from './products/types';
export type {
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
} from './staking/types';
export type {
  CreateConversionRequest,
  CreateConversionResponse,
  CreateOnchainTransactionRequest,
  CreateOnchainTransactionResponse,
  CreateTransferRequest,
  CreateTransferResponse,
  CreateWithdrawalRequest,
  CreateWithdrawalResponse,
  GetTransactionRequest,
  GetTransactionResponse,
  ListPortfolioTransactionsRequest,
  ListPortfolioTransactionsResponse,
  ListWalletTransactionsRequest,
  ListWalletTransactionsResponse,
} from './transactions/types';
export type {
  ListPortfolioUsersRequest,
  ListPortfolioUsersResponse,
  ListUsersRequest,
  ListUsersResponse,
} from './users/types';
export type {
  CreateWalletRequest,
  CreateWalletResponse,
  CreateWalletDepositAddressRequest,
  CreateWalletDepositAddressResponse,
  GetWalletDepositInstructionsRequest,
  GetWalletDepositInstructionsResponse,
  GetWalletRequest,
  GetWalletResponse,
  ListWalletAddressesRequest,
  ListWalletAddressesResponse,
  ListWalletsRequest,
  ListWalletsResponse,
} from './wallets/types';
