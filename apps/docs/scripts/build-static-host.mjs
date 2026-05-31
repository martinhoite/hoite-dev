import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..', '..');
const docsAppRoot = path.resolve(import.meta.dirname, '..');
const docsBuildRoot = path.join(docsAppRoot, 'build');
const staticHostRoot = path.join(docsAppRoot, 'dist');
const reactStorybookRoot = path.join(
  repoRoot,
  'apps',
  'frontend-docs',
  'design-system-react',
  'storybook-static',
);
const vueStorybookRoot = path.join(
  repoRoot,
  'apps',
  'frontend-docs',
  'design-system-vue',
  'storybook-static',
);

function runCommand(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
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

function ensureDirectoryExists(directoryPath) {
  mkdirSync(directoryPath, { recursive: true });
}

function ensureBuildOutput(directoryPath, label) {
  if (!existsSync(directoryPath)) {
    throw new Error(`Missing ${label} output at ${directoryPath}.`);
  }
}

runPnpm(['--filter', '@hoite-dev/ui', 'run', 'build']);
runPnpm(['--filter', '@hoite-dev/frontend-docs-design-system-react', 'run', 'build']);
runPnpm(['--filter', '@hoite-dev/frontend-docs-design-system-vue', 'run', 'build']);
runPnpm(['--filter', '@hoite-dev/docs', 'run', 'build']);

ensureBuildOutput(docsBuildRoot, 'docs app');
ensureBuildOutput(reactStorybookRoot, 'React Storybook');
ensureBuildOutput(vueStorybookRoot, 'Vue Storybook');

rmSync(staticHostRoot, {
  force: true,
  recursive: true,
});

cpSync(docsBuildRoot, staticHostRoot, {
  recursive: true,
});

ensureDirectoryExists(path.join(staticHostRoot, 'design-system'));

cpSync(reactStorybookRoot, path.join(staticHostRoot, 'design-system', 'react'), {
  recursive: true,
});
cpSync(vueStorybookRoot, path.join(staticHostRoot, 'design-system', 'vue'), {
  recursive: true,
});
