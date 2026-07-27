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
import fs from 'fs';
import type { CoinbaseTlsOptions } from '@coinbase/core-ts';
import { CoinbasePrimeCredentials } from '../credentials';
import type { CoinbasePrimeClientConfig } from '../clients/types';

function loadDotenv(): void {
  try {
    require('dotenv').config();
  } catch (error) {
    // dotenv not installed or .env file doesn't exist - that's fine
    // Environment variables might be set directly via shell, Docker, CI/CD, etc.
  }
}

function parseBooleanEnv(value: string | undefined): boolean | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  throw new Error(
    `MTLS_REJECT_UNAUTHORIZED must be a boolean string (true/false), received: ${value}`
  );
}

function readTlsValue(
  name: 'CERT' | 'KEY' | 'CA' | 'PFX'
): string | Buffer | undefined {
  const inlineValue = process.env[`MTLS_${name}`];
  const pathValue = process.env[`MTLS_${name}_PATH`];

  if (pathValue) {
    if (!fs.existsSync(pathValue)) {
      throw new Error(
        `MTLS_${name}_PATH points to a file that does not exist: ${pathValue}`
      );
    }
    return fs.readFileSync(pathValue);
  }

  if (inlineValue !== undefined && inlineValue !== '') {
    return inlineValue;
  }

  return undefined;
}

function hasMtlsEnvConfigured(): boolean {
  return [
    process.env.MTLS_CERT,
    process.env.MTLS_CERT_PATH,
    process.env.MTLS_KEY,
    process.env.MTLS_KEY_PATH,
    process.env.MTLS_CA,
    process.env.MTLS_CA_PATH,
    process.env.MTLS_PFX,
    process.env.MTLS_PFX_PATH,
    process.env.MTLS_PASSPHRASE,
    process.env.MTLS_REJECT_UNAUTHORIZED,
  ].some((value) => value !== undefined && value !== '');
}

/**
 * Create TLS options from environment variables, if configured.
 *
 * Supports inline PEM content or file paths:
 * - `MTLS_CERT` / `MTLS_CERT_PATH`
 * - `MTLS_KEY` / `MTLS_KEY_PATH`
 * - `MTLS_CA` / `MTLS_CA_PATH` (optional)
 * - `MTLS_PFX` / `MTLS_PFX_PATH` (optional)
 * - `MTLS_PASSPHRASE` (optional)
 * - `MTLS_REJECT_UNAUTHORIZED` (optional boolean string)
 *
 * Path variables take precedence over inline values for the same field.
 * Requires either a cert/key pair or a PFX bundle.
 */
export function createTlsOptionsFromEnv(): CoinbaseTlsOptions | undefined {
  loadDotenv();

  if (!hasMtlsEnvConfigured()) {
    return undefined;
  }

  const cert = readTlsValue('CERT');
  const key = readTlsValue('KEY');
  const ca = readTlsValue('CA');
  const pfx = readTlsValue('PFX');
  const passphrase = process.env.MTLS_PASSPHRASE;
  const rejectUnauthorized = parseBooleanEnv(
    process.env.MTLS_REJECT_UNAUTHORIZED
  );

  const hasCertKeyPair = cert !== undefined && key !== undefined;
  const hasPfx = pfx !== undefined;

  if (!hasCertKeyPair && !hasPfx) {
    throw new Error(
      'mTLS environment variables are set but incomplete. Provide both MTLS_CERT/MTLS_CERT_PATH and MTLS_KEY/MTLS_KEY_PATH, or MTLS_PFX/MTLS_PFX_PATH.'
    );
  }

  const tls: CoinbaseTlsOptions = {};

  if (cert !== undefined) {
    tls.cert = cert;
  }
  if (key !== undefined) {
    tls.key = key;
  }
  if (ca !== undefined) {
    tls.ca = ca;
  }
  if (pfx !== undefined) {
    tls.pfx = pfx;
  }
  if (passphrase !== undefined && passphrase !== '') {
    tls.passphrase = passphrase;
  }
  if (rejectUnauthorized !== undefined) {
    tls.rejectUnauthorized = rejectUnauthorized;
  }

  return tls;
}

/**
 * Merge client options with TLS settings loaded from environment variables.
 * Explicit `tls` or `httpsAgent` values in `options` take precedence.
 */
export function mergeClientOptionsFromEnv(
  options?: CoinbasePrimeClientConfig
): CoinbasePrimeClientConfig | undefined {
  const tls = createTlsOptionsFromEnv();
  if (!tls) {
    return options;
  }

  if (options?.tls || options?.httpsAgent) {
    return options;
  }

  return {
    ...options,
    tls,
  };
}

/**
 * Shared utility function to create credentials from environment variables
 * Used by both CoinbasePrimeClient and CoinbasePrimeClientWithServices
 *
 * Automatically attempts to load .env file if dotenv is available.
 * If dotenv is not installed or .env file doesn't exist, falls back to
 * using environment variables set directly.
 *
 * @remarks For custom scenarios. Most users should use Client.fromEnv() instead.
 * @example
 * ```typescript
 * // Basic usage (recommended)
 * const client = CoinbasePrimeClient.fromEnv();
 *
 * // Advanced usage (custom scenarios)
 * const credentials = createCredentialsFromEnv();
 * const client = new CoinbasePrimeClient(credentials, 'custom-url');
 * ```
 */
export function createCredentialsFromEnv(): CoinbasePrimeCredentials {
  loadDotenv();

  const credsJson = process.env.PRIME_CREDENTIALS;
  if (!credsJson) {
    throw new Error(
      'PRIME_CREDENTIALS environment variable is required. ' +
        'Set it to a JSON string with AccessKey, SecretKey, and Passphrase. ' +
        'You can set it directly (export PRIME_CREDENTIALS=\'{"AccessKey":"...","SecretKey":"...","Passphrase":"..."}\') ' +
        'or create a .env file with PRIME_CREDENTIALS={"AccessKey":"...","SecretKey":"...","Passphrase":"..."}.'
    );
  }

  let creds;
  try {
    creds = JSON.parse(credsJson);
  } catch (error) {
    throw new Error(
      'PRIME_CREDENTIALS must be valid JSON with AccessKey, SecretKey, and Passphrase fields.'
    );
  }

  if (!creds.AccessKey || !creds.SecretKey || !creds.Passphrase) {
    throw new Error(
      'PRIME_CREDENTIALS must contain AccessKey, SecretKey, and Passphrase fields.'
    );
  }

  return new CoinbasePrimeCredentials(
    creds.AccessKey,
    creds.SecretKey,
    creds.Passphrase
  );
}
