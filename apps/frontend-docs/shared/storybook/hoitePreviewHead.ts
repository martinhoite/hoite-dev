import { createHoiteStorybookColorValues } from './hoiteStorybookThemeColors.ts';

function createHoitePreviewBootstrapStyles() {
  const darkColors = createHoiteStorybookColorValues('dark');
  const lightColors = createHoiteStorybookColorValues('light');

  return `
<style data-hoite-preview-theme-bootstrap>
  html[data-theme="dark"] {
    color-scheme: dark;
    --hoite-storybook-loading-canvas: ${darkColors.appPreviewBg};
    --hoite-storybook-loading-surface: ${darkColors.barBg};
    --hoite-storybook-loading-border: ${darkColors.appBorderColor};
    --hoite-storybook-loading-fill: ${darkColors.booleanBg};
  }

  html[data-theme="light"] {
    color-scheme: light;
    --hoite-storybook-loading-canvas: ${lightColors.appPreviewBg};
    --hoite-storybook-loading-surface: ${lightColors.booleanBg};
    --hoite-storybook-loading-border: ${lightColors.appBorderColor};
    --hoite-storybook-loading-fill: ${lightColors.barBg};
  }

  html[data-theme],
  html[data-theme] body,
  html[data-theme] .sb-preparing-story,
  html[data-theme] .sb-preparing-docs {
    background: var(--hoite-storybook-loading-canvas);
  }

  html[data-theme] .sb-previewBlock,
  html[data-theme] .sb-argstableBlock-body td {
    background: var(--hoite-storybook-loading-surface);
  }

  html[data-theme] .sb-previewBlock {
    border-color: var(--hoite-storybook-loading-border);
    box-shadow: none;
  }

  html[data-theme] .sb-previewBlock_header {
    box-shadow: inset 0 -1px 0 var(--hoite-storybook-loading-border);
  }

  html[data-theme] .sb-previewBlock_icon,
  html[data-theme] .sb-argstableBlock th span,
  html[data-theme] .sb-argstableBlock td span,
  html[data-theme] .sb-argstableBlock-body button {
    background-color: var(--hoite-storybook-loading-fill);
  }

  html[data-theme] .sb-argstableBlock-body {
    box-shadow:
      0 0 0 1px var(--hoite-storybook-loading-border),
      0 1px 3px 0 rgb(0 0 0 / 12%);
  }

  html[data-theme] .sb-argstableBlock-body tr:not(:first-child) {
    border-top-color: var(--hoite-storybook-loading-border);
  }
</style>
`;
}

export function withHoitePreviewHead(head: string = ''): string {
  return `${head}
${createHoitePreviewBootstrapStyles()}
`;
}
