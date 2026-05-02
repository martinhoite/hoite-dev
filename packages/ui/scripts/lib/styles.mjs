import fs from 'node:fs/promises';
import path from 'node:path';

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import * as sass from 'sass';

export async function compileScss({
  entry,
  includeLayerPrelude = false,
  outputFile,
  packageDir,
  rootDir,
  withSharedLayerPrelude,
}) {
  const compiled = sass.compile(entry, {
    loadPaths: [packageDir, rootDir],
    style: 'expanded',
  });
  const sourceCss = compiled.css.trim();
  const css = includeLayerPrelude ? withSharedLayerPrelude(sourceCss) : sourceCss;
  const prefixed = await postcss([autoprefixer]).process(css, {
    from: entry,
    to: outputFile,
  });

  return prefixed.css;
}

export async function buildStyleBundles({
  buildDir,
  distDir,
  sharedLayerPrelude,
  styleBundles,
  themeCss,
  tokensCss,
  compileBundle,
}) {
  for (const bundle of styleBundles) {
    const outputFile = path.join(distDir, bundle.output);
    const css = await compileBundle({
      entry: bundle.entry,
      includeLayerPrelude: bundle.includeLayerPrelude,
      outputFile,
    });

    if (bundle.buildArtifact) {
      await fs.writeFile(path.join(buildDir, bundle.buildArtifact), css);
    }

    if (bundle.composeWithTokensAndThemes) {
      const fullStylesheet = [sharedLayerPrelude, '', tokensCss, '', themeCss, '', css]
        .filter(Boolean)
        .join('\n');

      await fs.writeFile(outputFile, fullStylesheet);
      continue;
    }

    await fs.writeFile(outputFile, css);
  }
}
