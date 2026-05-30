export const frontendDocsStoryPlaygroundPreviewA11yContextSelector =
  '.frontend-docs-story-playground-preview';

export const frontendDocsStoryLayoutClasses = {
  infoPanel: 'rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4',
  playground: 'mx-auto grid w-full min-w-0 max-w-5xl gap-6',
  playgroundContent: 'frontend-docs-story-playground-content grid min-w-0 gap-6',
  playgroundContentSplit: 'frontend-docs-story-playground-content--has-snippet',
  playgroundPreview: 'frontend-docs-story-playground-preview grid place-items-center py-10',
  snippetContainer: 'mx-auto grid w-full min-w-0 max-w-[56ch] gap-2',
  snippetPanel: 'frontend-docs-story-snippet',
  stack: 'grid gap-4',
} as const;
