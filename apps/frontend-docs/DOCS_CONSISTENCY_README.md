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
  - `FrameworkComponentDocsPage` from `@hoite-dev/frontend-docs-shared/docs`
- Shared docs building blocks:
  - `DesignSystemDocsPage` from `@hoite-dev/frontend-docs-shared/docs`
  - internal helpers in `apps/frontend-docs/shared/docs`
- Story layout wrappers:
  - React: `StoryInfoPanel` and `StoryStack` from `@hoite-dev/frontend-docs-shared/storybook`
  - Vue: `withStoryStack` from `@hoite-dev/frontend-docs-shared/storybook`
- Playground addon-panel parameters:
  - `createFrontendDocsPlaygroundParameters(...)` from `@hoite-dev/frontend-docs-shared/storybook`
- Manager toolbar configuration:
  - `frontendDocsManagerConfig` from `@hoite-dev/frontend-docs-shared/storybook`
- Hub contract helpers:
  - `hub/src/stories/contractDocs.tsx`
- Storybook app config factory:
  - `createFrontendDocsStorybookConfig(...)` from `@hoite-dev/frontend-docs-shared/storybook`
  - `createFrontendDocsAddons(...)` from `@hoite-dev/frontend-docs-shared/storybook`

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
  - `createFrontendDocsAddons(compositionThemeConfig)` for addon registration
- In app `.storybook/manager.ts`, use the shared manager toolbar config from `@hoite-dev/frontend-docs-shared/storybook`.
- Keep `@hoite-dev/ui/*.css` side-effect imports in each app's `preview.ts`.
- Do not move those CSS imports into shared Storybook helper modules.
- Keep docs theming on `@hoite-dev/storybook-addon-composition-theme` with shared `compositionThemeConfig`.
- Do not add local Storybook globals/decorators for design-system theme state.
- Keep shared preview surface overrides in `apps/frontend-docs/shared/storybook/hoiteThemePreview.css`.
- Let addon preset bootstrap own manager/preview theme bootstrap behavior.

## Controls Rules

- Use `parameters.controls.sort = 'none'` when control order is intentional.
- Use `createFrontendDocsPlaygroundParameters(...)` for playground stories. The shared default shows Controls and Accessibility, and hides Actions, Interactions, and the Docs Code panel.
- A story can deliberately override playground addon visibility through the helper's `addons` option, for example `addons: { actions: true, code: true }`.
- The shared manager config hides toolbar tools that are not verified for the current stories: Reload story, Measure, Outline, and Vision filter.
- Use `tags: ['!dev']` for showcase-only stories when needed.
- Keep live controls focused on meaningful component behavior.
- Keep hub contract stories docs-only and disable controls when the page exists to document a fixed shared contract rather than an interactive implementation.
- Keep non-visual passthrough details in docs text or tables.

## Done Checklist

A docs change is complete when:

1. Shared helpers were reused where applicable.
2. React and Vue remain aligned in structure and intent.
3. Source links are correct.
4. Lint and typecheck pass for touched frontend-docs apps.
5. The related docs are verified working in the composed setup by running Docker when composition or deployment output is affected.

Recommended checks:

- `pnpm --filter @hoite-dev/frontend-docs-design-system-react lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue lint`
- `pnpm --filter @hoite-dev/frontend-docs-hub lint`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-hub typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components typecheck`
