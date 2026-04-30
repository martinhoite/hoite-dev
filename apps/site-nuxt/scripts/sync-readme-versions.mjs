import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const appDir = process.cwd();
const readmePath = path.join(appDir, 'README.md');
const packageJsonPath = path.join(appDir, 'package.json');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const readme = await readFile(readmePath, 'utf8');

const expectedNuxtVersion = packageJson.dependencies?.nuxt ?? packageJson.devDependencies?.nuxt;

if (!expectedNuxtVersion) {
  console.error('Missing `nuxt` dependency in apps/site-nuxt/package.json.');
  process.exit(1);
}

const desiredNuxtBadge = `![Nuxt version](https://img.shields.io/badge/Nuxt%20version-${encodeURIComponent(expectedNuxtVersion)}-00DC82)`;

const updatedReadme = readme.replace(
  /!\[Nuxt version]\(https:\/\/img\.shields\.io\/badge\/Nuxt%20version-[^)]+\)/,
  desiredNuxtBadge,
);

if (updatedReadme === readme) {
  console.log('README version badges are up to date.');
  process.exit(0);
}

if (checkOnly) {
  console.error(
    'README version badges are out of date. Run `pnpm run readme:sync-versions` in apps/site-nuxt.',
  );
  process.exit(1);
}

await writeFile(readmePath, updatedReadme, 'utf8');
console.log('Updated README version badges.');
