import { createHoiteStorybookColorValues } from './hoiteStorybookThemeColors.ts';

const hoiteFaviconDataUri = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="3000" height="3000"><svg xmlns="http://www.w3.org/2000/svg" width="3000" height="3000" fill="none" viewBox="0 0 3000 3000">
  <path stroke="#000" stroke-width="100" d="m1951.75 2536.88-875.4-875.4m995.01-50.12-975 975M2694.2 1778.5l-480.12-480.13m-380.29-961.561L558.794 1611.81m103.851 533.08L1903.89 903.645M70.71 1500 1500 70.71 2929.289 1500l-1429.29 1429.288z"></path>
</svg><style>@media (prefers-color-scheme: light) { :root { filter: none; } }
@media (prefers-color-scheme: dark) { :root { filter: invert(100%); } }
</style></svg>`,
)}`;

function createHoiteDocumentHeadMarkup() {
  return `
<link rel="icon" href="${hoiteFaviconDataUri}" type="image/svg+xml" />
<meta name="theme-color" content="#14171a" />
`;
}

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
${createHoiteDocumentHeadMarkup()}
${createHoitePreviewBootstrapStyles()}
`;
}

export function withHoiteManagerHead(head: string = ''): string {
  return `${head}
${createHoiteDocumentHeadMarkup()}
`;
}
