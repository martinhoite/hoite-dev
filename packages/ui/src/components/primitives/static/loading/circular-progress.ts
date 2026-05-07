import { cva, type VariantProps } from 'class-variance-authority';

import type { LoadingColor, LoadingSize } from './loading.shared';

export const circularProgressVariants = cva('circular-progress', {
  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
  variants: {
    color: {
      primary: 'circular-progress--primary',
      secondary: 'circular-progress--secondary',
      'on-fill': 'circular-progress--on-fill',
    } satisfies Record<LoadingColor, string>,
    size: {
      small: 'circular-progress--small',
      medium: 'circular-progress--medium',
      large: 'circular-progress--large',
    } satisfies Record<LoadingSize, string>,
  },
});

export type CircularProgressVariantProps = VariantProps<typeof circularProgressVariants>;
