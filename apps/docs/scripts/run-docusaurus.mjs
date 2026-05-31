import { spawnSync } from 'node:child_process';
import path from 'node:path';

const docsAppRoot = path.resolve(import.meta.dirname, '..');
const shimPath = path.resolve(import.meta.dirname, 'docusaurus-resolve-weak-shim.cjs');
const docusaurusArgs = process.argv.slice(2);

if (docusaurusArgs.length === 0) {
  throw new Error('Expected a Docusaurus command.');
}

function runCommand(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: docsAppRoot,
    env: {
      ...process.env,
      NODE_OPTIONS: [process.env.NODE_OPTIONS, `--require=${shimPath}`].filter(Boolean).join(' '),
    },
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
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

runPnpm(['exec', 'docusaurus', ...docusaurusArgs]);
