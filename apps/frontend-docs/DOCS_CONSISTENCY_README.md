# Frontend Docs Consistency Guide

Use this guide when you add or change docs in `apps/frontend-docs`.

Covers:
- `hub`
- `design-system-react`
- `design-system-vue`
- `site-nuxt-components` (PoC scope)

If you want the short execution checklist for automation or fast implementation passes, see `DOCS_CONSISTENCY_AGENT_NOTES.md`.

## Start Here

1. Identify the change type.
2. Update the right source of truth.
3. Reuse shared helpers before writing local wrappers.

## Choose The Right Place

- Contract meaning or docs copy changed:
  - Update shared docs metadata in `@hoite-dev/ui` (for example `iconDocs`, `loadingDocs`, `typographyDocs`).
- Framework rendering or behavior changed:
  - Update framework stories (`*.stories.tsx` for React, `*.stories.ts` for Vue).
- Public docs page composition changed:
  - Update `*.docs.mdx`, but keep rendering through shared docs helpers.
- Hub contract layout/table/chip presentation changed:
  - Update hub overview stories using `hub/src/stories/contractDocs.tsx` helpers.

## Reuse Before Rebuild

Use these shared utilities first:

- Public React/Vue docs page composition:
  - `shared/docs/FrameworkComponentDocsPage.tsx`
- Shared docs building blocks:
  - `shared/docs/DesignSystemDocsPage.tsx`
  - `shared/docs/DocsExample.tsx`
- Story layout wrappers:
  - React: `shared/storybook/reactStoryLayouts.tsx`
  - Vue: `shared/storybook/vueStoryTemplates.ts`
- Hub contract helpers:
  - `hub/src/stories/contractDocs.tsx`
- Storybook app config factory:
  - `shared/storybook/config.ts`

## React + Vue Docs Workflow

1. Keep framework stories in their framework Storybook app.
2. Keep shared docs metadata in `@hoite-dev/ui`.
3. Compose docs pages with `FrameworkComponentDocsPage`.
4. Keep React and Vue aligned on:
   - section order
   - control intent
   - example intent
   - source-link structure

If React and Vue differ, document why in the story or docs description.

## Hub Contract Workflow

For `hub/src/stories/*Overview.stories.tsx`, prefer:

- `ContractPage`
- `ContractSection`
- `ContractTable`
- `CodeChipList`
- `ContractSubsection`

These helpers live in `hub/src/stories/contractDocs.tsx` and keep contract pages consistent.

## Storybook Setup Rules

- In app `.storybook/main.ts`, use:
  - `createFrontendDocsStorybookConfig<StorybookConfig>(...)`
- Keep `@hoite-dev/ui/*.css` side-effect imports in each app's `preview.ts`.
- Do not move those CSS imports into shared Storybook helper modules.
- Keep theming on `@storybook/addon-themes` with `withThemeByDataAttribute` in each app `preview.ts`.
- Keep shared preview surface overrides in `shared/storybook/hoiteThemePreview.css`.
- Avoid app-local `preview-head.html` and `manager-head.html` theme bootstrapping unless a specific issue requires it.

## Controls Rules

- Use `parameters.controls.sort = 'none'` when control order is intentional.
- Use `tags: ['!dev']` for showcase-only stories when needed.
- Keep live controls focused on meaningful component behavior.
- Keep non-visual passthrough details in docs text or tables.

## Done Checklist

A docs change is complete when:

1. Shared helpers were reused where applicable.
2. React and Vue remain aligned in structure and intent.
3. Source links are correct.
4. Lint and typecheck pass for touched frontend-docs apps.

Recommended checks:

- `pnpm --filter @hoite-dev/frontend-docs-design-system-react lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue lint`
- `pnpm --filter @hoite-dev/frontend-docs-hub lint`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-hub typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components typecheck`
