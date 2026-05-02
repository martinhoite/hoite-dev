import darkColorMode from './tokens/source/color/Dark.tokens.json';
import lightColorMode from './tokens/source/color/Light.tokens.json';
import layoutTokens from './tokens/source/layout/Value.tokens.json';
import motionTokens from './tokens/source/motion/Value.tokens.json';
import primitivesTokens from './tokens/source/primitives/Value.tokens.json';
import radiusTokens from './tokens/source/radius/Value.tokens.json';
import sizingTokens from './tokens/source/sizing/Value.tokens.json';
import spacingTokens from './tokens/source/spacing/Value.tokens.json';
import strokeTokens from './tokens/source/stroke/Value.tokens.json';
import typographyTokens from './tokens/source/typography/Value.tokens.json';

export {
  iconDefinitions,
  iconVariants,
  resolveIconDefinition,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from './components/primitives/static/icon';

export {
  resolveTypographyDefaultTag,
  supportedTypographyTags,
  supportedTypographyVariants,
  typographyVariants,
} from './components/primitives/static/typography';

export const themeNames = ['light', 'dark'] as const;
export const remBasePx = 16 as const;

export const tokens = {
  color: {
    light: lightColorMode.color,
    dark: darkColorMode.color,
  },
  layout: layoutTokens.layout,
  motion: motionTokens.motion,
  primitives: primitivesTokens,
  radius: radiusTokens.radius,
  size: sizingTokens.size,
  spacing: spacingTokens.spacing,
  stroke: strokeTokens,
  typography: typographyTokens.typography,
} as const;

export const tokenThemes = tokens.color;
const fontFamilyStacks = {
  'typography.family.body': "'Roboto', Arial, Helvetica, sans-serif",
  'typography.family.heading': "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

export const tokenUnitPolicies = {
  layout: {
    grid: 'unitless',
    gutter: 'rem',
    'grid-container': 'rem',
  },
  motion: {
    duration: 'ms',
    easing: 'string',
  },
  primitives: 'color',
  radius: 'px',
  size: 'rem',
  spacing: 'rem',
  stroke: 'px',
  typography: {
    family: 'string',
    'letter-spacing': 'rem',
    'line-height': 'rem',
    'paragraph-spacing': 'rem',
    size: 'rem',
    weight: 'unitless',
  },
} as const;

const trimNumber = (value: number): string => Number.parseFloat(value.toFixed(4)).toString();

const pxToRem = (value: number): string => `${trimNumber(value / remBasePx)}rem`;

export function resolveCssTokenValue(
  path: readonly string[],
  value: string | number,
): string | number {
  const pathKey = path.join('.');

  if (typeof value === 'string') {
    if (pathKey in fontFamilyStacks) {
      return fontFamilyStacks[pathKey as keyof typeof fontFamilyStacks];
    }

    return value;
  }

  if (pathKey.startsWith('spacing.')) {
    return pxToRem(value);
  }

  if (
    pathKey.startsWith('layout.gutter.') ||
    pathKey.startsWith('layout.grid-container.') ||
    pathKey.startsWith('size.')
  ) {
    return pxToRem(value);
  }

  if (pathKey.startsWith('radius.')) {
    return `${value}px`;
  }

  if (pathKey.startsWith('border.') || pathKey.startsWith('outline.')) {
    return `${value}px`;
  }

  if (pathKey.startsWith('motion.duration.')) {
    return `${value}ms`;
  }

  if (
    pathKey.startsWith('typography.size.') ||
    pathKey.startsWith('typography.line-height.') ||
    pathKey.startsWith('typography.letter-spacing.') ||
    pathKey.startsWith('typography.paragraph-spacing.')
  ) {
    return pxToRem(value);
  }

  return value;
}

export type ThemeName = (typeof themeNames)[number];
export type Tokens = typeof tokens;
export type {
  IconDefinition,
  IconName,
  IconRotation,
  IconSize,
  IconVariant,
  IconVariantProps,
} from './components/primitives/static/icon';
export type {
  TypographyDefaultTag,
  TypographyTag,
  TypographyVariant,
  TypographyVariantProps,
} from './components/primitives/static/typography';
export type ColorThemeTokens = (typeof tokenThemes)[ThemeName];
export type LayoutTokens = typeof tokens.layout;
export type MotionTokens = typeof tokens.motion;
export type PrimitiveTokens = typeof tokens.primitives;
export type RadiusTokens = typeof tokens.radius;
export type SizeTokens = typeof tokens.size;
export type SpacingTokens = typeof tokens.spacing;
export type StrokeTokens = typeof tokens.stroke;
export type TypographyTokens = typeof tokens.typography;
