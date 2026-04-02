import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getCACertificates, setDefaultCACertificates } from 'node:tls';
import { pathToFileURL } from 'node:url';

const configureHttpsTrust = async ({ cwd, openApiCaCertificatePath, openApiUrl }) => {
  const url = new URL(openApiUrl);

  if (url.protocol !== 'https:' || !openApiCaCertificatePath) {
    return;
  }

  const certificatePath = path.resolve(cwd, openApiCaCertificatePath);
  const certificate = await readFile(certificatePath, 'utf8');
  const trustedCertificates = [...new Set([...getCACertificates('default'), certificate])];

  setDefaultCACertificates(trustedCertificates);
};

export async function fetchOpenApi({
  openApiCaCertificatePath,
  cwd = process.cwd(),
  openApiUrl = process.env.UMBRACO_OPENAPI_URL,
} = {}) {
  const outputPath = path.resolve(cwd, 'openapi/umbraco-delivery.openapi.json');

  if (!openApiUrl) {
    throw new Error('UMBRACO_OPENAPI_URL is not set.');
  }

  await configureHttpsTrust({ cwd, openApiCaCertificatePath, openApiUrl });

  const response = await fetch(openApiUrl);

  if (!response.ok) {
    throw new Error(`Failed to download Umbraco OpenAPI document from ${openApiUrl}.`);
  }

  const body = await response.json();
  const contents = `${JSON.stringify(body, null, 2)}\n`;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents, 'utf8');

  console.log(`Saved Umbraco OpenAPI document to ${outputPath}.`);
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await fetchOpenApi();
}
