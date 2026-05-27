import {
  type IconButtonSize,
  type IconButtonVariant,
  type IconName,
  supportedIconButtonSizes,
  supportedIconButtonVariants,
  supportedIconNames,
} from '@hoite-dev/ui';

import { createFrontendDocsComponentSnippet } from './playgroundSnippets.ts';
import { createFrontendDocsPlaygroundControls, normalizeStoryValue } from './storyArgUtils.ts';

type FrontendDocsSnippetFramework = 'react' | 'vue';

export type IconButtonStoryArgs = {
  'aria-label': string;
  disabled: boolean;
  icon: IconName;
  isLoading: boolean;
  size: IconButtonSize;
  variant: IconButtonVariant;
};

export const defaultIconButtonStoryArgs: IconButtonStoryArgs = {
  'aria-label': 'Create item',
  disabled: false,
  icon: 'plus',
  isLoading: false,
  size: 'medium',
  variant: 'primary',
};

export const iconButtonPlaygroundControlInclude = [
  'icon',
  'variant',
  'size',
  'isLoading',
  'disabled',
  'aria-label',
] as const satisfies readonly (keyof IconButtonStoryArgs)[];

export const iconButtonStateLabels = [
  'Default',
  'Hover',
  'Focused',
  'Pressed',
  'Disabled',
  'Loading',
] as const;

export const iconButtonPlaygroundInfoText =
  'IconButton renders a native <button> for icon-only actions and requires aria-label or aria-labelledby.';

export function createIconButtonPlaygroundControls() {
  return createFrontendDocsPlaygroundControls(iconButtonPlaygroundControlInclude);
}

export function normalizeIconButtonStoryArgs(args: IconButtonStoryArgs): IconButtonStoryArgs {
  return {
    ...args,
    icon: normalizeStoryValue(args.icon, supportedIconNames, defaultIconButtonStoryArgs.icon),
    size: normalizeStoryValue(args.size, supportedIconButtonSizes, defaultIconButtonStoryArgs.size),
    variant: normalizeStoryValue(
      args.variant,
      supportedIconButtonVariants,
      defaultIconButtonStoryArgs.variant,
    ),
  };
}

export function createIconButtonPlaygroundSnippet(
  framework: FrontendDocsSnippetFramework,
  args: IconButtonStoryArgs,
): string {
  const normalizedArgs = normalizeIconButtonStoryArgs(args);

  return createFrontendDocsComponentSnippet({
    componentName: 'IconButton',
    framework,
    props: [
      {
        defaultValue: defaultIconButtonStoryArgs.icon,
        name: 'icon',
        value: normalizedArgs.icon,
      },
      {
        defaultValue: defaultIconButtonStoryArgs.variant,
        name: 'variant',
        value: normalizedArgs.variant,
      },
      {
        defaultValue: defaultIconButtonStoryArgs.size,
        name: 'size',
        value: normalizedArgs.size,
      },
      {
        defaultValue: false,
        name: 'isLoading',
        value: normalizedArgs.isLoading,
      },
      {
        defaultValue: false,
        name: 'disabled',
        value: normalizedArgs.disabled,
      },
      {
        name: 'aria-label',
        value: normalizedArgs['aria-label'],
      },
    ],
  });
}
