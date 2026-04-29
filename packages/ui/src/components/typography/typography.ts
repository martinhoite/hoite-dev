import { cva, type VariantProps } from 'class-variance-authority';

export const supportedTypographyTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;

export const supportedTypographyVariants = {
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
export type TypographyVariant = keyof typeof supportedTypographyVariants;
export type TypographyDefaultTag =
  (typeof supportedTypographyVariants)[TypographyVariant]['defaultTag'];

export const typographyVariants = cva('typography', {
  variants: {
    variant: {
      'display-large': 'typography--display-large',
      'heading-large': 'typography--heading-large',
      'heading-medium': 'typography--heading-medium',
      'body-large': 'typography--body-large',
      'body-medium': 'typography--body-medium',
      'label-medium': 'typography--label-medium',
      'caption-small': 'typography--caption-small',
    },
  },
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export function resolveTypographyDefaultTag(variant: TypographyVariant): TypographyDefaultTag {
  return supportedTypographyVariants[variant].defaultTag;
}
