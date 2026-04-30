import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { fetchOpenApi } from './fetch-openapi.mjs';
import { generateDocTypeFiles } from './generate-doc-type-files.mjs';
import { generateOpenApiTypes } from './generate-openapi-types.mjs';

const runBiomeFormat = async (cwd) => {
  const biomeBinaryName = process.platform === 'win32' ? 'biome.cmd' : 'biome';
  const localBiomeBinaryPath = path.join(cwd, '..', '..', 'node_modules', '.bin', biomeBinaryName);

  try {
    await access(localBiomeBinaryPath);
  } catch {
    throw new Error('Unable to find the Biome CLI in the workspace. Install dependencies first.');
  }

  await new Promise((resolve, reject) => {
    const child = spawn(
      localBiomeBinaryPath,
      [
        'format',
        '--write',
        'openapi/umbraco-delivery.openapi.json',
        'src/generated/umbraco-openapi.generated.ts',
        'src/generated/all-doc-types.generated.ts',
        'src/generated/public-doc-types.generated.ts',
      ],
      {
        cwd,
        stdio: 'inherit',
      },
    );

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
