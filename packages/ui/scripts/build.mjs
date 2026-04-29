import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import * as sass from 'sass';
import StyleDictionary from 'style-dictionary';
import { transforms, transformTypes } from 'style-dictionary/enums';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, '..');
const rootDir = path.resolve(packageDir, '../..');
const buildDir = path.join(packageDir, '.build', 'generated');
const distDir = path.join(packageDir, 'dist');
const sourceDir = path.join(packageDir, 'src', 'tokens', 'source');
const fontAssetsDir = path.join(packageDir, 'src', 'assets', 'fonts');
const fontsStylesEntry = path.join(packageDir, 'src', 'styles', 'fonts.scss');
const stylesEntry = path.join(packageDir, 'src', 'styles', 'index.scss');
const typographyStylesEntry = path.join(
  packageDir,
  'src',
  'components',
  'typography',
  'typography.scss',
);
const tokensOnly = process.argv.includes('--tokens-only');
const remBasePx = 16;
const cssValueTransformName = 'hoite/value/web';
const cssVariablesFormatName = 'hoite/css/variables';
const layerNamePrefix = 'tokens';
const themeLayerName = `${layerNamePrefix}.theme`;

const sectionDefinitions = [
  {
    key: 'layout',
    layerName: `${layerNamePrefix}.layout`,
    presenter: 'Spacing',
    selector: ':root',
    title: 'Layout',
  },
  {
    key: 'spacing',
    layerName: `${layerNamePrefix}.spacing`,
    presenter: 'Spacing',
    selector: ':root',
    title: 'Spacing',
  },
  {
    key: 'radius',
    layerName: `${layerNamePrefix}.radius`,
    presenter: 'BorderRadius',
    selector: ':root',
    title: 'Border Radius',
  },
  {
    key: 'size',
    layerName: `${layerNamePrefix}.size`,
    presenter: 'Spacing',
    selector: ':root',
    title: 'Size',
  },
  {
    key: 'stroke',
    layerName: `${layerNamePrefix}.stroke`,
    presenter: 'Spacing',
    selector: ':root',
    title: 'Stroke',
  },
  {
    key: 'motion.duration',
    layerName: `${layerNamePrefix}.motion.duration`,
    presenter: 'Animation',
    selector: ':root',
    title: 'Motion Duration',
  },
  {
    key: 'motion.easing',
    layerName: `${layerNamePrefix}.motion.easing`,
    presenter: 'Easing',
    selector: ':root',
    title: 'Motion Easing',
  },
  {
    key: 'typography.family',
    layerName: `${layerNamePrefix}.typography.family`,
    presenter: 'FontFamily',
    selector: ':root',
    title: 'Typography Family',
  },
  {
    key: 'typography.weight',
    layerName: `${layerNamePrefix}.typography.weight`,
    presenter: 'FontWeight',
    selector: ':root',
    title: 'Typography Weight',
  },
  {
    key: 'typography.size',
    layerName: `${layerNamePrefix}.typography.size`,
    presenter: 'FontSize',
    selector: ':root',
    title: 'Typography Size',
  },
  {
    key: 'typography.line-height',
    layerName: `${layerNamePrefix}.typography.line-height`,
    presenter: 'LineHeight',
    selector: ':root',
    title: 'Typography Line Height',
  },
  {
    key: 'typography.letter-spacing',
    layerName: `${layerNamePrefix}.typography.letter-spacing`,
    presenter: 'LetterSpacing',
    selector: ':root',
    title: 'Typography Letter Spacing',
  },
  {
    key: 'typography.paragraph-spacing',
    layerName: `${layerNamePrefix}.typography.paragraph-spacing`,
    presenter: 'Spacing',
    selector: ':root',
    title: 'Typography Paragraph Spacing',
  },
  {
    key: 'primitive',
    layerName: `${layerNamePrefix}.primitive`,
    presenter: 'Color',
    selector: ':root',
    title: 'Primitive Colors',
  },
];
const sharedLayerOrder = [
  ...sectionDefinitions.map((section) => section.layerName),
  themeLayerName,
];
const sharedLayerPrelude = `@layer ${sharedLayerOrder.join(', ')};`;

