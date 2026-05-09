import darkColorMode from './tokens/source/color/Dark.tokens.json';
import lightColorMode from './tokens/source/color/Light.tokens.json';
import layoutTokens from './tokens/source/layout/Value.tokens.json';
import motionTokens from './tokens/source/motion/Value.tokens.json';
import primitiveTokens from './tokens/source/primitive/Value.tokens.json';
import radiusTokens from './tokens/source/radius/Value.tokens.json';
import sizingTokens from './tokens/source/sizing/Value.tokens.json';
import spacingTokens from './tokens/source/spacing/Value.tokens.json';
import strokeTokens from './tokens/source/stroke/Value.tokens.json';
import typographyTokens from './tokens/source/typography/Value.tokens.json';

export {
  iconDefinitions,
  iconDocs,
  iconVariants,
  resolveIconDefinition,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from './components/primitives/static/icon';

export {
  circularProgressVariants,
  describeProgressNormalizationWarning,
  loaderVariants,
  loadingDocs,
  normalizeProgressValue,
  progressVariants,
  supportedLoadingColors,
  supportedLoadingSizes,
} from './components/primitives/static/loading';

export {
  resolveTypographyDefaultTag,
  supportedTypographyTags,
  typographyDocs,
  typographyVariantConfig,
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
  primitive: primitiveTokens.primitive,
  radius: radiusTokens.radius,
  size: sizingTokens.size,
  spacing: spacingTokens.spacing,
  stroke: strokeTokens,
  typography: typographyTokens.typography,
} as const;

export const tokenThemes = tokens.color;

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
  CircularProgressVariantProps,
  LoaderVariantProps,
  LoadingColor,
  LoadingSize,
  NormalizedProgressValue,
  ProgressNormalizationInput,
  ProgressNormalizationWarningReason,
  ProgressVariantProps,
} from './components/primitives/static/loading';
export type {
  TypographyDefaultTag,
  TypographyTag,
  TypographyVariant,
  TypographyVariantProps,
} from './components/primitives/static/typography';
export type ColorThemeTokens = (typeof tokenThemes)[ThemeName];
export type LayoutTokens = typeof tokens.layout;
export type MotionTokens = typeof tokens.motion;
export type PrimitiveTokens = typeof tokens.primitive;
export type RadiusTokens = typeof tokens.radius;
export type SizeTokens = typeof tokens.size;
export type SpacingTokens = typeof tokens.spacing;
export type StrokeTokens = typeof tokens.stroke;
export type TypographyTokens = typeof tokens.typography;
