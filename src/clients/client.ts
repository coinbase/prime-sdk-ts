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
import {
  CoinbaseClient,
  CoinbaseHttpRequestOptions,
  CoinbaseResponse,
} from '@coinbase/core-ts';
import { wrapAsPrimeException } from '../errors';

import {
  API_BASE_PATH,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_MAX_ITEMS,
  DEFAULT_MAX_PAGES,
  USER_AGENT,
} from '../constants';
import { CoinbasePrimeCredentials } from '../credentials';
import { toCamelCase } from '../shared/toCamelCase';
import {
  createCredentialsFromEnv,
  mergeClientOptionsFromEnv,
} from '../shared/envUtils';
import type { CoinbasePrimeClientConfig, IPrimeApiClient } from './types';

export class CoinbasePrimeClient
  extends CoinbaseClient
  implements IPrimeApiClient
{
  constructor(
    credentials?: CoinbasePrimeCredentials,
    apiBasePath?: string,
    options?: CoinbasePrimeClientConfig
  ) {
    const defaultClientOptions = {
      defaultLimit: DEFAULT_PAGINATION_LIMIT,
      maxPages: DEFAULT_MAX_PAGES,
      maxItems: DEFAULT_MAX_ITEMS,
      ...options,
    };
    let basePath = API_BASE_PATH;
    if (apiBasePath && apiBasePath.length > 0) {
      basePath = apiBasePath;
    }
    super(basePath, credentials, USER_AGENT, defaultClientOptions);

    // transform the response data to camelCase
    this.addTransformResponse((response) => {
      return {
        ...response,
        data: toCamelCase(response.data),
      };
    });
  }

  async request(
    options: CoinbaseHttpRequestOptions
  ): Promise<CoinbaseResponse> {
    try {
      return await super.request(options);
    } catch (error) {
      return wrapAsPrimeException(error);
    }
  }

  /**
   * Create a client from environment variables
   * Requires PRIME_CREDENTIALS environment variable with JSON containing:
   * \{ "AccessKey": "...", "SecretKey": "...", "Passphrase": "..." \}
   *
   * Optionally loads mTLS settings from MTLS_* environment variables when set.
   * Explicit `tls` or `httpsAgent` values in `options` take precedence.
   */
  static fromEnv(
    apiBaseUrl?: string,
    options?: CoinbasePrimeClientConfig
  ): CoinbasePrimeClient {
    const credentials = createCredentialsFromEnv();
    const mergedOptions = mergeClientOptionsFromEnv(options);
    return new CoinbasePrimeClient(credentials, apiBaseUrl, mergedOptions);
  }
}
