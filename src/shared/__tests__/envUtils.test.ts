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
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  createTlsOptionsFromEnv,
  mergeClientOptionsFromEnv,
} from '../envUtils';

describe('createTlsOptionsFromEnv', () => {
  const originalEnv = process.env;
  let tempDir: string;

  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prime-mtls-'));
  });

  afterEach(() => {
    process.env = originalEnv;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  function writeTempFile(name: string, contents: string): string {
    const filePath = path.join(tempDir, name);
    fs.writeFileSync(filePath, contents);
    return filePath;
  }

  it('returns undefined when no mTLS environment variables are set', () => {
    delete process.env.MTLS_CERT;
    delete process.env.MTLS_CERT_PATH;
    delete process.env.MTLS_KEY;
    delete process.env.MTLS_KEY_PATH;

    expect(createTlsOptionsFromEnv()).toBeUndefined();
  });

  it('loads cert and key from file paths', () => {
    process.env.MTLS_CERT_PATH = writeTempFile('client.crt', 'cert-pem');
    process.env.MTLS_KEY_PATH = writeTempFile('client.key', 'key-pem');
    process.env.MTLS_CA_PATH = writeTempFile('ca.crt', 'ca-pem');

    expect(createTlsOptionsFromEnv()).toEqual({
      cert: Buffer.from('cert-pem'),
      key: Buffer.from('key-pem'),
      ca: Buffer.from('ca-pem'),
    });
  });

  it('loads inline PEM content', () => {
    process.env.MTLS_CERT = 'inline-cert';
    process.env.MTLS_KEY = 'inline-key';

    expect(createTlsOptionsFromEnv()).toEqual({
      cert: 'inline-cert',
      key: 'inline-key',
    });
  });

  it('prefers file paths over inline values', () => {
    process.env.MTLS_CERT = 'inline-cert';
    process.env.MTLS_CERT_PATH = writeTempFile('client.crt', 'file-cert');
    process.env.MTLS_KEY = 'inline-key';
    process.env.MTLS_KEY_PATH = writeTempFile('client.key', 'file-key');

    expect(createTlsOptionsFromEnv()).toEqual({
      cert: Buffer.from('file-cert'),
      key: Buffer.from('file-key'),
    });
  });

  it('throws when mTLS env is incomplete', () => {
    process.env.MTLS_CERT_PATH = writeTempFile('client.crt', 'cert-pem');

    expect(() => createTlsOptionsFromEnv()).toThrow(
      'mTLS environment variables are set but incomplete'
    );
  });
});

describe('mergeClientOptionsFromEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('merges tls from environment when options are omitted', () => {
    process.env.MTLS_CERT = 'inline-cert';
    process.env.MTLS_KEY = 'inline-key';

    expect(mergeClientOptionsFromEnv()).toEqual({
      tls: {
        cert: 'inline-cert',
        key: 'inline-key',
      },
    });
  });

  it('keeps explicit tls options over environment values', () => {
    process.env.MTLS_CERT = 'env-cert';
    process.env.MTLS_KEY = 'env-key';

    const options = {
      tls: {
        cert: 'explicit-cert',
        key: 'explicit-key',
      },
    };

    expect(mergeClientOptionsFromEnv(options)).toBe(options);
  });
});