const trimNumber = (value) => Number.parseFloat(value.toFixed(4)).toString();

const pxToRem = (value) => `${trimNumber(value / remBasePx)}rem`;

const cssVariableSyntaxPattern = /^var\(--(?<name>[^)]+)\)$/;
const pathNamedTokenRoots = new Set(['color', 'motion', 'radius', 'size', 'spacing', 'typography']);
const fontFamilyStacks = {
  'typography.family.body': "'Roboto', Arial, Helvetica, sans-serif",
  'typography.family.heading': "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};
const distFontAssets = [
  {
    destination: path.join('open-sans', 'OFL.txt'),
    source: path.join('Open_Sans', 'OFL.txt'),
  },
  {
    destination: path.join('open-sans', 'OpenSans-Bold.woff2'),
    source: path.join('Open_Sans', 'OpenSans-Bold.woff2'),
  },
  {
    destination: path.join('open-sans', 'OpenSans-BoldItalic.woff2'),
    source: path.join('Open_Sans', 'OpenSans-BoldItalic.woff2'),
  },
  {
    destination: path.join('open-sans', 'OpenSans-Italic.woff2'),
    source: path.join('Open_Sans', 'OpenSans-Italic.woff2'),
  },
  {
    destination: path.join('open-sans', 'OpenSans-Italic-VariableFont_wdth,wght.woff2'),
    source: path.join('Open_Sans', 'OpenSans-Italic-VariableFont_wdth,wght.woff2'),
  },
  {
    destination: path.join('open-sans', 'OpenSans-Regular.woff2'),
    source: path.join('Open_Sans', 'OpenSans-Regular.woff2'),
  },
  {
    destination: path.join('open-sans', 'OpenSans-VariableFont_wdth,wght.woff2'),
    source: path.join('Open_Sans', 'OpenSans-VariableFont_wdth,wght.woff2'),
  },
  {
    destination: path.join('roboto', 'OFL.txt'),
    source: path.join('Roboto', 'OFL.txt'),
  },
  {
    destination: path.join('roboto', 'Roboto-Bold.woff2'),
    source: path.join('Roboto', 'Roboto-Bold.woff2'),
  },
  {
    destination: path.join('roboto', 'Roboto-BoldItalic.woff2'),
    source: path.join('Roboto', 'Roboto-BoldItalic.woff2'),
  },
  {
    destination: path.join('roboto', 'Roboto-Italic.woff2'),
    source: path.join('Roboto', 'Roboto-Italic.woff2'),
  },
  {
    destination: path.join('roboto', 'Roboto-Italic-VariableFont_wdth,wght.woff2'),
    source: path.join('Roboto', 'Roboto-Italic-VariableFont_wdth,wght.woff2'),
  },
  {
    destination: path.join('roboto', 'Roboto-Regular.woff2'),
    source: path.join('Roboto', 'Roboto-Regular.woff2'),
  },
  {
    destination: path.join('roboto', 'Roboto-VariableFont_wdth,wght.woff2'),
    source: path.join('Roboto', 'Roboto-VariableFont_wdth,wght.woff2'),
  },
];

const getTokenCssName = (token) => {
  const webSyntax = token.$extensions?.['com.figma.codeSyntax']?.WEB;
  const [root] = token.path;

  if (
    typeof webSyntax === 'string' &&
    (!pathNamedTokenRoots.has(root) || root === 'border' || root === 'outline')
  ) {
    const match = webSyntax.match(cssVariableSyntaxPattern);

    if (match?.groups?.name) {
      return match.groups.name;
    }
  }

  return token.name;
};

const formatStringValue = (pathSegments, value) => {
  const pathKey = pathSegments.join('.');

  if (pathKey in fontFamilyStacks) {
    return fontFamilyStacks[pathKey];
  }

  if (pathKey.startsWith('typography.family.') && /\s/.test(value)) {
    return `'${value}'`;
  }

  return value;
};

const formatCssValue = (token) => {
  if (typeof token.$value === 'string') {
    return formatStringValue(token.path, token.$value);
  }

  if (typeof token.$value !== 'number') {
    return token.$value;
  }

  const pathKey = token.path.join('.');

  if (pathKey.startsWith('spacing.')) {
    return pxToRem(token.$value);
  }

  if (
    pathKey.startsWith('layout.gutter.') ||
    pathKey.startsWith('layout.grid-container.') ||
    pathKey.startsWith('size.')
  ) {
    return pxToRem(token.$value);
  }

  if (pathKey.startsWith('radius.')) {
    return `${token.$value}px`;
  }

  if (pathKey.startsWith('border.') || pathKey.startsWith('outline.')) {
    return `${token.$value}px`;
  }

  if (pathKey.startsWith('motion.duration.')) {
    return `${token.$value}ms`;
  }

  if (
    pathKey.startsWith('typography.size.') ||
    pathKey.startsWith('typography.line-height.') ||
    pathKey.startsWith('typography.letter-spacing.') ||
    pathKey.startsWith('typography.paragraph-spacing.')
  ) {
    return pxToRem(token.$value);
  }

  if (pathKey.startsWith('typography.weight.')) {
    return token.$value;
  }

  return token.$value;
};

const getSectionKey = (pathSegments) => {
  const [root, group] = pathSegments;

  if (root === 'layout' || root === 'spacing' || root === 'radius' || root === 'size') {
    return root;
  }

  if (root === 'motion' || root === 'typography') {
    return `${root}.${group}`;
  }

  if (root === 'border' || root === 'outline') {
    return 'stroke';
  }

  return root;
};

const getSectionKeyForToken = (token) => {
  const sectionKey = getSectionKey(token.path);

  if (sectionKey !== token.path[0]) {
    return sectionKey;
  }

  const cssName = getTokenCssName(token);

  if (cssName.startsWith('primitive-')) {
    return 'primitive';
  }

  if (cssName.startsWith('stroke-')) {
    return 'stroke';
  }

  return sectionKey;
};

StyleDictionary.registerTransform({
  filter: (token) =>
    typeof token.$value === 'number' ||
    typeof token.$value === 'string' ||
    token.$type === 'fontFamily' ||
    token.$type === 'cubicBezier',
  name: cssValueTransformName,
  transform: (token) => formatCssValue(token),
  type: transformTypes.value,
});

StyleDictionary.registerFormat({
  format: ({ dictionary, file }) => {
    const sections = (file.options.sections ?? [])
      .map((section) => ({
        ...section,
        tokens: dictionary.allTokens.filter((token) => section.filter(token)),
      }))
      .filter((section) => section.tokens.length > 0);

    return sections
      .map(
        (section) => `/**
 * @tokens ${section.title}
 * @presenter ${section.presenter}
 */
@layer ${section.layerName} {
  ${section.selector} {
${section.tokens.map((token) => `    --${getTokenCssName(token)}: ${token.$value};`).join('\n')}
  }
}`,
      )
      .join('\n\n');
  },
  name: cssVariablesFormatName,
});

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const copyDistFontAssets = async () => {
  const distFontsDir = path.join(distDir, 'fonts');

  await fs.rm(distFontsDir, { force: true, recursive: true });

  await Promise.all(
    distFontAssets.map(async (asset) => {
      const sourcePath = path.join(fontAssetsDir, asset.source);
      const destinationPath = path.join(distFontsDir, asset.destination);

      await ensureDir(path.dirname(destinationPath));
      await fs.copyFile(sourcePath, destinationPath);
    }),
  );
};

const withSharedLayerPrelude = (css) => [sharedLayerPrelude, css].filter(Boolean).join('\n\n');

const compileScss = async ({ entry, includeLayerPrelude = false, outputFile }) => {
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
};

const buildPlatform = async ({ files, source, buildPath }) => {
  const dictionary = new StyleDictionary({
    source,
    platforms: {
      css: {
        buildPath,
        transforms: [
          transforms.attributeCti,
          transforms.nameKebab,
          transforms.colorCss,
          transforms.fontFamilyCss,
          transforms.cubicBezierCss,
          cssValueTransformName,
        ],
        files,
      },
    },
  });

  await dictionary.buildPlatform('css');
};

await ensureDir(buildDir);
await ensureDir(distDir);

await buildPlatform({
  buildPath: `${buildDir}${path.sep}`,
  source: [
    path.join(sourceDir, 'layout', 'Value.tokens.json'),
    path.join(sourceDir, 'motion', 'Value.tokens.json'),
    path.join(sourceDir, 'primitives', 'Value.tokens.json'),
    path.join(sourceDir, 'radius', 'Value.tokens.json'),
    path.join(sourceDir, 'sizing', 'Value.tokens.json'),
    path.join(sourceDir, 'spacing', 'Value.tokens.json'),
    path.join(sourceDir, 'stroke', 'Value.tokens.json'),
    path.join(sourceDir, 'typography', 'Value.tokens.json'),
  ],
  files: [
    {
      destination: 'tokens.css',
      format: cssVariablesFormatName,
      options: {
        sections: sectionDefinitions.map((section) => ({
          ...section,
          filter: (token) => getSectionKeyForToken(token) === section.key,
        })),
      },
    },
  ],
});

await buildPlatform({
  buildPath: `${buildDir}${path.sep}`,
  source: [path.join(sourceDir, 'color', 'Light.tokens.json')],
  files: [
    {
      destination: 'themes-light.css',
      format: cssVariablesFormatName,
      options: {
        sections: [
          {
            filter: () => true,
            layerName: themeLayerName,
            presenter: 'Color',
            selector: ':root, [data-theme="light"]',
            title: 'Colors Light',
          },
        ],
      },
    },
  ],
});

await buildPlatform({
  buildPath: `${buildDir}${path.sep}`,
  source: [path.join(sourceDir, 'color', 'Dark.tokens.json')],
  files: [
    {
      destination: 'themes-dark.css',
      format: cssVariablesFormatName,
      options: {
        sections: [
          {
            filter: () => true,
            layerName: themeLayerName,
            presenter: 'Color',
            selector: '[data-theme="dark"]',
            title: 'Colors Dark',
          },
        ],
      },
    },
  ],
});

const themeCss = [
  await fs.readFile(path.join(buildDir, 'themes-light.css'), 'utf8'),
  '',
  await fs.readFile(path.join(buildDir, 'themes-dark.css'), 'utf8'),
].join('\n');

await fs.writeFile(path.join(buildDir, 'themes.css'), themeCss);
const tokensCss = await fs.readFile(path.join(buildDir, 'tokens.css'), 'utf8');
const layeredTokensCss = withSharedLayerPrelude(tokensCss);
const layeredThemeCss = withSharedLayerPrelude(themeCss);

await fs.writeFile(path.join(distDir, 'tokens.css'), layeredTokensCss);
await fs.writeFile(path.join(distDir, 'themes.css'), layeredThemeCss);

if (!tokensOnly) {
  await copyDistFontAssets();

  const baseStyles = await compileScss({
    entry: stylesEntry,
    outputFile: path.join(distDir, 'styles.css'),
  });
  await fs.writeFile(path.join(buildDir, 'base.css'), baseStyles);
  const fullStylesheet = [sharedLayerPrelude, '', tokensCss, '', themeCss, '', baseStyles]
    .filter(Boolean)
    .join('\n');
  await fs.writeFile(path.join(distDir, 'styles.css'), fullStylesheet);

  const typographyStyles = await compileScss({
    entry: typographyStylesEntry,
    includeLayerPrelude: true,
    outputFile: path.join(distDir, 'typography.css'),
  });
  await fs.writeFile(path.join(distDir, 'typography.css'), typographyStyles);

  const fontsStyles = await compileScss({
    entry: fontsStylesEntry,
    outputFile: path.join(distDir, 'fonts.css'),
  });
  await fs.writeFile(path.join(distDir, 'fonts.css'), fontsStyles);
}
