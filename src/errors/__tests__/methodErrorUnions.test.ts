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
import path from 'path';

const methodErrorsPath = path.join(
  __dirname,
  '../../model/errors/methodErrors.ts'
);

const COMMON_ERROR_SCHEMAS = [
  'InternalServerErrorResponse',
  'ServiceUnavailableErrorResponse',
  'TooManyRequestsErrorResponse',
  'UnauthorizedErrorResponse',
];

function parseUnions(source: string): Array<{ name: string; body: string }> {
  return source
    .split(/export type /)
    .slice(1)
    .flatMap((block) => {
      const match = block.match(/^(\w+Error) =\n([\s\S]*?);/);
      return match ? [{ name: match[1], body: match[2] }] : [];
    });
}

describe('method error unions', () => {
  const source = fs.readFileSync(methodErrorsPath, 'utf8');
  const unions = parseUnions(source);

  it('parses generated per-method unions', () => {
    expect(unions.length).toBeGreaterThan(50);
  });

  it.each(COMMON_ERROR_SCHEMAS)(
    'includes %s on every per-method union',
    (schema) => {
      const missing = unions
        .filter(({ body }) => !body.includes(schema))
        .map(({ name }) => name);
      expect(missing).toEqual([]);
    }
  );
});
