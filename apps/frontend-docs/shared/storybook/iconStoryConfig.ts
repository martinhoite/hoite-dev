import {
  type IconName,
  type IconRotation,
  type IconSize,
  type IconVariant,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from '@hoite-dev/ui';

import { createFrontendDocsComponentSnippet } from './playgroundSnippets.ts';
import { createFrontendDocsPlaygroundControls, normalizeStoryValue } from './storyArgUtils.ts';

type FrontendDocsSnippetFramework = 'react' | 'vue';

export type IconStoryArgs = {
  name: IconName;
  rotation: IconRotation;
  size: IconSize;
  variant: IconVariant;
};

export const defaultIconStoryArgs: IconStoryArgs = {
  name: 'chevron',
  rotation: '0',
  size: 'md',
  variant: 'primary',
};

export const iconPlaygroundControlInclude = [
  'name',
  'size',
  'rotation',
  'variant',
] as const satisfies readonly (keyof IconStoryArgs)[];

export const iconPlaygroundInfoText =
  'Meaningful icons need label or aria-label. Supported passthroughs: id, title, role, aria-label, and deliberate data-* attributes.';

export function createIconPlaygroundControls() {
  return createFrontendDocsPlaygroundControls(iconPlaygroundControlInclude);
}

export function getIconPlaygroundSurfaceClass(variant: IconVariant | undefined): string {
  if (variant === 'on-fill') {
    return 'inline-flex w-fit items-center rounded-xl bg-[var(--color-bg-brand)] p-4';
  }

  return 'inline-flex w-fit items-center rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4';
}

export function getIconShowcaseSurfaceClass(variant: IconVariant): string {
  if (variant === 'on-fill') {
    return 'grid min-h-28 place-items-center rounded-xl bg-[var(--color-bg-brand)] p-4 text-[var(--color-text-on-fill)]';
  }

  return 'grid min-h-28 place-items-center rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4 text-[var(--color-text-primary)]';
}

export function normalizeIconStoryArgs(args: IconStoryArgs): IconStoryArgs {
  return {
    name: normalizeStoryValue(args.name, supportedIconNames, defaultIconStoryArgs.name),
    rotation: normalizeStoryValue(
      args.rotation,
      supportedIconRotations,
      defaultIconStoryArgs.rotation,
    ),
    size: normalizeStoryValue(args.size, supportedIconSizes, defaultIconStoryArgs.size),
    variant: normalizeStoryValue(args.variant, supportedIconVariants, defaultIconStoryArgs.variant),
  };
}

export function createIconPlaygroundSnippet(
  framework: FrontendDocsSnippetFramework,
  args: IconStoryArgs,
): string {
  const normalizedArgs = normalizeIconStoryArgs(args);

  return createFrontendDocsComponentSnippet({
    componentName: 'Icon',
    framework,
    props: [
      {
        name: 'label',
        value: 'Playground icon',
      },
      {
        name: 'name',
        value: normalizedArgs.name,
      },
      {
        name: 'rotation',
        value: normalizedArgs.rotation,
      },
      {
        name: 'size',
        value: normalizedArgs.size,
      },
      {
        name: 'variant',
        value: normalizedArgs.variant,
      },
    ],
  });
}
