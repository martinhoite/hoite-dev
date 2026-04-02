import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const readmePath = path.join(rootDir, 'README.md');
const packageJsonPath = path.join(rootDir, 'package.json');

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

if (updatedReadme === readme) {
  console.log('Root README version badges are up to date.');
  process.exit(0);
}

if (checkOnly) {
  console.error('Root README version badges are out of date. Run `npm run readme:sync-versions`.');
  process.exit(1);
}

await writeFile(readmePath, updatedReadme, 'utf8');
console.log('Updated root README version badges.');
