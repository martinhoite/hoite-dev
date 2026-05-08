import path from 'node:path';

import {
  buildContext,
  distFontAssets,
  sectionDefinitions,
  styleBundles,
  themeVariants,
  tokenConfig,
  tokenSources,
  tokensOnly,
} from './build.config.mjs';
import { copyAssets, ensureDir } from './lib/assets.mjs';
import { buildStyleBundles, compileScss } from './lib/styles.mjs';
import { buildTokenArtifacts } from './lib/tokens.mjs';

await ensureDir(buildContext.buildDir);
await ensureDir(buildContext.distDir);

const tokenArtifacts = await buildTokenArtifacts({
  buildDir: buildContext.buildDir,
  distDir: buildContext.distDir,
  sectionDefinitions,
  sourceDir: buildContext.sourceDir,
  themeVariants,
  tokenConfig,
  tokenSources,
});

if (!tokensOnly) {
  await copyAssets({
    assets: distFontAssets,
    destinationRoot: path.join(buildContext.distDir, 'fonts'),
    sourceRoot: buildContext.fontAssetsDir,
  });

  await buildStyleBundles({
    buildDir: buildContext.buildDir,
    compileBundle: (bundle) =>
      compileScss({
        ...bundle,
        packageDir: buildContext.packageDir,
        rootDir: buildContext.rootDir,
        withSharedLayerPrelude: tokenArtifacts.withSharedLayerPrelude,
      }),
    distDir: buildContext.distDir,
    sharedLayerPrelude: tokenArtifacts.sharedLayerPrelude,
    styleBundles,
    themeCss: tokenArtifacts.themeCss,
    tokensCss: tokenArtifacts.tokensCss,
  });
}
