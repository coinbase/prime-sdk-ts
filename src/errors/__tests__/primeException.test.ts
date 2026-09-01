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
import { CoinbaseError, CoinbaseResponse } from '@coinbase/core-ts';
import {
  CoinbasePrimeClientException,
  CoinbasePrimeException,
  isPrimeApiError,
  parsePrimeErrorBody,
  wrapAsPrimeException,
} from '../index';
import type { CreateOrderError } from '../../model/errors/methodErrors';

function mockResponse(data: unknown, status = 400): CoinbaseResponse {
  return {
    data,
    status,
    statusText: 'Bad Request',
    headers: {},
  };
}

describe('CoinbasePrimeException', () => {
  it('camelCases snake_case error bodies and exposes getters', () => {
    const response = mockResponse({
      code: 'VALIDATION_ERROR',
      message: 'invalid order',
      subcode: 'ORDER_SIZE_INVALID',
      trace_id: 'trace-123',
    });
    const error = new CoinbaseError(
      '400 Coinbase Invalid Request Error',
      400,
      response
    );

    expect(() => wrapAsPrimeException(error)).toThrow(CoinbasePrimeException);

    try {
      wrapAsPrimeException(error);
    } catch (caught) {
      expect(caught).toBeInstanceOf(CoinbaseError);
      expect(isPrimeApiError(caught)).toBe(true);
      expect(isPrimeApiError<CreateOrderError>(caught)).toBe(true);
      if (isPrimeApiError(caught)) {
        expect(caught.statusCode).toBe(400);
        expect(caught.body.traceId).toBe('trace-123');
        expect(caught.body.message).toBe('invalid order');
        expect(caught.code).toBe('VALIDATION_ERROR');
        expect(caught.subcode).toBe('ORDER_SIZE_INVALID');
        expect(caught.traceId).toBe('trace-123');
        expect(caught.message).toContain('invalid order');
        expect(caught.response.data).toEqual({
          code: 'VALIDATION_ERROR',
          message: 'invalid order',
          subcode: 'ORDER_SIZE_INVALID',
          traceId: 'trace-123',
        });
      }
    }
  });

  it('does not wrap client validation exceptions', () => {
    const validation = new CoinbasePrimeClientException('bad uuid');
    expect(() => wrapAsPrimeException(validation)).toThrow(
      CoinbasePrimeClientException
    );
    expect(() => wrapAsPrimeException(validation)).not.toThrow(
      CoinbasePrimeException
    );
  });

  it('rethrown unknown errors stay unknown', () => {
    expect(() => wrapAsPrimeException(new Error('boom'))).toThrow('boom');
  });

  it('parsePrimeErrorBody handles JSON strings', () => {
    expect(parsePrimeErrorBody('{"trace_id":"abc","message":"nope"}')).toEqual({
      traceId: 'abc',
      message: 'nope',
    });
  });
});
