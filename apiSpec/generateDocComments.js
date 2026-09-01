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
const prettier = require('prettier');
const methodDocOverrides = require('./methodDocOverrides');

const specPath = path.join(__dirname, 'prime-public-api-spec.yaml');
const srcDir = path.join(__dirname, '..', 'src');

const HTTP_VERBS = new Set(['get', 'post', 'put', 'delete', 'patch']);

const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'typescript',
};

const SKIP_SERVICE_DIRS = new Set([
  'clients',
  'credentials',
  'errors',
  'model',
  'shared',
]);

function normalizePath(pathValue) {
  return pathValue
    .replace(/^\.\.\//, '')
    .replace(/^(?:\/v\d+\/|v\d+\/)/, '')
    .replace(/\$\{[^}]+\}/g, '{}')
    .replace(/\{[^}]+\}/g, '{}');
}

function buildOperationMap(spec) {
  const operationMap = new Map();
  const operationById = new Map();

  for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }

    for (const [verb, operation] of Object.entries(pathItem)) {
      if (!HTTP_VERBS.has(verb) || !operation) {
        continue;
      }

      const key = `${verb.toUpperCase()} ${normalizePath(pathKey)}`;
      const entry = {
        summary: operation.summary || '',
        description: operation.description || '',
      };

      operationMap.set(key, entry);

      if (operation.operationId) {
        operationById.set(operation.operationId, entry);
      }
    }
  }

  return { operationMap, operationById };
}

function escapeForTsDoc(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}');
}

function buildTsDoc(summary, description, options = {}) {
  const lines = ['  /**'];

  if (options.deprecated) {
    lines.push(`   * @deprecated ${options.deprecated}`);
    if (summary || description) {
      lines.push('   *');
    }
  }

  if (summary) {
    lines.push(`   * ${escapeForTsDoc(summary)}`);
  }

  if (description) {
    if (summary) {
      lines.push('   *');
    }

    for (const line of description.split('\n')) {
      const trimmed = line.trimEnd();
      lines.push(
        trimmed.length > 0 ? `   * ${escapeForTsDoc(trimmed)}` : '   *'
      );
    }
  }

  if (options.throwsType) {
    lines.push('   *');
    lines.push(
      `   * @throws CoinbasePrimeException HTTP error. Typed body: {@link ${options.throwsType}}.`
    );
  }

  lines.push('   */');
  return lines.join('\n');
}

function methodErrorTypeName(methodName) {
  return `${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}Error`;
}

function loadGeneratedMethodErrorTypes() {
  const file = path.join(srcDir, 'model/errors/methodErrors.ts');
  if (!fs.existsSync(file)) {
    return new Set();
  }
  const content = fs.readFileSync(file, 'utf8');
  return new Set(
    [...content.matchAll(/export type (\w+Error)\s*=/g)].map(
      (match) => match[1]
    )
  );
}

function extractInterfaceBlock(content) {
  const match = content.match(/export interface I\w+Service \{/);
  if (!match || match.index === undefined) {
    return null;
  }

  const start = match.index;
  let depth = 0;

  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') {
      depth++;
    }
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        return {
          start,
          end: i + 1,
          block: content.slice(start, i + 1),
        };
      }
    }
  }

  return null;
}

