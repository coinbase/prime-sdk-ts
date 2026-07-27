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

/**
 * Advanced Example: Call a custom API path with signing
 *
 * Use client.request() to hit endpoints that are not yet wrapped by a service.
 * The client handles Prime auth signing for any path under the configured base URL.
 *
 * Usage:
 *   node examples/advanced/customRequest.js [method] [path] [bodyJson]
 *
 * Examples:
 *   node examples/advanced/customRequest.js
 *   node examples/advanced/customRequest.js GET portfolios/{portfolio_id}/webhooks/subscriptions
 *   node examples/advanced/customRequest.js POST portfolios/{portfolio_id}/webhooks/subscriptions '{"url":"https://example.com/webhook"}'
 *
 * Environment:
 *   PRIME_CREDENTIALS - required JSON credentials
 *   PORTFOLIO_ID      - required; substituted into {portfolio_id} in the path
 */

const { CoinbasePrimeClientWithServices, Method } = require('../../dist');

const client = CoinbasePrimeClientWithServices.fromEnv();
const portfolioId = process.env.PORTFOLIO_ID;

const methodArg = (process.argv[2] || 'GET').toUpperCase();
const pathArg =
  process.argv[3] || `portfolios/{portfolio_id}/webhooks/subscriptions`;
const bodyJsonArg = process.argv[4];

if (!portfolioId) {
  console.error('Error: PORTFOLIO_ID environment variable is required');
  process.exit(1);
}

if (!Object.values(Method).includes(methodArg)) {
  console.error(
    `Error: Unsupported HTTP method "${methodArg}". Use one of: ${Object.values(Method).join(', ')}`
  );
  process.exit(1);
}

function resolvePath(pathTemplate) {
  return pathTemplate.replaceAll('{portfolio_id}', portfolioId);
}

function parseBody(bodyJson) {
  if (!bodyJson) {
    return undefined;
  }

  try {
    return JSON.parse(bodyJson);
  } catch (error) {
    console.error('Error: bodyJson must be valid JSON');
    process.exit(1);
  }
}

async function customRequestExample() {
  const url = resolvePath(pathArg);
  const bodyParams = parseBody(bodyJsonArg);

  console.log(`Calling ${methodArg} ${client.apiBasePath}${url}`);
  if (bodyParams) {
    console.log('Request body:', bodyParams);
  }

  try {
    const response = await client.request({
      method: methodArg,
      url,
      bodyParams,
      callOptions: {
        transformRequest: (req) => {
          // Log auth headers once. callOptions.transformRequest is registered
          // twice by the HTTP client (setup + replay), so guard with a flag.
          if (req.__loggedAuthHeaders) {
            return req;
          }
          req.__loggedAuthHeaders = true;

          const headers =
            typeof req.headers?.toJSON === 'function'
              ? req.headers.toJSON()
              : req.headers;

          console.log('Signed request headers:', {
            'X-CB-ACCESS-KEY': headers['X-CB-ACCESS-KEY'],
            'X-CB-ACCESS-TIMESTAMP': headers['X-CB-ACCESS-TIMESTAMP'],
            'X-CB-ACCESS-PASSPHRASE': '[redacted]',
            'X-CB-ACCESS-SIGNATURE': '[redacted]',
          });
          return req;
        },
      },
    });

    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error('Request failed:', error);
  }
}

customRequestExample();
