import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const readmePath = path.join(rootDir, 'README.md');
const packageJsonPath = path.join(rootDir, 'package.json');
const siteNuxtDir = path.join(rootDir, 'apps', 'site-nuxt');
const siteNuxtScriptPath = path.join(siteNuxtDir, 'scripts', 'sync-readme-versions.mjs');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const readme = await readFile(readmePath, 'utf8');

const expectedNodeEngine = packageJson.engines?.node ?? process.versions.node;
const desiredNodeBadge = `![Node engine](https://img.shields.io/badge/Node%20engine-${encodeURIComponent(expectedNodeEngine)}-026E00)`;

const updatedReadme = readme.replace(
  /!\[(?:Node version|Node engine)]\(https:\/\/img\.shields\.io\/badge\/Node%20(?:version|engine)-[^)]+\)/,
  desiredNodeBadge,
);

let hasErrors = false;

if (updatedReadme === readme) {
  console.log('Root README version badges are up to date.');
} else if (checkOnly) {
  console.error('Root README version badges are out of date. Run `pnpm run readme:sync-versions`.');
  hasErrors = true;
} else {
  await writeFile(readmePath, updatedReadme, 'utf8');
  console.log('Updated root README version badges.');
}

const siteNuxtScriptArgs = checkOnly ? [siteNuxtScriptPath, '--check'] : [siteNuxtScriptPath];

try {
  execFileSync(process.execPath, siteNuxtScriptArgs, {
    cwd: siteNuxtDir,
    stdio: 'inherit',
  });
} catch {
  hasErrors = true;
}

if (hasErrors) {
  process.exit(1);
}
