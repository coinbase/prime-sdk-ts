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
const descriptionOverrides = require('./descriptionOverrides');

const sourceSpecPath = path.join(__dirname, 'prime-public-api-spec.yaml');
const augmentedSpecPath = path.join(
  __dirname,
  '.prime-public-api-spec.augmented.yaml'
);

const HTTP_VERBS = new Set(['get', 'post', 'put', 'delete', 'patch']);

const PLACEHOLDER_TITLE_PATTERN = /^\s*next:\s*\d+\s*$/i;

const SCHEMA_CHILD_KEYS = new Set([
  'properties',
  'items',
  'allOf',
  'anyOf',
  'oneOf',
  'additionalProperties',
]);

function isPromotableTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  if (title.trim().length === 0) {
    return false;
  }

  return !PLACEHOLDER_TITLE_PATTERN.test(title);
}

function resolveRef(spec, ref) {
  if (!ref || typeof ref !== 'string' || !ref.startsWith('#/')) {
    return null;
  }

  const parts = ref.slice(2).split('/');
  let node = spec;

  for (const part of parts) {
    if (!node || typeof node !== 'object') {
      return null;
    }
    node = node[part];
  }

  return node && typeof node === 'object' ? node : null;
}

function getSchemaDocText(schema) {
  if (!schema || typeof schema !== 'object') {
    return null;
  }

  if (schema.title && isPromotableTitle(schema.title)) {
    return schema.title;
  }

  if (typeof schema.description === 'string' && schema.description.trim().length > 0) {
    return schema.description;
  }

  return null;
}

function getOverride(context, propertyName) {
  if (!context) {
    return undefined;
  }

  if (context.type === 'operation') {
    return descriptionOverrides.byOperation[context.id]?.[propertyName];
  }

  if (context.type === 'schema') {
    return descriptionOverrides.bySchema[context.id]?.[propertyName];
  }

  return undefined;
}

function normalizeRefWithDescription(property) {
  if (!property?.$ref || !property.description) {
    return;
  }

  const ref = property.$ref;
  delete property.$ref;
  property.allOf = [{ $ref: ref }];
}

function setPropertyDescription(property, description, stats, statKey) {
  property.description = description;
  normalizeRefWithDescription(property);
  stats[statKey]++;
}

function processProperty(property, propertyName, context, spec, stats) {
  if (!property || typeof property !== 'object') {
    return;
  }

  if (
    property.title &&
    !property.description &&
    isPromotableTitle(property.title)
  ) {
    setPropertyDescription(property, property.title, stats, 'titles');
  }

  if (!property.description && property.$ref) {
    const targetSchema = resolveRef(spec, property.$ref);
    const docText = getSchemaDocText(targetSchema);

    if (docText) {
      setPropertyDescription(property, docText, stats, 'refs');
    }
  }

  if (!property.description) {
    const override = getOverride(context, propertyName);

    if (override) {
      setPropertyDescription(property, override, stats, 'overrides');
    }
  }
}

function walkSchemaNode(node, context, spec, stats) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      walkSchemaNode(item, context, spec, stats);
    }
    return;
  }

  if (node.properties && typeof node.properties === 'object') {
    for (const [propertyName, property] of Object.entries(node.properties)) {
      processProperty(property, propertyName, context, spec, stats);
      walkSchemaNode(property, context, spec, stats);
    }
  }

  if (node.items) {
    walkSchemaNode(node.items, context, spec, stats);
  }

  for (const combinator of ['allOf', 'anyOf', 'oneOf']) {
    if (Array.isArray(node[combinator])) {
      for (const subSchema of node[combinator]) {
        walkSchemaNode(subSchema, context, spec, stats);
      }
    }
  }

  if (
    node.additionalProperties &&
    typeof node.additionalProperties === 'object'
  ) {
    walkSchemaNode(node.additionalProperties, context, spec, stats);
  }

  for (const [key, value] of Object.entries(node)) {
    if (SCHEMA_CHILD_KEYS.has(key)) {
      continue;
    }

    walkSchemaNode(value, context, spec, stats);
  }
}

function walkPaths(paths, spec, stats) {
  for (const pathItem of Object.values(paths || {})) {
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }

    for (const [verb, operation] of Object.entries(pathItem)) {
      if (!HTTP_VERBS.has(verb) || !operation) {
        continue;
      }

      const context = operation.operationId
        ? { type: 'operation', id: operation.operationId }
        : null;

      walkSchemaNode(operation, context, spec, stats);
    }
  }
}

function walkComponents(components, spec, stats) {
  for (const [schemaName, schema] of Object.entries(components?.schemas || {})) {
    const context = { type: 'schema', id: schemaName };
    walkSchemaNode(schema, context, spec, stats);
  }
}

function augmentSpec(spec) {
  const stats = { titles: 0, refs: 0, overrides: 0 };

  walkPaths(spec.paths, spec, stats);
  walkComponents(spec.components, spec, stats);

  return stats;
}

function main() {
  const spec = yaml.load(fs.readFileSync(sourceSpecPath, 'utf8'));
  const stats = augmentSpec(spec);

  fs.writeFileSync(augmentedSpecPath, yaml.dump(spec), 'utf8');

  console.log(
    `Augmented spec written to ${augmentedSpecPath}: ` +
      `${stats.titles} title(s) promoted, ` +
      `${stats.refs} $ref description(s) added, ` +
      `${stats.overrides} override(s) applied`
  );
}

main();
