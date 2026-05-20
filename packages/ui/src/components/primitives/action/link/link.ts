import { cva, cx } from 'class-variance-authority';

import { buttonVariants } from '../button';

export const supportedLinkAppearances = ['link', 'button'] as const;
export const supportedLinkRelTokens = [
  'noopener',
  'noreferrer',
  'nofollow',
  'ugc',
  'sponsored',
] as const;
export const supportedLinkTargets = ['_self', '_blank', '_parent', '_top'] as const;

export type LinkAppearance = (typeof supportedLinkAppearances)[number];
export type LinkRelToken = (typeof supportedLinkRelTokens)[number];
export type LinkRel = LinkRelToken | LinkRelToken[];
export type LinkTarget = (typeof supportedLinkTargets)[number];

const textLinkVariants = cva('link link--text');
const safeBlankRelTokens = ['noopener', 'noreferrer'] satisfies LinkRelToken[];

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

export function linkRelToString(rel?: LinkRel): string | undefined {
  if (!rel) {
    return undefined;
  }

  const relTokens = Array.isArray(rel) ? rel : [rel];
  const uniqueRelTokens = Array.from(new Set(relTokens));

  return uniqueRelTokens.length > 0 ? uniqueRelTokens.join(' ') : undefined;
}

export function resolveLinkRel(target?: LinkTarget, rel?: LinkRel): string | undefined {
  if (target !== '_blank') {
    return linkRelToString(rel);
  }

  if (rel !== undefined) {
    return linkRelToString(rel);
  }

  return linkRelToString(safeBlankRelTokens);
}
