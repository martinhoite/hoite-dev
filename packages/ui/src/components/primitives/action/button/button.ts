import { cva, type VariantProps } from 'class-variance-authority';

export const supportedButtonVariants = ['primary', 'secondary'] as const;
export const supportedButtonSizes = ['small', 'medium', 'large'] as const;

export type ButtonVariant = (typeof supportedButtonVariants)[number];
export type ButtonSize = (typeof supportedButtonSizes)[number];

export const buttonVariants = cva('button', {
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
  variants: {
    size: {
      small: 'button--small',
      medium: 'button--medium',
      large: 'button--large',
    } satisfies Record<ButtonSize, string>,
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
    } satisfies Record<ButtonVariant, string>,
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
