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
  CoinbaseClientException,
  CoinbaseError,
  CoinbaseResponse,
} from '@coinbase/core-ts';
import { toCamelCase } from '../shared/toCamelCase';

export type PrimeErrorBody = {
  code?: string;
  message?: string;
  subcode?: string;
  traceId?: string;
};

export class CoinbasePrimeClientException extends CoinbaseClientException {
  constructor(message: string) {
    super(message);
  }
}

export class CoinbasePrimeException<
  TBody extends PrimeErrorBody = PrimeErrorBody,
> extends CoinbaseError {
  readonly body: TBody;

  constructor(
    message: string,
    statusCode: number,
    response: CoinbaseResponse,
    body?: TBody
  ) {
    super(message, statusCode, response);
    this.name = 'CoinbasePrimeException';
    this.body = (body ?? parsePrimeErrorBody(response?.data)) as TBody;
  }

  get code(): TBody['code'] {
    return this.body.code;
  }

  get subcode(): TBody['subcode'] {
    return this.body.subcode;
  }

  get traceId(): TBody['traceId'] {
    return this.body.traceId;
  }
}

export function parsePrimeErrorBody(data: unknown): PrimeErrorBody {
  if (data == null) {
    return {};
  }
  if (typeof data === 'string') {
    const raw = data;
    try {
      data = JSON.parse(raw);
    } catch {
      return { message: raw };
    }
  }
  if (typeof data !== 'object') {
    return {};
  }
  return toCamelCase(data) as PrimeErrorBody;
}

export function isPrimeApiError<T extends PrimeErrorBody = PrimeErrorBody>(
  error: unknown
): error is CoinbasePrimeException<T> {
  return error instanceof CoinbasePrimeException;
}

export function wrapAsPrimeException(error: unknown): never {
  if (error instanceof CoinbasePrimeClientException) {
    throw error;
  }
  if (error instanceof CoinbasePrimeException) {
    throw error;
  }
  if (error instanceof CoinbaseError) {
    const body = parsePrimeErrorBody(error.response?.data);
    const message = body.message
      ? `${error.statusCode} Prime Error: ${body.message}`
      : error.message;
    const response: CoinbaseResponse = {
      ...(error.response || {
        status: error.statusCode,
        statusText: '',
        headers: {},
      }),
      data: body,
      status: error.response?.status ?? error.statusCode,
      statusText: error.response?.statusText ?? '',
      headers: error.response?.headers ?? {},
    };
    throw new CoinbasePrimeException(message, error.statusCode, response, body);
  }
  throw error;
}
