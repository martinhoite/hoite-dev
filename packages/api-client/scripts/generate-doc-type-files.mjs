import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const openApiPath = path.resolve(process.cwd(), 'openapi/umbraco-delivery.openapi.json');
const seedPath = path.resolve(process.cwd(), 'openapi/doc-types.seed.json');
const configPath = path.resolve(process.cwd(), 'openapi/public-api.config.json');
const generatedDir = path.resolve(process.cwd(), 'src/generated');

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const schemaDocTypes = (schema) => {
  if (!schema || typeof schema !== 'object') {
    return [];
  }

  const aliases = new Set();
  const vendorAlias = schema['x-umbraco-document-type-alias'];

  if (typeof vendorAlias === 'string' && vendorAlias.length > 0) {
    aliases.add(vendorAlias);
  }

  const contentTypeProperty = schema.properties?.contentType;

  if (typeof contentTypeProperty?.const === 'string') {
    aliases.add(contentTypeProperty.const);
  }

  if (Array.isArray(contentTypeProperty?.enum)) {
    for (const alias of contentTypeProperty.enum) {
      if (typeof alias === 'string' && alias.length > 0) {
        aliases.add(alias);
      }
    }
  }

  return [...aliases];
};

let docTypes = [];
let sourceLabel = 'openapi/doc-types.seed.json';

try {
  const openApi = await readJson(openApiPath);
  const schemas = openApi.components?.schemas ?? {};

  docTypes = Object.values(schemas)
    .flatMap((schema) => schemaDocTypes(schema))
    .filter((value, index, collection) => collection.indexOf(value) === index)
    .sort();

  if (docTypes.length > 0) {
    sourceLabel = 'openapi/umbraco-delivery.openapi.json';
  }
} catch {
  docTypes = [];
}

if (docTypes.length === 0) {
  const seed = await readJson(seedPath);
  docTypes = [...new Set(seed.docTypes)].sort();
}

if (docTypes.length === 0) {
  throw new Error(
    'No Umbraco document types could be derived from the OpenAPI document or seed manifest.',
  );
}

const config = await readJson(configPath);
const excludedDocTypes = [...new Set(config.excludedDocTypes)].sort();
const publicDocTypes = docTypes.filter((docType) => !excludedDocTypes.includes(docType));

const formatConstArray = (values) => {
  if (values.length === 0) {
    return '[]';
  }

  if (values.length <= 3) {
    return `[${values.map((value) => `'${value}'`).join(', ')}]`;
  }

  return `[\n${values.map((value) => `  '${value}',`).join('\n')}\n]`;
};

const sourceComment = `Generated from ${sourceLabel}.`;

const allDocTypesFile = `export const allUmbracoDocTypes = ${formatConstArray(docTypes)} as const;\n\nexport type UmbracoDocType = (typeof allUmbracoDocTypes)[number];\n\nexport const umbracoDocTypeSource = '${sourceComment}' as const;\n`;
const publicDocTypesFile = `export const excludedUmbracoDocTypes = ${formatConstArray(excludedDocTypes)} as const;\n\nexport const publicUmbracoDocTypes = ${formatConstArray(publicDocTypes)} as const;\n\nexport type ExcludedUmbracoDocType = (typeof excludedUmbracoDocTypes)[number];\nexport type PublicUmbracoDocType = (typeof publicUmbracoDocTypes)[number];\n`;

await mkdir(generatedDir, { recursive: true });
await writeFile(path.join(generatedDir, 'all-doc-types.generated.ts'), allDocTypesFile, 'utf8');
await writeFile(
  path.join(generatedDir, 'public-doc-types.generated.ts'),
  publicDocTypesFile,
  'utf8',
);

console.log(`Generated Umbraco doc type files from ${sourceLabel}.`);
