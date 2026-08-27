/**
 * Copyright 2024-present Coinbase Global, Inc.
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
const prettier = require('prettier');

// Source and destination directories
const parentDir = './types';
const sourceDir = './types/model';
const destDir = './types/processed';
const destDirEnums = './types/processed/enums';
const destDirErrors = './types/processed/errors';
const destDirErrorEnums = './types/processed/errors/enums';
const indexPath = path.join(destDir, 'index.ts');
const enumIndexPath = path.join(destDirEnums, 'index.ts');
const errorIndexPath = path.join(destDirErrors, 'index.ts');
const errorEnumIndexPath = path.join(destDirErrorEnums, 'index.ts');
const finalModelDir = '../src/model';

const filePathReplacements = {
  coinbaseCustodyApiActivityType: 'CustodyActivityType',
  coinbasePublicRestApiActivityType: 'PrimeActivityType',
  CoinbasePublicRestApi: '',
  coinbasePublicRestApi: '',
  PrimeRESTAPI: '',
  primeRESTAPI: '',
  // primeBeta must come before Beta to avoid partial matches
  primeBeta: '',
  Beta: '',
  CoinbaseCustodyApi: '',
  coinbaseCustodyApi: '',
  rFQ: 'RFQ',
  CoinbaseBrokerageProxyEventsMaterializedApi: '',
  coinbaseBrokerageProxyEventsMaterializedApi: '',
  publicRestApi: '',
  PublicRestApi: '',
};

const skipFiles = [
  'changeOnchainAddressGroupRequestIsARequestToCreateOrUpdateANewOnchainAddressGroup.ts',
  'changeOnchainAddressGroupRequestIsARequestToCreateOrUpdateANewOnchainAddressGroup1.ts',
  'googleProtobufAny.ts',
  'googleRpcStatus.ts',
];

// Replace specific strings
const replacements = {
  '<any>': '',
  "\nimport { RequestFile } from './models';\n": '',
  'static discriminator: string | undefined = undefined;\n\n': '',
  coinbaseCustodyApiActivityType: 'CustodyActivityType',
  coinbasePublicRestApiActivityType: 'PrimeActivityType',
  CoinbasePublicRestApi: '',
  coinbasePublicRestApi: '',
  PrimeRESTAPI: '',
  primeRESTAPI: '',
  // PrimeBeta/primeBeta must come before Beta to avoid partial matches
  PrimeBeta: '',
  primeBeta: '',
  Beta: '',
  CoinbaseCustodyApi: '',
  coinbaseCustodyApi: '',
  CoinbaseBrokerageProxyEventsMaterializedApi: '',
  coinbaseBrokerageProxyEventsMaterializedApi: '',
  publicRestApi: '',
  PublicRestApi: '',
};

const classnameAsExceptions = ['CustodyActivityType', 'PrimeActivityType'];

function isEnumFile(content) {
  return /export\s+enum\s+\w+/.test(content);
}

function processedNameFromFile(file) {
  return replaceString(file, filePathReplacements).replace(/\.ts$/, '');
}

function isErrorModelName(name) {
  return (
    /ErrorResponse$/.test(name) ||
    /ErrorCode$/.test(name) ||
    /Subcode$/.test(name)
  );
}

const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'typescript',
};

// Ensure the destination directory exists
if (!fs.existsSync(parentDir)) {
  fs.mkdirSync(parentDir, { recursive: true });
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
} else {
  fs.rmSync(destDir, { recursive: true });
}

if (!fs.existsSync(destDirEnums)) {
  fs.mkdirSync(destDirEnums, { recursive: true });
}

if (!fs.existsSync(destDirErrors)) {
  fs.mkdirSync(destDirErrors, { recursive: true });
}

if (!fs.existsSync(destDirErrorEnums)) {
  fs.mkdirSync(destDirErrorEnums, { recursive: true });
}

// Function to replace specific strings
function replaceString(content, replacements) {
  let updatedContent = content;
  for (const [search, replace] of Object.entries(replacements)) {
    updatedContent = updatedContent.split(search).join(replace);
  }
  return updatedContent;
}

function cleanClasses(updatedContent) {
  updatedContent = updatedContent.replace(
    /export class (\w+) \{/g,
    (match, className) => {
      return `export type ${className} = {`;
    }
  );
  // Regular expression to match the function definition and body:
  // - Handles modifiers (async, public, private, etc.)
  // - Matches the function name and parameters
  // - Captures the entire function body, including the curly braces
  let functionName = 'attributeTypeMap';
  let regex = new RegExp(
    `\\s*(?:async|public|private|protected|static|\\s)*${functionName}\\s*(?:<.*?>)?\\s*\\(.*?\\)\\s*(?::\\s*[^=\\{]+)?\\s*\\{[\\s\\S]*?\\}|` + // Matches function definitions
      `\\s*static\\s+${functionName}\\s*:\\s*[^=]+=\\s*\\[[\\s\\S]*?\\];`,
    'g'
  );

  // Remove the function calls from the content
  updatedContent = updatedContent.replace(regex, '');

  functionName = 'getAttributeTypeMap';
  regex = new RegExp(
    `\\s*(?:async|public|private|protected|static|\\s)*${functionName}\\s*(?:<.*?>)?\\s*\\(.*?\\)\\s*(?::\\s*[^=\\{]+)?\\s*\\{[\\s\\S]*?\\}|` + // Matches function definitions
      `\\s*static\\s+${functionName}\\s*:\\s*[^=]+=\\s*\\[[\\s\\S]*?\\];`,
    'g'
  );

  // Remove the function calls from the content
  updatedContent = updatedContent.replace(regex, '');

  regex = /^\s*export\s+namespace\s+\w+\s*\{\s*\}/gm;

  // Remove lines containing namespace
  updatedContent = updatedContent.replace(regex, '');
  return updatedContent;
}

function getHeaderYear(destPath) {
  const relative = destPath.replace('types/processed/', '');
  const candidates = [
    path.join(finalModelDir, relative),
    path.join(finalModelDir, path.basename(destPath)),
    path.join(finalModelDir, 'enums', path.basename(destPath)),
  ];
  for (const finalPath of candidates) {
    if (fs.existsSync(finalPath)) {
      const existing = fs.readFileSync(finalPath, 'utf8');
      const match = existing.match(/Copyright (\d{4})-present/);
      if (match) return match[1];
    }
  }
  return new Date().getFullYear().toString();
}

function addGeneratedHeader(updatedContent, year) {
  const header = `/**
 * Copyright ${year}-present Coinbase Global, Inc.
 *
 * This file is generated by Openapi Generator https://github.com/openapitools/openapi-generator
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
 * 
 *  Do not edit the class manually.
 */
 `;
  return header + updatedContent;
}

function getIndexFileExport(destPath, updatedContent) {
  const isEnum =
    destPath.includes(`${path.sep}enums${path.sep}`) ||
    destPath.includes('/enums/');
  const baseName = path.basename(destPath, '.ts');
  let typeName = '';

  if (isEnum) {
    const typeMatch = updatedContent.match(/export\s+enum\s+(\w+)\s*/);
    if (!typeMatch) throw new Error(`No enum name found in file: ${baseName}`);

    // handle export with as syntax for namespace collisions
    if (classnameAsExceptions.includes(baseName)) {
      typeName = `${typeMatch[1]} as ${baseName}`;
    } else {
      typeName = typeMatch[1];
    }

    return `export { ${typeName} } from './${baseName}';`;
  } else {
    const typeMatch = updatedContent.match(/export\s+type\s+(\w+)\s*=/);
    if (!typeMatch)
      throw new Error(
        `No type name found in file: ${baseName} destPath: ${destPath}`
      );

    typeName = typeMatch[1];
    return `export type { ${typeName} } from './${baseName}';`;
  }
}

function resolveImport(fromKind, importPath, errorNames, enumNames) {
  const isEnum = enumNames.has(importPath);
  const isError = errorNames.has(importPath);

  if (fromKind === 'error') {
    if (isEnum && isError) return `./enums/${importPath}`;
    if (isEnum) return `../enums/${importPath}`;
    if (isError) return `./${importPath}`;
    return `../${importPath}`;
  }
  if (fromKind === 'errorEnum') {
    if (isEnum && isError) return `./${importPath}`;
    if (isEnum) return `../../enums/${importPath}`;
    if (isError) return `../${importPath}`;
    return `../../${importPath}`;
  }
  if (fromKind === 'enum') {
    if (isEnum && isError) return `../errors/enums/${importPath}`;
    if (isEnum) return `./${importPath}`;
    if (isError) return `../errors/${importPath}`;
    return `../${importPath}`;
  }
  if (isEnum && isError) return `./errors/enums/${importPath}`;
  if (isEnum) return `./enums/${importPath}`;
  if (isError) return `./errors/${importPath}`;
  return `./${importPath}`;
}

function kindForFile(isEnum, isError) {
  if (isError && isEnum) return 'errorEnum';
  if (isError) return 'error';
  if (isEnum) return 'enum';
  return 'model';
}

function destPathForFile(file, isEnum, isError) {
  if (isError && isEnum) {
    return replaceString(
      path.join(destDirErrorEnums, file),
      filePathReplacements
    );
  }
  if (isError) {
    return replaceString(path.join(destDirErrors, file), filePathReplacements);
  }
  if (isEnum) {
    return replaceString(path.join(destDirEnums, file), filePathReplacements);
  }
  return replaceString(path.join(destDir, file), filePathReplacements);
}

// Main function to process files
async function processFiles() {
  const files = fs.readdirSync(sourceDir);
  const indexFileContent = [];
  const enumIndexFileContent = [];
  const errorIndexFileContent = [];
  const errorEnumIndexFileContent = [];

  const enumNames = new Set();
  const errorNames = new Set();

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    if (!fs.statSync(sourcePath).isFile() || skipFiles.includes(file)) {
      continue;
    }
    const content = fs.readFileSync(sourcePath, 'utf8');
    const name = processedNameFromFile(file);
    if (isEnumFile(content)) {
      enumNames.add(name);
      console.log('processed enum', name);
    }
    if (isErrorModelName(name)) {
      errorNames.add(name);
    }
  }

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);

    if (skipFiles.includes(file)) {
      console.log('skipping file', file);
      continue;
    }

    if (!fs.statSync(sourcePath).isFile()) {
      continue;
    }

    const content = fs.readFileSync(sourcePath, 'utf8');
    const isEnum = isEnumFile(content);
    const name = processedNameFromFile(file);
    const isError = errorNames.has(name);
    const fromKind = kindForFile(isEnum, isError);
    const destPath = destPathForFile(file, isEnum, isError);

    let updatedContent = replaceString(content, replacements);

    if (updatedContent.indexOf('class') > 0) {
      updatedContent = cleanClasses(updatedContent);
    }

    updatedContent = updatedContent.replace(/\/\*[\s\S]*?\*\//, '');

    updatedContent = updatedContent.replace(
      /import\s+\{[^}]+\}\s+from\s+'\.\/(.*?)';/g,
      (match, importPath) => {
        const imported = match.split('{')[1].split('}')[0].trim();
        const resolved = resolveImport(
          fromKind,
          importPath,
          errorNames,
          enumNames
        );
        return `import { ${imported} } from '${resolved}';`;
      }
    );

    if (isError && isEnum) {
      errorEnumIndexFileContent.push(
        getIndexFileExport(destPath, updatedContent)
      );
    } else if (isError) {
      errorIndexFileContent.push(getIndexFileExport(destPath, updatedContent));
    } else if (isEnum) {
      enumIndexFileContent.push(getIndexFileExport(destPath, updatedContent));
    } else {
      indexFileContent.push(getIndexFileExport(destPath, updatedContent));
    }

    updatedContent = addGeneratedHeader(
      updatedContent,
      getHeaderYear(destPath)
    );
    updatedContent = await prettier.format(updatedContent, prettierConfig);

    if (fs.existsSync(destPath)) {
      console.log('file already exists: ', destPath);
    }

    fs.writeFileSync(destPath, updatedContent, 'utf8');
    console.log(`Processed: ${file} at ${destPath}`);
  }

  fs.writeFileSync(indexPath, [...new Set(indexFileContent)].join('\n') + '\n');
  fs.writeFileSync(
    enumIndexPath,
    [...new Set(enumIndexFileContent)].join('\n') + '\n'
  );
  fs.writeFileSync(
    errorIndexPath,
    [...new Set(errorIndexFileContent)].join('\n') + '\n'
  );
  fs.writeFileSync(
    errorEnumIndexPath,
    [...new Set(errorEnumIndexFileContent)].join('\n') + '\n'
  );

  console.log('All files processed.');
}

// Execute the script
processFiles().then(() => {
  console.log('Processing complete.');
});
