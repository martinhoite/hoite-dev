import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const appDir = process.cwd();
const readmePath = path.join(appDir, 'README.md');
const nuxtPackageJsonPath = path.join(appDir, '..', '..', 'node_modules', 'nuxt', 'package.json');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const nuxtPackageJson = JSON.parse(await readFile(nuxtPackageJsonPath, 'utf8'));
const readme = await readFile(readmePath, 'utf8');

const expectedNuxtVersion = nuxtPackageJson.version;
const desiredNuxtBadge = `![Nuxt version](https://img.shields.io/badge/Nuxt%20version-${encodeURIComponent(expectedNuxtVersion)}-00DC82)`;

const updatedReadme = readme
  .replace(
    /!\[Nuxt version]\(https:\/\/img\.shields\.io\/badge\/Nuxt%20version-[^)]+\)/,
    desiredNuxtBadge,
  )
  .replace(
    /\n!\[(?:Node version|Node engine)]\(https:\/\/img\.shields\.io\/badge\/Node%20(?:version|engine)-[^)]+\)/,
    '',
  );

if (updatedReadme === readme) {
  console.log('README version badges are up to date.');
  process.exit(0);
}

if (checkOnly) {
  console.error(
    'README version badges are out of date. Run `npm run readme:sync-versions` in apps/nuxt-app.',
  );
  process.exit(1);
}

await writeFile(readmePath, updatedReadme, 'utf8');
console.log('Updated README version badges.');
