import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';

const appEnvPath = path.resolve(process.cwd(), 'apps/site-nuxt/.env');

const loadEnvFile = async (filePath) => {
  const fileContents = await readFile(filePath, 'utf8');
  const entries = new Map();

  for (const line of fileContents.split(/\r?\n/u)) {
    const trimmed = line.trim();

    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    entries.set(key, value);
  }

  return entries;
};

const envEntries = await loadEnvFile(appEnvPath);
const inheritedEnv = { ...process.env };

for (const [key, value] of envEntries) {
  if (inheritedEnv[key] == null || inheritedEnv[key] === '') {
    inheritedEnv[key] = value;
  }
}

if (!inheritedEnv.UMBRACO_OPENAPI_URL && inheritedEnv.NUXT_UMBRACO_BASE_URL) {
  inheritedEnv.UMBRACO_OPENAPI_URL = `${inheritedEnv.NUXT_UMBRACO_BASE_URL.replace(/\/$/, '')}/umbraco/swagger/delivery/swagger.json`;
}

if (!inheritedEnv.UMBRACO_OPENAPI_URL) {
  throw new Error(
    `Unable to determine UMBRACO_OPENAPI_URL. Checked apps/site-nuxt/.env and existing environment variables.`,
  );
}

const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm';

await new Promise((resolve, reject) => {
  const child =
    process.platform === 'win32'
      ? spawn(
          process.env.ComSpec ?? 'cmd.exe',
          ['/d', '/s', '/c', `${npmExecutable} run generate --workspace @hoite-dev/content-client`],
          {
            cwd: process.cwd(),
            env: inheritedEnv,
            stdio: 'inherit',
          },
        )
      : spawn(npmExecutable, ['run', 'generate', '--workspace', '@hoite-dev/content-client'], {
          cwd: process.cwd(),
          env: inheritedEnv,
          stdio: 'inherit',
        });

  child.on('error', reject);
  child.on('exit', (code) => {
    if (code === 0) {
      resolve(undefined);
      return;
    }

    reject(new Error(`Content client generation failed with exit code ${code ?? 'unknown'}.`));
  });
});
