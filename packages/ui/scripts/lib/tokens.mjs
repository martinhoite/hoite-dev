import fs from 'node:fs/promises';
import path from 'node:path';

import StyleDictionary from 'style-dictionary';
import { transforms, transformTypes } from 'style-dictionary/enums';

let isRegistered = false;
let missingWebSyntaxErrors = new Set();
let unexpectedWebSyntaxMismatchWarnings = new Set();

function trimNumber(value) {
  return Number.parseFloat(value.toFixed(4)).toString();
}

function pxToRem(value, remBasePx) {
  return `${trimNumber(value / remBasePx)}rem`;
}

function getPathDerivedCssName(token) {
  return token.name;
}

function isIntentionalNameMapping(token, webCssName) {
  const [root, group] = token.path;

  if (
    root === 'layout' &&
    group === 'grid-container' &&
    webCssName.startsWith('layout-container-')
  ) {
    return true;
  }

  if ((root === 'border' || root === 'outline') && webCssName.startsWith('stroke-')) {
    return true;
  }

  if (token.$type === 'color' && root !== 'color' && webCssName.startsWith('primitive-')) {
    return true;
  }

  return false;
}

function getTokenCssName(token, _tokenConfig) {
  const webSyntax = token.$extensions?.['com.figma.codeSyntax']?.WEB;
  const tokenPath = token.path.join('.');

  if (typeof webSyntax === 'string') {
    const match = webSyntax.match(/^var\(--(?<name>[^)]+)\)$/);

    if (match?.groups?.name) {
      const webCssName = match.groups.name;
      const pathCssName = getPathDerivedCssName(token);

      if (webCssName !== pathCssName && !isIntentionalNameMapping(token, webCssName)) {
        unexpectedWebSyntaxMismatchWarnings.add(
          `${tokenPath} => --${pathCssName} (path) vs --${webCssName} (WEB)`,
        );
      }

      return webCssName;
    }
  }

  if (!missingWebSyntaxErrors.has(tokenPath)) {
    missingWebSyntaxErrors.add(tokenPath);
  }

  return token.name;
}

function formatStringValue(pathSegments, value, tokenConfig) {
  const pathKey = pathSegments.join('.');

  if (pathKey in tokenConfig.fontFamilyStacks) {
    return tokenConfig.fontFamilyStacks[pathKey];
  }

  if (pathKey.startsWith('typography.family.') && /\s/.test(value)) {
    return `'${value}'`;
  }

  return value;
}

function formatCssValue(token, tokenConfig) {
  if (typeof token.$value === 'string') {
    return formatStringValue(token.path, token.$value, tokenConfig);
  }

  if (typeof token.$value !== 'number') {
    return token.$value;
  }

  const pathKey = token.path.join('.');

  if (
    pathKey === 'size.loading.progress-indeterminate-segment' ||
    pathKey === 'size.loading.progress-reduced-motion-segment'
  ) {
    return `${token.$value}%`;
  }

  if (pathKey.startsWith('spacing.')) {
    return pxToRem(token.$value, tokenConfig.remBasePx);
  }

  if (
    pathKey.startsWith('layout.gutter.') ||
    pathKey.startsWith('layout.grid-container.') ||
    pathKey.startsWith('size.')
  ) {
    return pxToRem(token.$value, tokenConfig.remBasePx);
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
    return pxToRem(token.$value, tokenConfig.remBasePx);
  }

  if (pathKey.startsWith('typography.weight.')) {
    return token.$value;
  }

  return token.$value;
}

function getSectionKey(pathSegments) {
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
}

function getSectionKeyForToken(token, tokenConfig) {
  const sectionKey = getSectionKey(token.path);

  if (sectionKey !== token.path[0]) {
    return sectionKey;
  }

  const cssName = getTokenCssName(token, tokenConfig);

  if (cssName.startsWith('primitive-')) {
    return 'primitive';
  }

  if (cssName.startsWith('stroke-')) {
    return 'stroke';
  }

  return sectionKey;
}

