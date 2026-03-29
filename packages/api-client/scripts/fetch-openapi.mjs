import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const outputPath = path.resolve(process.cwd(), 'openapi/umbraco-delivery.openapi.json');
const openApiUrl = process.env.UMBRACO_OPENAPI_URL;

if (!openApiUrl) {
  console.log('UMBRACO_OPENAPI_URL is not set. Skipping OpenAPI download.');
  process.exit(0);
}

const response = await fetch(openApiUrl);

if (!response.ok) {
  throw new Error(`Failed to download Umbraco OpenAPI document from ${openApiUrl}.`);
}

const body = await response.text();

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, body, 'utf8');

console.log(`Saved Umbraco OpenAPI document to ${outputPath}.`);
