import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const shouldClearCache = !args.has('--skip-cache-clear');
const shouldSyncFavicon = args.has('--sync-favicon');

function runCommand(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runPnpm(commandArgs) {
  const packageManagerExecPath = process.env.npm_execpath;

  if (packageManagerExecPath) {
    runCommand(process.execPath, [packageManagerExecPath, ...commandArgs]);

    return;
  }

  const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

  runCommand(pnpmCommand, commandArgs);
}

if (shouldClearCache) {
  const storybookCachePath = path.resolve(process.cwd(), 'node_modules/.cache/storybook');

  rmSync(storybookCachePath, {
    force: true,
    recursive: true,
  });
}

if (shouldSyncFavicon) {
  runCommand('node', ['./scripts/sync-favicon.mjs']);
}

runPnpm(['--filter', '@hoite-dev/storybook-addon-composition-theme', 'run', 'build']);
