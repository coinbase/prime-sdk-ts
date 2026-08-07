/**
 * Copyright 2026-present Coinbase Global, Inc.
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

/**
 * Hand-maintained descriptions for request properties that have no title or
 * description in the upstream OpenAPI spec (and whose $ref targets also lack
 * schema-level documentation). Keys use snake_case property names as they
 * appear in the spec.
 */
module.exports = {
  byOperation: {
    PrimeRESTAPI_AcceptQuote: {
      settl_currency: 'The currency in which the settlement will be made',
    },
    PrimeRESTAPI_CreateOrder: {
      display_base_size:
        'The maximum order size that will show up on venue order books (in base currency).',
      is_raise_exact:
        'Raise Exact order flag (size inclusive of fees for sell orders in quote)',
    },
    PrimeRESTAPI_CreateOnchainTransaction: {
      rpc: 'Optional RPC configuration for onchain transaction broadcast',
      evm_params:
        'Optional EVM-specific parameters for onchain transaction signing and broadcast',
    },
    PrimeRESTAPI_CreateWallet: {
      network_family:
        'The network family for onchain wallets (e.g. EVM or Solana)',
      network: 'The blockchain network configuration for onchain wallets',
    },
    PrimeRESTAPI_CreateWalletWithdrawal: {
      payment_method:
        'Payment method destination details (required when destination_type is DESTINATION_PAYMENT_METHOD)',
      blockchain_address:
        'Blockchain address destination details (required when destination_type is DESTINATION_BLOCKCHAIN)',
      travel_rule_data:
        'Travel rule compliance data for the withdrawal (beneficiary, originator, and ownership attestation)',
    },
    PrimeRESTAPI_ListTransactionValidators: {
      sort_direction: 'Sort direction for paginated results (DESC or ASC)',
    },
    PrimeRESTAPI_PortfolioStakingInitiate: {
      metadata:
        'Optional metadata for the portfolio staking request (e.g. external_id)',
    },
    PrimeRESTAPI_PortfolioStakingUnstake: {
      metadata:
        'Optional metadata for the portfolio unstaking request (e.g. external_id)',
    },
  },
  bySchema: {
    public_rest_apiCreateAllocationRequest: {
      size_type:
        'Indicates whether allocation size is specified in base, quote, or percent units',
    },
    public_rest_apiCreateNetAllocationRequest: {
      size_type:
        'Indicates whether allocation size is specified in base, quote, or percent units',
    },
  },
};
