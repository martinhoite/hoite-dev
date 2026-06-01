# Frontend Docs Consistency Guide

Use this guide when you add or change frontend docs across `apps/docs` and the Storybook apps under `apps/frontend-docs`.

Covers:
- `apps/docs`
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
- Root explanation, route structure, architecture wording, or simplified contract/reference samples changed:
  - Update `apps/docs` and keep those samples inside the `@hoite-dev/ui` contract boundary.
- Framework rendering or behavior changed:
  - Update framework stories (`*.stories.tsx` for React, `*.stories.ts` for Vue).
- Public framework docs page composition changed:
  - Update `*.docs.mdx`, but keep rendering through shared docs helpers.

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

Framework prop naming can follow framework conventions without extra explanation. For example,
React stories may expose `className` while Vue stories expose `class` or component-specific
`*Class` props for the same styling passthrough intent.

## Root Docs Workflow

For `apps/docs`, prefer:

- shared docs metadata from `@hoite-dev/ui`
- simplified semantic markup that consumes `@hoite-dev/ui` classes and utilities
- simplified contract/reference samples rather than full framework implementation behavior
- links to Storybook whenever behavior, controls, accessibility interaction, or framework wiring matters

`apps/docs` owns the root explanation and reference layer. Storybook owns interactive implementation behavior and framework-specific proof.

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
- Use `createFrontendDocsPlaygroundParameters(...)` for playground stories. The shared default shows Controls and Accessibility, hides Actions, Interactions, and the Docs Code panel.
- A story can deliberately override playground addon visibility through the helper's `addons` option, for example `addons: { actions: true, code: true }`.
- The shared manager config hides toolbar tools that are not verified for the current stories: Reload story, Measure, Outline, and Vision filter.
- Use `tags: ['!dev']` for showcase-only stories when needed.
- Keep live controls focused on meaningful component behavior.
- Keep non-visual passthrough details in docs text or tables.

## Done Checklist

A docs change is complete when:

1. Shared helpers were reused where applicable.
2. React and Vue remain aligned in structure and intent.
3. Source links are correct.
4. Lint and typecheck pass for touched frontend-docs apps.
5. The related docs are verified in the docs-owned same-origin static host when routing or deployment output is affected.

Recommended checks:

- `pnpm --filter @hoite-dev/docs lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue lint`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components lint`
- `pnpm --filter @hoite-dev/docs typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components typecheck`
