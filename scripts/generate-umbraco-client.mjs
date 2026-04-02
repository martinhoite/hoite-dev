import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { generateUmbracoClient } from '../packages/umbraco-client/scripts/generate.mjs';

const packageDir = path.resolve(import.meta.dirname, '../packages/umbraco-client');
const repoRoot = path.resolve(import.meta.dirname, '..');
const envFile = path.resolve(repoRoot, '.env');

const parseEnvFile = (contents) => {
  const entries = [];

  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (line === '' || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    let value = rawValue;

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      value = rawValue.slice(1, -1);
    }

    entries.push([key, value]);
  }

  return entries;
};

const loadRootEnv = async () => {
  let contents;

  try {
    await access(envFile);
    contents = await readFile(envFile, 'utf8');
  } catch {
    return;
  }

  for (const [key, value] of parseEnvFile(contents)) {
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

await loadRootEnv();

const openApiUrl = process.env.UMBRACO_OPENAPI_URL;
const openApiCaCertificatePath = process.env.UMBRACO_OPENAPI_CA_CERT_PATH;

if (!openApiUrl) {
  throw new Error('Unable to determine UMBRACO_OPENAPI_URL. Set it in the root .env file.');
}

await generateUmbracoClient({
  cwd: packageDir,
  openApiCaCertificatePath,
  openApiUrl,
});
