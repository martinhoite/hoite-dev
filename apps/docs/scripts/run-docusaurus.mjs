import { spawnSync } from 'node:child_process';
import path from 'node:path';

const docsAppRoot = path.resolve(import.meta.dirname, '..');
const shimPath = path.resolve(import.meta.dirname, 'docusaurus-resolve-weak-shim.cjs');
const docusaurusArgs = process.argv.slice(2);
const rootSslDir = path.resolve(docsAppRoot, '../../ssl');
const sharedLocalCertificateHost = 'local.hoite.dev';

if (docusaurusArgs.length === 0) {
  throw new Error('Expected a Docusaurus command.');
}

function createDocusaurusEnv(commandArgs) {
  const isStartCommand = commandArgs.includes('start');

  if (!isStartCommand) {
    return {
      ...process.env,
      NODE_OPTIONS: [process.env.NODE_OPTIONS, `--require=${shimPath}`].filter(Boolean).join(' '),
    };
  }

  return {
    ...process.env,
    HTTPS: process.env.HTTPS ?? 'true',
    NODE_OPTIONS: [process.env.NODE_OPTIONS, `--require=${shimPath}`].filter(Boolean).join(' '),
    SSL_CRT_FILE:
      process.env.SSL_CRT_FILE ?? path.resolve(rootSslDir, `${sharedLocalCertificateHost}.pem`),
    SSL_KEY_FILE:
      process.env.SSL_KEY_FILE ?? path.resolve(rootSslDir, `${sharedLocalCertificateHost}-key.pem`),
  };
}

function runCommand(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: docsAppRoot,
    env: createDocusaurusEnv(commandArgs),
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

  if (process.platform === 'win32') {
    runCommand(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', pnpmCommand, ...commandArgs]);

    return;
  }

  runCommand(pnpmCommand, commandArgs);
}

runPnpm(['exec', 'docusaurus', ...docusaurusArgs]);