function extractMethodEndpoints(content) {
  const endpoints = new Map();
  const classMatch = content.match(/export class \w+ implements/);
  if (!classMatch || classMatch.index === undefined) {
    return endpoints;
  }

  const classContent = content.slice(classMatch.index);
  const methodRegex = /async\s+(\w+)\s*\([^)]*\)[^{]*\{/g;
  let match;

  while ((match = methodRegex.exec(classContent)) !== null) {
    const methodName = match[1];
    const methodBody = classContent.slice(
      match.index,
      match.index + Math.min(classContent.length - match.index, 4000)
    );
    const requestBlockMatch = methodBody.match(
      /this\.client\.request\(\{([\s\S]*?)\}\);/
    );
    if (!requestBlockMatch) {
      continue;
    }

    const requestBlock = requestBlockMatch[1];
    const urlMatch = requestBlock.match(/url:\s*[`'"]([^`'"]+)[`'"]/);
    if (!urlMatch) {
      continue;
    }

    const methodVerbMatch = requestBlock.match(/method:\s*Method\.(\w+)/);
    const verb = methodVerbMatch ? methodVerbMatch[1].toUpperCase() : 'GET';
    const normalizedPath = normalizePath(urlMatch[1]);
    endpoints.set(methodName, { verb, path: normalizedPath });
  }

  return endpoints;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countInterfaceMethods(interfaceBlock) {
  return (interfaceBlock.match(/:\s*Promise</g) || []).length;
}

function findPrecedingJsDoc(beforeMethod) {
  const matches = [...beforeMethod.matchAll(/\n  \/\*\*[\s\S]*?\*\/\s*/g)];

  if (matches.length === 0) {
    return null;
  }

  return matches[matches.length - 1];
}

function injectDocForMethod(interfaceBlock, methodName, tsdoc) {
  const methodPattern = new RegExp(
    `(  ${escapeRegex(methodName)}\\s*\\()`,
    'm'
  );
  const match = methodPattern.exec(interfaceBlock);

  if (!match || match.index === undefined) {
    return interfaceBlock;
  }

  const methodStart = match.index;
  const beforeMethod = interfaceBlock.slice(0, methodStart);
  const afterMethod = interfaceBlock.slice(methodStart);
  const docMatch = findPrecedingJsDoc(beforeMethod);

  if (docMatch && docMatch.index !== undefined) {
    const beforeDoc = beforeMethod.slice(0, docMatch.index);
    return `${beforeDoc}\n${tsdoc}\n${afterMethod}`;
  }

  return `${beforeMethod}${tsdoc}\n${afterMethod}`;
}

function injectDocsIntoInterface(interfaceBlock, methodDocs) {
  let updated = interfaceBlock;

  for (const [methodName, tsdoc] of methodDocs) {
    updated = injectDocForMethod(updated, methodName, tsdoc);
  }

  return updated;
}

function getFileOverrides(filePath) {
  const relativePath = path.relative(srcDir, filePath).replace(/\\/g, '/');
  return methodDocOverrides.byFile[relativePath] || {};
}

function applyMethodOverrides(
  methodDocs,
  fileOverrides,
  operationById,
  generatedErrorTypes
) {
  for (const [methodName, override] of Object.entries(fileOverrides)) {
    const operation = operationById.get(override.operationId);

    if (!operation || (!operation.summary && !operation.description)) {
      console.warn(
        `Method doc override for ${methodName} references unknown operationId: ${override.operationId}`
      );
      continue;
    }

    const throwsType = methodErrorTypeName(methodName);
    methodDocs.set(
      methodName,
      buildTsDoc(operation.summary, operation.description, {
        deprecated: override.deprecated,
        throwsType: generatedErrorTypes.has(throwsType)
          ? throwsType
          : undefined,
      })
    );
  }
}

async function processServiceFile(
  filePath,
  operationMap,
  operationById,
  generatedErrorTypes
) {
  const content = fs.readFileSync(filePath, 'utf8');
  const interfaceInfo = extractInterfaceBlock(content);

  if (!interfaceInfo) {
    return { documented: 0, unmatched: [] };
  }

  const methodEndpoints = extractMethodEndpoints(content);
  const methodDocs = new Map();
  const unmatched = [];
  const fileOverrides = getFileOverrides(filePath);
  const overriddenMethods = new Set(Object.keys(fileOverrides));

  for (const [methodName, endpoint] of methodEndpoints) {
    if (overriddenMethods.has(methodName)) {
      continue;
    }

    const key = `${endpoint.verb} ${endpoint.path}`;
    const operation = operationMap.get(key);

    if (!operation || (!operation.summary && !operation.description)) {
      unmatched.push({ methodName, key });
      continue;
    }

    const throwsType = methodErrorTypeName(methodName);
    methodDocs.set(
      methodName,
      buildTsDoc(operation.summary, operation.description, {
        methodName,
        throwsType: generatedErrorTypes.has(throwsType)
          ? throwsType
          : undefined,
      })
    );
  }

  applyMethodOverrides(
    methodDocs,
    fileOverrides,
    operationById,
    generatedErrorTypes
  );

  if (methodDocs.size === 0) {
    return { documented: 0, unmatched };
  }

  const updatedInterface = injectDocsIntoInterface(
    interfaceInfo.block,
    methodDocs
  );
  const beforeCount = countInterfaceMethods(interfaceInfo.block);
  const afterCount = countInterfaceMethods(updatedInterface);

  if (afterCount < beforeCount) {
    console.error(
      `Refusing to update ${filePath}: interface method count dropped from ${beforeCount} to ${afterCount}`
    );
    return { documented: 0, unmatched, skipped: true };
  }

  const updatedContent =
    content.slice(0, interfaceInfo.start) +
    updatedInterface +
    content.slice(interfaceInfo.end);

  const formatted = await prettier.format(updatedContent, prettierConfig);
  fs.writeFileSync(filePath, formatted, 'utf8');

  return { documented: methodDocs.size, unmatched };
}

async function main() {
  const spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
  const generatedErrorTypes = loadGeneratedMethodErrorTypes();
  const { operationMap, operationById } = buildOperationMap(spec);

  const serviceDirs = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && !SKIP_SERVICE_DIRS.has(entry.name)
    )
    .map((entry) => entry.name);

  let totalDocumented = 0;
  const allUnmatched = [];

  for (const serviceDir of serviceDirs) {
    const indexPath = path.join(srcDir, serviceDir, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      continue;
    }

    const content = fs.readFileSync(indexPath, 'utf8');
    if (
      !content.includes('export interface I') ||
      !content.includes('Service {')
    ) {
      continue;
    }

    const { documented, unmatched } = await processServiceFile(
      indexPath,
      operationMap,
      operationById,
      generatedErrorTypes
    );
    totalDocumented += documented;

    for (const item of unmatched) {
      allUnmatched.push({ file: indexPath, ...item });
    }

    if (documented > 0) {
      console.log(`Documented ${documented} method(s) in ${indexPath}`);
    }
  }

  console.log(`Total methods documented: ${totalDocumented}`);

  if (allUnmatched.length > 0) {
    console.warn('Unmatched methods (no spec operation found):');
    for (const item of allUnmatched) {
      console.warn(
        `  ${path.relative(process.cwd(), item.file)}.${item.methodName} -> ${item.key}`
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
