import { cva, type VariantProps } from 'class-variance-authority';

import type { LoadingColor, LoadingSize } from './loading.shared';

export const loaderVariants = cva('loader', {
  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
  variants: {
    color: {
      primary: 'loader--primary',
      secondary: 'loader--secondary',
      'on-fill': 'loader--on-fill',
    } satisfies Record<LoadingColor, string>,
    size: {
      small: 'loader--small',
      medium: 'loader--medium',
      large: 'loader--large',
    } satisfies Record<LoadingSize, string>,
  },
});

export type LoaderVariantProps = VariantProps<typeof loaderVariants>;
