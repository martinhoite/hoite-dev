import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { fetchOpenApi } from './fetch-openapi.mjs';
import { generateDocTypeFiles } from './generate-doc-type-files.mjs';
import { generateOpenApiTypes } from './generate-openapi-types.mjs';

const generatedFiles = [
  'openapi/umbraco-delivery.openapi.json',
  'src/generated/umbraco-openapi.generated.ts',
  'src/generated/all-doc-types.generated.ts',
  'src/generated/public-doc-types.generated.ts',
];

const runBiomeFormat = async (cwd) => {
  const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  await new Promise((resolve, reject) => {
    const child = spawn(npmExecutable, ['exec', 'biome', 'format', '--write', ...generatedFiles], {
      cwd,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(`Biome format failed with exit code ${code ?? 'unknown'}.`));
    });
  });
};

export async function generateUmbracoClient({
  cwd = process.cwd(),
  openApiUrl = process.env.UMBRACO_OPENAPI_URL,
} = {}) {
  await fetchOpenApi({ cwd, openApiUrl });
  await generateOpenApiTypes({ cwd });
  await generateDocTypeFiles({ cwd });
  await runBiomeFormat(cwd);
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await generateUmbracoClient();
}
