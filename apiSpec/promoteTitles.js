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
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const sourceSpecPath = path.join(__dirname, 'prime-public-api-spec.yaml');
const augmentedSpecPath = path.join(
  __dirname,
  '.prime-public-api-spec.augmented.yaml'
);

function promotePropertyTitles(schemas) {
  if (!schemas) {
    return 0;
  }

  let promoted = 0;

  for (const schema of Object.values(schemas)) {
    if (!schema || typeof schema !== 'object' || !schema.properties) {
      continue;
    }

    for (const property of Object.values(schema.properties)) {
      if (
        property &&
        typeof property === 'object' &&
        property.title &&
        !property.description
      ) {
        property.description = property.title;
        promoted++;
      }
    }
  }

  return promoted;
}

function main() {
  const spec = yaml.load(fs.readFileSync(sourceSpecPath, 'utf8'));
  const promoted = promotePropertyTitles(spec.components?.schemas);

  fs.writeFileSync(augmentedSpecPath, yaml.dump(spec), 'utf8');

  console.log(
    `Promoted ${promoted} property title(s) to description in ${augmentedSpecPath}`
  );
}

main();
