import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { fetchOpenApi } from './fetch-openapi.mjs';
import { generateDocTypeFiles } from './generate-doc-type-files.mjs';
import { generateOpenApiTypes } from './generate-openapi-types.mjs';

const runBiomeFormat = async (cwd) => {
  const npmCliPath = process.env.npm_execpath;

  if (!npmCliPath) {
    throw new Error('Unable to determine npm CLI path. Run the generator through an npm script.');
  }

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [npmCliPath, 'run', 'format:generated'], {
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
  openApiCaCertificatePath,
  openApiUrl = process.env.UMBRACO_OPENAPI_URL,
} = {}) {
  await fetchOpenApi({ cwd, openApiCaCertificatePath, openApiUrl });
  await generateOpenApiTypes({ cwd });
  await generateDocTypeFiles({ cwd });
  await runBiomeFormat(cwd);
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await generateUmbracoClient();
}
