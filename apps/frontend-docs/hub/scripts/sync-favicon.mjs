import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const sourceDirectory = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'packages',
  'brand-assets',
  'assets',
  'favicon',
);
const targetDirectory = path.resolve(import.meta.dirname, '..', 'public');

mkdirSync(targetDirectory, { recursive: true });
copyFileSync(path.join(sourceDirectory, 'favicon.svg'), path.join(targetDirectory, 'favicon.svg'));
copyFileSync(path.join(sourceDirectory, 'favicon.png'), path.join(targetDirectory, 'favicon.png'));
