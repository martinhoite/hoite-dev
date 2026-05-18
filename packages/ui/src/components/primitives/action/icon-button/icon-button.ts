import { cva, type VariantProps } from 'class-variance-authority';

export const supportedIconButtonVariants = ['primary', 'secondary'] as const;
export const supportedIconButtonSizes = ['small', 'medium', 'large'] as const;

export type IconButtonVariant = (typeof supportedIconButtonVariants)[number];
export type IconButtonSize = (typeof supportedIconButtonSizes)[number];

export const iconButtonVariants = cva('icon-button', {
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
  variants: {
    size: {
      small: 'icon-button--small',
      medium: 'icon-button--medium',
      large: 'icon-button--large',
    } satisfies Record<IconButtonSize, string>,
    variant: {
      primary: 'icon-button--primary',
      secondary: 'icon-button--secondary',
    } satisfies Record<IconButtonVariant, string>,
  },
});

export type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;
