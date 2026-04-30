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
const expectedPackageManager = packageJson.packageManager;

if (!expectedPackageManager) {
  console.error('Missing `packageManager` in the root package.json.');
  process.exit(1);
}

const packageManagerBadgeValue = expectedPackageManager.replace('@', ' ');
const desiredBadgeBlock = [
  `![Node engine](https://img.shields.io/badge/Node%20engine-${encodeURIComponent(expectedNodeEngine)}-026E00)`,
  `![Package manager](https://img.shields.io/badge/package%20manager-${encodeURIComponent(packageManagerBadgeValue)}-F69220)`,
  '![CI](https://github.com/martinhoite/hoite-dev/actions/workflows/ci.yml/badge.svg?branch=master)',
].join('\n');

const badgeBlockPattern =
  /<!-- readme-version-badges:start -->[\s\S]*?<!-- readme-version-badges:end -->/;
const desiredManagedBadgeBlock = [
  '<!-- readme-version-badges:start -->',
  desiredBadgeBlock,
  '<!-- readme-version-badges:end -->',
].join('\n');

let updatedReadme;

if (badgeBlockPattern.test(readme)) {
  updatedReadme = readme.replace(badgeBlockPattern, desiredManagedBadgeBlock);
} else {
  console.error(
    'Missing README badge markers. Add `<!-- readme-version-badges:start -->` and `<!-- readme-version-badges:end -->` to the root README.',
  );
  process.exit(1);
}

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
