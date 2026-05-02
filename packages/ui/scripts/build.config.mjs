import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, '..');
const rootDir = path.resolve(packageDir, '../..');
const buildDir = path.join(packageDir, '.build', 'generated');
const distDir = path.join(packageDir, 'dist');
const sourceDir = path.join(packageDir, 'src', 'tokens', 'source');
const fontAssetsDir = path.join(packageDir, 'src', 'assets', 'fonts');

const layerNamePrefix = 'tokens';
const themeLayerName = `${layerNamePrefix}.theme`;

export const buildContext = {
  buildDir,
  distDir,
  fontAssetsDir,
  packageDir,
  rootDir,
  sourceDir,
};

export const tokensOnly = process.argv.includes('--tokens-only');

export const tokenConfig = {
  cssValueTransformName: 'hoite/value/web',
  cssVariablesFormatName: 'hoite/css/variables',
  fontFamilyStacks: {
    'typography.family.body': "'Roboto', Arial, Helvetica, sans-serif",
    'typography.family.heading': "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  layerNamePrefix,
  pathNamedTokenRoots: new Set(['color', 'motion', 'radius', 'size', 'spacing', 'typography']),
  remBasePx: 16,
  themeLayerName,
};

export const sectionDefinitions = [
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

export const tokenSources = [
  'layout/Value.tokens.json',
  'motion/Value.tokens.json',
  'primitives/Value.tokens.json',
  'radius/Value.tokens.json',
  'sizing/Value.tokens.json',
  'spacing/Value.tokens.json',
  'stroke/Value.tokens.json',
  'typography/Value.tokens.json',
];

export const themeVariants = [
  {
    destination: 'themes-light.css',
    selector: ':root, [data-theme="light"]',
    source: 'color/Light.tokens.json',
    title: 'Colors Light',
  },
  {
    destination: 'themes-dark.css',
    selector: '[data-theme="dark"]',
    source: 'color/Dark.tokens.json',
    title: 'Colors Dark',
  },
];

export const styleBundles = [
  {
    buildArtifact: 'base.css',
    composeWithTokensAndThemes: true,
    entry: path.join(packageDir, 'src', 'styles', 'index.scss'),
    output: 'styles.css',
  },
  {
    entry: path.join(packageDir, 'src', 'styles', 'fonts.scss'),
    output: 'fonts.css',
  },
  {
    entry: path.join(
      packageDir,
      'src',
      'components',
      'primitives',
      'static',
      'typography',
      'typography.scss',
    ),
    includeLayerPrelude: true,
    output: 'typography.css',
  },
];

export const distFontAssets = [
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
