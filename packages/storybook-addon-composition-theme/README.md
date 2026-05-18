# `@hoite-dev/storybook-addon-composition-theme`

Storybook addon for deterministic composition-theme control in manager and preview documents.

This package provides:
- a toolbar tool
- preview setup
- preset hooks for manager/preview bootstrap
- config helpers and validation

Consumer apps provide theme values and storage keys. Runtime state is owned by `localStorage` + root attribute application.

## Install

```bash
pnpm add -D @hoite-dev/storybook-addon-composition-theme
```

## Quick start

1. Define a config in your Storybook app (or shared Storybook config module).
2. Register the addon in `.storybook/main.ts` with that config as `options`.
3. Keep your theme CSS keyed off `html[data-theme="<theme-id>"]` (or your configured attribute).

### Example config (`light-dark`)

```ts
import { defineCompositionThemeConfig } from '@hoite-dev/storybook-addon-composition-theme';

export const compositionThemeConfig = defineCompositionThemeConfig({
  kind: 'light-dark',
  storageKey: 'my-docs:theme',
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
```

### Register in Storybook

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import { compositionThemeConfig } from './compositionThemeConfig';

const config: StorybookConfig = {
  addons: [
    {
      name: '@hoite-dev/storybook-addon-composition-theme',
      options: compositionThemeConfig,
    },
  ],
};

export default config;
```

## Config modes

### `kind: 'light-dark'`

- Requires `lightTheme` and `darkTheme`
- Uses system preference once as fallback when storage is empty/invalid
- Supports `toolbar.control: 'toggle' | 'buttons'`
- `toggle` is default
- Uses package-owned sun/moon icons

### `kind: 'custom'`

- Requires `themes`
- Requires exactly one fallback strategy:
  - `defaultTheme`, or
  - `systemFallback`
- Supports `toolbar.control: 'dropdown' | 'buttons'`
- `dropdown` is default
- Does not support `toggle`

Example:

```ts
import { defineCompositionThemeConfig } from '@hoite-dev/storybook-addon-composition-theme';

export const compositionThemeConfig = defineCompositionThemeConfig({
  kind: 'custom',
  storageKey: 'my-docs:theme',
  themes: [
    { id: 'brand-light', label: 'Brand light' },
    { id: 'brand-dark', label: 'Brand dark' },
    { id: 'high-contrast', label: 'High contrast' },
  ],
  systemFallback: {
    light: 'brand-light',
    dark: 'brand-dark',
  },
  toolbar: {
    control: 'dropdown',
    label: 'Theme',
  },
});
```

## Runtime model

- Authoritative state: `localStorage`
- Applied target: root document attribute (default `data-theme`)
- Documents covered:
  - Storybook manager document
  - Active preview iframe document
  - Composed ref preview iframe documents
- Bootstrap runs early in both manager and preview head to reduce initial flash
- Manager runtime reapplies the current theme when preview/ref iframes load, reconnect, or return from a restored tab
- No live system preference listeners

Theme resolution order:
1. Valid stored theme
2. `light-dark`: one-time `prefers-color-scheme` fallback
3. `custom` + `defaultTheme`
4. `custom` + `systemFallback` (one-time `prefers-color-scheme` fallback)

## Public API

Main entry:
- `defineCompositionThemeConfig`
- `createCompositionThemeBootstrapScript`
- `registerCompositionThemeTool`
- `setupCompositionThemePreview`
- `CompositionThemeConfig` and related types

Subpath exports:
- `@hoite-dev/storybook-addon-composition-theme/preset`
- `@hoite-dev/storybook-addon-composition-theme/manager`
- `@hoite-dev/storybook-addon-composition-theme/preview`

## Notes

- Keep theme ownership outside stories and MDX pages. Stories should not own theme state.
- If your app still uses class-based wrapper theming (for example `.theme--dark`), migrate to root-attribute selectors for the cleanest integration.
