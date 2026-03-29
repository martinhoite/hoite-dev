import { constants } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

const openApiPath = path.resolve(process.cwd(), 'openapi/umbraco-delivery.openapi.json');
const outputPath = path.resolve(process.cwd(), 'src/generated/umbraco-openapi.generated.ts');

try {
  await access(openApiPath, constants.F_OK);
} catch {
  throw new Error(`OpenAPI document not found at ${openApiPath}. Run fetch-openapi first.`);
}

const ast = await openapiTS(pathToFileURL(openApiPath));
const contents = astToString(ast);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, contents, 'utf8');

console.log(`Generated OpenAPI types at ${outputPath}.`);
