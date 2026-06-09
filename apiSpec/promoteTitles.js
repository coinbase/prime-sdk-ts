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

const PLACEHOLDER_TITLE_PATTERN = /^\s*next:\s*\d+\s*$/i;

function isPromotableTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  if (title.trim().length === 0) {
    return false;
  }

  return !PLACEHOLDER_TITLE_PATTERN.test(title);
}

const SCHEMA_CHILD_KEYS = new Set([
  'properties',
  'items',
  'allOf',
  'anyOf',
  'oneOf',
  'additionalProperties',
]);

function walkSchemaNode(node, promoted) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      walkSchemaNode(item, promoted);
    }
    return;
  }

  if (node.properties && typeof node.properties === 'object') {
    for (const property of Object.values(node.properties)) {
      if (
        property &&
        typeof property === 'object' &&
        property.title &&
        !property.description &&
        isPromotableTitle(property.title)
      ) {
        property.description = property.title;
        promoted.count++;
      }

      walkSchemaNode(property, promoted);
    }
  }

  if (node.items) {
    walkSchemaNode(node.items, promoted);
  }

  for (const combinator of ['allOf', 'anyOf', 'oneOf']) {
    if (Array.isArray(node[combinator])) {
      for (const subSchema of node[combinator]) {
        walkSchemaNode(subSchema, promoted);
      }
    }
  }

  if (
    node.additionalProperties &&
    typeof node.additionalProperties === 'object'
  ) {
    walkSchemaNode(node.additionalProperties, promoted);
  }

  for (const [key, value] of Object.entries(node)) {
    if (SCHEMA_CHILD_KEYS.has(key)) {
      continue;
    }

    walkSchemaNode(value, promoted);
  }
}

function promotePropertyTitles(spec) {
  const promoted = { count: 0 };

  walkSchemaNode(spec.paths, promoted);
  walkSchemaNode(spec.components, promoted);

  return promoted.count;
}

function main() {
  const spec = yaml.load(fs.readFileSync(sourceSpecPath, 'utf8'));
  const promoted = promotePropertyTitles(spec);

  fs.writeFileSync(augmentedSpecPath, yaml.dump(spec), 'utf8');

  console.log(
    `Promoted ${promoted} property title(s) to description in ${augmentedSpecPath}`
  );
}

main();
