import { cva, type VariantProps } from 'class-variance-authority';

import type { LoadingColor, LoadingSize } from './loading.shared';

export const progressVariants = cva('progress', {
  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
  variants: {
    color: {
      primary: 'progress--primary',
      secondary: 'progress--secondary',
      'on-fill': 'progress--on-fill',
    } satisfies Record<LoadingColor, string>,
    size: {
      small: 'progress--small',
      medium: 'progress--medium',
      large: 'progress--large',
    } satisfies Record<LoadingSize, string>,
  },
});

export type ProgressVariantProps = VariantProps<typeof progressVariants>;
