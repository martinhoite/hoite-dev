import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function copyAssets({ assets, destinationRoot, sourceRoot }) {
  await fs.rm(destinationRoot, { force: true, recursive: true });

  await Promise.all(
    assets.map(async (asset) => {
      const sourcePath = path.join(sourceRoot, asset.source);
      const destinationPath = path.join(destinationRoot, asset.destination);

      await ensureDir(path.dirname(destinationPath));
      await fs.copyFile(sourcePath, destinationPath);
    }),
  );
}
