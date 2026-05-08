import { cva, type VariantProps } from 'class-variance-authority';

export const supportedTypographyTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;

export const typographyVariantConfig = {
  'display-large': {
    defaultTag: 'h1',
  },
  'heading-large': {
    defaultTag: 'h2',
  },
  'heading-medium': {
    defaultTag: 'h3',
  },
  'body-large': {
    defaultTag: 'p',
  },
  'body-medium': {
    defaultTag: 'p',
  },
  'label-medium': {
    defaultTag: 'span',
  },
  'caption-small': {
    defaultTag: 'span',
  },
} as const;

export type TypographyTag = (typeof supportedTypographyTags)[number];
export type TypographyVariant = keyof typeof typographyVariantConfig;
export type TypographyDefaultTag =
  (typeof typographyVariantConfig)[TypographyVariant]['defaultTag'];

const typographyVariantClasses = Object.fromEntries(
  Object.keys(typographyVariantConfig).map((variant) => [variant, `typography--${variant}`]),
) as Record<TypographyVariant, string>;

export const typographyVariants = cva('typography', {
  variants: {
    variant: typographyVariantClasses,
  },
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export function resolveTypographyDefaultTag(variant: TypographyVariant): TypographyDefaultTag {
  return typographyVariantConfig[variant].defaultTag;
}
