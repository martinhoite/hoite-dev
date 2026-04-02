import { constants } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

export async function generateOpenApiTypes({ cwd = process.cwd() } = {}) {
  const openApiPath = path.resolve(cwd, 'openapi/umbraco-delivery.openapi.json');
  const outputPath = path.resolve(cwd, 'src/generated/umbraco-openapi.generated.ts');

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
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await generateOpenApiTypes();
}
