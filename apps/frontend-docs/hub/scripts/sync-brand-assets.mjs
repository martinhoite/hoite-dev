import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const brandAssetsRoot = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'packages',
  'brand-assets',
  'assets',
);
const publicRoot = path.resolve(import.meta.dirname, '..', 'public');
const publicBrandDirectory = path.join(publicRoot, 'brand');

mkdirSync(publicRoot, { recursive: true });
mkdirSync(publicBrandDirectory, { recursive: true });

copyFileSync(
  path.join(brandAssetsRoot, 'favicon', 'favicon.svg'),
  path.join(publicRoot, 'favicon.svg'),
);
copyFileSync(
  path.join(brandAssetsRoot, 'favicon', 'favicon.png'),
  path.join(publicRoot, 'favicon.png'),
);
copyFileSync(
  path.join(brandAssetsRoot, 'logo', 'hoite-dev-mark.svg'),
  path.join(publicBrandDirectory, 'hoite-dev-mark.svg'),
);
