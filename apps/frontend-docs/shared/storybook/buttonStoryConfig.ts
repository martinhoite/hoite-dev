import {
  type ButtonSize,
  type ButtonVariant,
  type IconName,
  supportedButtonSizes,
  supportedButtonVariants,
  supportedIconNames,
} from '@hoite-dev/ui';

import { createFrontendDocsComponentSnippet } from './playgroundSnippets.ts';
import {
  createFrontendDocsPlaygroundControls,
  normalizeOptionalStoryValue,
  normalizeStoryValue,
} from './storyArgUtils.ts';

type FrontendDocsSnippetFramework = 'react' | 'vue';

export type ButtonStoryArgs = {
  children: string;
  disabled: boolean;
  isLoading: boolean;
  leadingIcon?: IconName;
  loadingLabel: string;
  preventLoadingShrink: boolean;
  size: ButtonSize;
  trailingIcon?: IconName;
  variant: ButtonVariant;
};

export const defaultButtonStoryArgs: ButtonStoryArgs = {
  children: 'Primary action',
  disabled: false,
  isLoading: false,
  loadingLabel: '',
  preventLoadingShrink: false,
  size: 'medium',
  variant: 'primary',
};

export const buttonPlaygroundControlInclude = [
  'children',
  'variant',
  'size',
  'leadingIcon',
  'trailingIcon',
  'isLoading',
  'loadingLabel',
  'preventLoadingShrink',
  'disabled',
] as const satisfies readonly (keyof ButtonStoryArgs)[];

export const buttonPlaygroundInfoText =
  'Button renders a native <button>, defaults to type="button", and keeps loading state disabled with aria-busy.';

export function createButtonPlaygroundControls() {
  return createFrontendDocsPlaygroundControls(buttonPlaygroundControlInclude);
}

export function normalizeButtonStoryArgs(args: ButtonStoryArgs): ButtonStoryArgs {
  return {
    ...args,
    leadingIcon: normalizeOptionalStoryValue(args.leadingIcon, supportedIconNames),
    size: normalizeStoryValue(args.size, supportedButtonSizes, defaultButtonStoryArgs.size),
    trailingIcon: normalizeOptionalStoryValue(args.trailingIcon, supportedIconNames),
    variant: normalizeStoryValue(
      args.variant,
      supportedButtonVariants,
      defaultButtonStoryArgs.variant,
    ),
  };
}

export function createButtonPlaygroundSnippet(
  framework: FrontendDocsSnippetFramework,
  args: ButtonStoryArgs,
): string {
  const normalizedArgs = normalizeButtonStoryArgs(args);

  return createFrontendDocsComponentSnippet({
    children: normalizedArgs.children,
    componentName: 'Button',
    framework,
    props: [
      {
        defaultValue: defaultButtonStoryArgs.variant,
        name: 'variant',
        value: normalizedArgs.variant,
      },
      {
        defaultValue: defaultButtonStoryArgs.size,
        name: 'size',
        value: normalizedArgs.size,
      },
      {
        name: 'leadingIcon',
        value: normalizedArgs.leadingIcon,
      },
      {
        name: 'trailingIcon',
        value: normalizedArgs.trailingIcon,
      },
      {
        defaultValue: false,
        name: 'isLoading',
        value: normalizedArgs.isLoading,
      },
      {
        name: 'loadingLabel',
        value: normalizedArgs.loadingLabel,
      },
      {
        defaultValue: false,
        name: 'preventLoadingShrink',
        value: normalizedArgs.preventLoadingShrink,
      },
      {
        defaultValue: false,
        name: 'disabled',
        value: normalizedArgs.disabled,
      },
    ],
  });
}
