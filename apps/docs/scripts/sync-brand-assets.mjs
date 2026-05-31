import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const brandAssetsRoot = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'packages',
  'brand-assets',
  'assets',
);
const staticRoot = path.resolve(import.meta.dirname, '..', 'static');
const staticBrandDirectory = path.join(staticRoot, 'brand');

mkdirSync(staticRoot, { recursive: true });
mkdirSync(staticBrandDirectory, { recursive: true });

copyFileSync(
  path.join(brandAssetsRoot, 'favicon', 'favicon.svg'),
  path.join(staticRoot, 'favicon.svg'),
);
copyFileSync(
  path.join(brandAssetsRoot, 'favicon', 'favicon.png'),
  path.join(staticRoot, 'favicon.png'),
);
copyFileSync(
  path.join(brandAssetsRoot, 'logo', 'hoite-dev-mark.svg'),
  path.join(staticBrandDirectory, 'hoite-dev-mark.svg'),
);
