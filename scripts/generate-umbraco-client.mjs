import path from 'node:path';
import process from 'node:process';

import { generateUmbracoClient } from '../packages/umbraco-client/scripts/generate.mjs';
import { umbracoOpenApiUrl } from './umbraco-generation.config.mjs';

const packageDir = path.resolve(import.meta.dirname, '../packages/umbraco-client');
const openApiUrl = process.env.UMBRACO_OPENAPI_URL ?? umbracoOpenApiUrl;

if (!openApiUrl) {
  throw new Error(
    'Unable to determine UMBRACO_OPENAPI_URL. Set it explicitly or define umbracoOpenApiUrl in scripts/umbraco-generation.config.mjs.',
  );
}

await generateUmbracoClient({ cwd: packageDir, openApiUrl });