function registerStyleDictionaryExtensions({ tokenConfig }) {
  if (isRegistered) {
    return;
  }

  StyleDictionary.registerTransform({
    filter: (token) =>
      typeof token.$value === 'number' ||
      typeof token.$value === 'string' ||
      token.$type === 'fontFamily' ||
      token.$type === 'cubicBezier',
    name: tokenConfig.cssValueTransformName,
    transform: (token) => formatCssValue(token, tokenConfig),
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
${section.tokens
  .map((token) => {
    const cssName = getTokenCssName(token, tokenConfig);
    const pathCssName = getPathDerivedCssName(token);
    const pathString = token.path.join('.');
    const isIntentionalMismatch =
      cssName !== pathCssName && isIntentionalNameMapping(token, cssName);

    if (isIntentionalMismatch) {
      return `    /* alias: ${pathString} => --${cssName} (path name would be --${pathCssName}) */\n    --${cssName}: ${token.$value};`;
    }

    return `    --${cssName}: ${token.$value};`;
  })
  .join('\n')}
  }
}`,
        )
        .join('\n\n');
    },
    name: tokenConfig.cssVariablesFormatName,
  });

  isRegistered = true;
}

async function buildPlatform({ buildPath, files, source, tokenConfig }) {
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
          tokenConfig.cssValueTransformName,
        ],
        files,
      },
    },
  });

  await dictionary.buildPlatform('css');
}

export function createSharedLayerPrelude({ sectionDefinitions, themeLayerName }) {
  const sharedLayerOrder = [
    ...sectionDefinitions.map((section) => section.layerName),
    themeLayerName,
  ];
  return `@layer ${sharedLayerOrder.join(', ')};`;
}

export function withSharedLayerPrelude(css, sharedLayerPrelude) {
  return [sharedLayerPrelude, css].filter(Boolean).join('\n\n');
}

export async function buildTokenArtifacts({
  buildDir,
  distDir,
  sectionDefinitions,
  sourceDir,
  themeVariants,
  tokenConfig,
  tokenSources,
}) {
  missingWebSyntaxErrors = new Set();
  unexpectedWebSyntaxMismatchWarnings = new Set();
  registerStyleDictionaryExtensions({ tokenConfig });

  const buildPath = `${buildDir}${path.sep}`;

  await buildPlatform({
    buildPath,
    files: [
      {
        destination: 'tokens.css',
        format: tokenConfig.cssVariablesFormatName,
        options: {
          sections: sectionDefinitions.map((section) => ({
            ...section,
            filter: (token) => getSectionKeyForToken(token, tokenConfig) === section.key,
          })),
        },
      },
    ],
    source: tokenSources.map((tokenSource) => path.join(sourceDir, tokenSource)),
    tokenConfig,
  });

  for (const themeVariant of themeVariants) {
    await buildPlatform({
      buildPath,
      files: [
        {
          destination: themeVariant.destination,
          format: tokenConfig.cssVariablesFormatName,
          options: {
            sections: [
              {
                filter: () => true,
                layerName: tokenConfig.themeLayerName,
                presenter: 'Color',
                selector: themeVariant.selector,
                title: themeVariant.title,
              },
            ],
          },
        },
      ],
      source: [path.join(sourceDir, themeVariant.source)],
      tokenConfig,
    });
  }

  if (missingWebSyntaxErrors.size > 0) {
    const missingLines = [...missingWebSyntaxErrors]
      .sort((a, b) => a.localeCompare(b))
      .map((tokenPath) => {
        return `- ${tokenPath}`;
      })
      .join('\n');

    throw new Error(
      `[ui tokens] Missing or invalid $extensions["com.figma.codeSyntax"].WEB on ${missingWebSyntaxErrors.size} token(s):\n${missingLines}`,
    );
  }

  if (unexpectedWebSyntaxMismatchWarnings.size > 0) {
    const mismatchLines = [...unexpectedWebSyntaxMismatchWarnings]
      .sort((a, b) => a.localeCompare(b))
      .map((line) => {
        return `- ${line}`;
      })
      .join('\n');

    console.warn(
      `[ui tokens] Unhandled WEB syntax naming mismatch on ${unexpectedWebSyntaxMismatchWarnings.size} token(s):\n${mismatchLines}`,
    );
  }

  const sharedLayerPrelude = createSharedLayerPrelude({
    sectionDefinitions,
    themeLayerName: tokenConfig.themeLayerName,
  });
  const themeCss = (
    await Promise.all(
      themeVariants.map((themeVariant) =>
        fs.readFile(path.join(buildDir, themeVariant.destination), 'utf8'),
      ),
    )
  ).join('\n\n');

  await fs.writeFile(path.join(buildDir, 'themes.css'), themeCss);

  const tokensCss = await fs.readFile(path.join(buildDir, 'tokens.css'), 'utf8');
  const layeredTokensCss = withSharedLayerPrelude(tokensCss, sharedLayerPrelude);
  const layeredThemeCss = withSharedLayerPrelude(themeCss, sharedLayerPrelude);

  await fs.writeFile(path.join(distDir, 'tokens.css'), layeredTokensCss);
  await fs.writeFile(path.join(distDir, 'themes.css'), layeredThemeCss);

  return {
    sharedLayerPrelude,
    themeCss,
    tokensCss,
    withSharedLayerPrelude: (css) => withSharedLayerPrelude(css, sharedLayerPrelude),
  };
}
