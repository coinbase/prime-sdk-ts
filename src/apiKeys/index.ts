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
import { CoinbaseCallOptions, IPrimeApiClient, Method } from '../clients';
import { validate } from '../shared/validation';

import { RotateApiKeyRequest, RotateApiKeyResponse } from './types';

export type { RotateApiKeyRequest, RotateApiKeyResponse } from './types';

export interface IApiKeysService {
  /**
   * Rotate API Key
   *
   * Generates a new API key with the same configuration as the invoking key.
   */
  rotateApiKey(
    request: RotateApiKeyRequest,
    options?: CoinbaseCallOptions
  ): Promise<RotateApiKeyResponse>;
}

export class ApiKeysService implements IApiKeysService {
  private client: IPrimeApiClient;

  constructor(client: IPrimeApiClient) {
    this.client = client;
  }

  async rotateApiKey(
    request: RotateApiKeyRequest,
    options?: CoinbaseCallOptions
  ): Promise<RotateApiKeyResponse> {
    validate(request).check();

    const { durationSeconds } = request;

    const response = await this.client.request({
      url: 'api-keys/rotate',
      method: Method.POST,
      bodyParams: {
        durationSeconds,
      },
      callOptions: options,
    });

    return response.data as RotateApiKeyResponse;
  }
}
