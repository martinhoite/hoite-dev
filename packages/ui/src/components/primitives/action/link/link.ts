import { cva, cx } from 'class-variance-authority';

import { buttonVariants } from '../button';

export const supportedLinkAppearances = ['link', 'button'] as const;

export type LinkAppearance = (typeof supportedLinkAppearances)[number];

const textLinkVariants = cva('link link--text');

export type LinkVariantProps = {
  appearance?: LinkAppearance | null | undefined;
};

type LinkVariantOptions = LinkVariantProps & {
  class?: Parameters<typeof cx>[0];
  className?: Parameters<typeof cx>[0];
};

export function linkVariants({
  appearance = 'link',
  class: classValue,
  className,
}: LinkVariantOptions = {}): string {
  if (appearance === 'button') {
    return buttonVariants({
      class: cx('link--button', classValue, className),
    });
  }

  return textLinkVariants({
    class: cx(classValue, className),
  });
}
