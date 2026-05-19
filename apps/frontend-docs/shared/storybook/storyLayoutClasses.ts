export const frontendDocsStoryLayoutClasses = {
  infoPanel: 'rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4',
  playground: 'mx-auto grid w-full min-w-0 max-w-5xl gap-6',
  playgroundContent: 'frontend-docs-story-playground-content grid min-w-0 gap-6',
  playgroundContentSplit: 'frontend-docs-story-playground-content--has-snippet',
  playgroundPreview: 'grid place-items-center py-10',
  snippetBody:
    'relative min-w-0 overflow-hidden rounded-lg border border-[var(--color-border-muted)]',
  snippetCode: 'block whitespace-pre text-sm leading-6 text-[var(--color-text-primary)]',
  snippetCopyButton:
    'absolute bottom-0 right-0 inline-flex w-fit items-center gap-1.5 border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)]',
  snippetPanel: 'frontend-docs-story-snippet mx-auto grid w-full min-w-0 max-w-[56ch] gap-2',
  snippetPre: 'm-0 overflow-x-auto p-4',
  stack: 'grid gap-4',
} as const;
