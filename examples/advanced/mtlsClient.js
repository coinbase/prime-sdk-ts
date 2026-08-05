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
require('dotenv').config();
const { CoinbasePrimeClientWithServices } = require('../../dist');

// Configure mTLS via environment variables:
//   MTLS_CERT_PATH=/path/to/client.crt
//   MTLS_KEY_PATH=/path/to/client.key
//   MTLS_CA_PATH=/path/to/ca.crt   (optional)
const client = CoinbasePrimeClientWithServices.fromEnv();

client.portfolios
  .listPortfolios()
  .then((response) => {
    console.log('Portfolios:', JSON.stringify(response, null, 2));
  })
  .catch((error) => {
    console.error('Request failed:', error.message);
    process.exit(1);
  });
