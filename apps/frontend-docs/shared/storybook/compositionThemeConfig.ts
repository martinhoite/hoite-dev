import { defineCompositionThemeConfig } from '@hoite-dev/storybook-addon-composition-theme';

export const compositionThemeConfig = defineCompositionThemeConfig({
  kind: 'light-dark',
  storageKey: 'hoite-dev:frontend-docs:theme',
  attributeName: 'data-theme',
  lightTheme: {
    id: 'light',
    label: 'Light',
    title: 'Use light theme',
  },
  darkTheme: {
    id: 'dark',
    label: 'Dark',
    title: 'Use dark theme',
  },
  toolbar: {
    control: 'toggle',
    label: 'Theme',
  },
});
