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

  for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }

    for (const [verb, operation] of Object.entries(pathItem)) {
      if (!HTTP_VERBS.has(verb) || !operation) {
        continue;
      }

      const key = `${verb.toUpperCase()} ${normalizePath(pathKey)}`;
      operationMap.set(key, {
        summary: operation.summary || '',
        description: operation.description || '',
      });
    }
  }

  return operationMap;
}

function escapeForTsDoc(text) {
  return text.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
}

function buildTsDoc(summary, description) {
  const lines = ['  /**'];

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

  lines.push('   */');
  return lines.join('\n');
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
    const urlMatch = requestBlock.match(/url:\s*`([^`]+)`/);
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

function injectDocsIntoInterface(interfaceBlock, methodDocs) {
  let updated = interfaceBlock;

  for (const [methodName, tsdoc] of methodDocs) {
    const escapedMethodName = escapeRegex(methodName);
    const withDocPattern = new RegExp(
      `(\\n)  /\\*\\*(?:\\s*\\n   \\*[^\\n]*)*\\s*\\n   \\*/\\s*\\n(  ${escapedMethodName}\\s*\\()`,
      'm'
    );
    const withoutDocPattern = new RegExp(
      `(\\n)(  ${escapedMethodName}\\s*\\()`,
      'm'
    );

    if (withDocPattern.test(updated)) {
      updated = updated.replace(withDocPattern, `\n${tsdoc}\n$2`);
      continue;
    }

    updated = updated.replace(withoutDocPattern, `\n${tsdoc}\n$2`);
  }

  return updated;
}

async function processServiceFile(filePath, operationMap) {
  const content = fs.readFileSync(filePath, 'utf8');
  const interfaceInfo = extractInterfaceBlock(content);

  if (!interfaceInfo) {
    return { documented: 0, unmatched: [] };
  }

  const methodEndpoints = extractMethodEndpoints(content);
  const methodDocs = new Map();
  const unmatched = [];

  for (const [methodName, endpoint] of methodEndpoints) {
    const key = `${endpoint.verb} ${endpoint.path}`;
    const operation = operationMap.get(key);

    if (!operation || (!operation.summary && !operation.description)) {
      unmatched.push({ methodName, key });
      continue;
    }

    methodDocs.set(methodName, buildTsDoc(operation.summary, operation.description));
  }

  if (methodDocs.size === 0) {
    return { documented: 0, unmatched };
  }

  const updatedInterface = injectDocsIntoInterface(
    interfaceInfo.block,
    methodDocs
  );
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
  const operationMap = buildOperationMap(spec);

  const serviceDirs = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP_SERVICE_DIRS.has(entry.name))
    .map((entry) => entry.name);

  let totalDocumented = 0;
  const allUnmatched = [];

  for (const serviceDir of serviceDirs) {
    const indexPath = path.join(srcDir, serviceDir, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      continue;
    }

    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes('export interface I') || !content.includes('Service {')) {
      continue;
    }

    const { documented, unmatched } = await processServiceFile(
      indexPath,
      operationMap
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
      console.warn(`  ${path.relative(process.cwd(), item.file)}.${item.methodName} -> ${item.key}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
