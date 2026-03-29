import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const outputPath = path.resolve(process.cwd(), 'openapi/umbraco-delivery.openapi.json');
const baseUrl = process.env.NUXT_UMBRACO_BASE_URL?.replace(/\/$/, '');
const derivedOpenApiUrl = baseUrl ? `${baseUrl}/umbraco/swagger/delivery/swagger.json` : undefined;
const openApiUrl = process.env.UMBRACO_OPENAPI_URL || derivedOpenApiUrl;

if (!openApiUrl) {
  throw new Error(
    'UMBRACO_OPENAPI_URL is not set and NUXT_UMBRACO_BASE_URL could not be used to derive the Swagger endpoint.',
  );
}

const response = await fetch(openApiUrl);

if (!response.ok) {
  throw new Error(`Failed to download Umbraco OpenAPI document from ${openApiUrl}.`);
}

const body = await response.text();

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, body, 'utf8');

console.log(`Saved Umbraco OpenAPI document to ${outputPath}.`);
