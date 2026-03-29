import { constants } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

const openApiPath = path.resolve(process.cwd(), 'openapi/umbraco-delivery.openapi.json');
const outputPath = path.resolve(process.cwd(), 'src/generated/umbraco-openapi.generated.ts');
const placeholderContents = 'export type UmbracoOpenApiDocument = unknown;\n';

try {
  await access(openApiPath, constants.F_OK);
} catch {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, placeholderContents, 'utf8');
  console.log('OpenAPI document not found. Wrote placeholder generated types file.');
  process.exit(0);
}

const ast = await openapiTS(pathToFileURL(openApiPath));
const contents = astToString(ast);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, contents, 'utf8');

console.log(`Generated OpenAPI types at ${outputPath}.`);
