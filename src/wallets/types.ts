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
import { WalletType, WalletDepositInstructionType } from '../model/enums/';
import {
  GetWalletsResponse,
  GetWalletResponse as internalGet,
  ListWalletAddressesResponse as internalGetAddresses,
  GetWalletDepositInstructionsResponse as internalGetInstructs,
  CreateWalletRequest as internalCreate,
  CreateWalletResponse as internalCreateResp,
  BlockchainAddress,
  Wallet,
} from '../model/';
import { Pagination } from '../shared/pagination';
import {
  BasePaginatedRequest,
  PaginatedListResponse,
} from '../shared/paginatedResponse';

export type ListWalletsRequest = Pagination & {
  portfolioId: string;
  type?: WalletType;
  symbols?: string[];
  getNetworkUnifiedWallets?: boolean;
};

export type ListWalletsResponse = PaginatedListResponse<
  GetWalletsResponse,
  ListWalletsRequest & BasePaginatedRequest,
  Wallet
>;

export type GetWalletRequest = {
  portfolioId: string;
  walletId: string;
};

export type GetWalletResponse = Expand<internalGet>;

export type GetWalletDepositInstructionsRequest = {
  portfolioId: string;
  walletId: string;
  depositType: WalletDepositInstructionType;
  networkId?: string;
  networkType?: string;
};

export type GetWalletDepositInstructionsResponse = Expand<internalGetInstructs>;

export type ListWalletAddressesRequest = {
  portfolioId: string;
  walletId: string;
  networkId?: string;
  networkType?: string;
  cursor?: string;
  limit?: number;
};

export type ListWalletAddressesResponse = PaginatedListResponse<
  internalGetAddresses,
  ListWalletAddressesRequest & BasePaginatedRequest,
  BlockchainAddress
>;

export type CreateWalletRequest = internalCreate & {
  portfolioId: string;
};

export type CreateWalletResponse = Expand<internalCreateResp>;

export type CreateWalletDepositAddressRequest = {
  portfolioId: string;
  walletId: string;
  networkId: string;
};

export type CreateWalletDepositAddressResponse = Expand<BlockchainAddress>;

/* GENERATED-METHOD-ERRORS-START */
export type {
  CreateWalletDepositAddressError,
  CreateWalletError,
  GetWalletDepositInstructionsError,
  GetWalletError,
  ListWalletAddressesError,
  ListWalletsError,
} from '../model/errors/methodErrors';
/* GENERATED-METHOD-ERRORS-END */
