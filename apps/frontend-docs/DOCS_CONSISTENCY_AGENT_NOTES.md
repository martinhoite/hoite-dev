# Frontend Docs Consistency Agent Notes

Use this as a fast execution checklist when changing docs under `apps/frontend-docs`.

## Routing

- If contract meaning/copy changes: update shared docs metadata in `@hoite-dev/ui`.
- If framework rendering changes: update React/Vue framework stories.
- If Docusaurus page structure changes: update the docs app pages and keep the visual samples inside the `@hoite-dev/ui` contract boundary.
- If framework docs page structure changes: update attached MDX in the relevant Storybook app and keep using shared Storybook docs helpers.

## Required Reuse

- `FrameworkComponentDocsPage` from `@hoite-dev/frontend-docs-shared/docs`
- `DesignSystemDocsPage` from `@hoite-dev/frontend-docs-shared/docs`
- `StoryInfoPanel`, `StoryStack`, and `withStoryStack` from `@hoite-dev/frontend-docs-shared/storybook`
- `createFrontendDocsPlaygroundParameters(...)` from `@hoite-dev/frontend-docs-shared/storybook`
- `frontendDocsManagerConfig` from `@hoite-dev/frontend-docs-shared/storybook`
- `createFrontendDocsStorybookConfig(...)` from `@hoite-dev/frontend-docs-shared/storybook`
- `createFrontendDocsAddons(compositionThemeConfig)` from `@hoite-dev/frontend-docs-shared/storybook`

## Consistency Rules

- Keep React and Vue docs aligned on section order, control intent, and example intent.
- Keep framework-specific source links present for each framework docs page.
- Allow framework-native prop naming differences such as React `className` and Vue `class` /
  `*Class` when they describe the same styling passthrough intent.
- Keep Storybook config through `createFrontendDocsStorybookConfig<StorybookConfig>(...)`.
- Register theme addon through `createFrontendDocsAddons(compositionThemeConfig)`.
- Use `createFrontendDocsPlaygroundParameters(...)` for playground stories so addon-panel visibility stays consistent; override its `addons` option per story when a playground deliberately needs something beyond the default Controls and Accessibility panels.
- Keep manager toolbar visibility through `frontendDocsManagerConfig`; do not re-enable Reload story, Measure, Outline, or Vision filter unless the current stories verify those tools.
- Keep `@hoite-dev/ui/*.css` imports local to each Storybook app's `preview.ts`.
- Keep Docusaurus visual samples simplified and contract-focused; link to Storybook when real behavior, state, or accessibility interaction matters.

## Theming

- Keep Storybook theming on `@hoite-dev/storybook-addon-composition-theme`.
- Keep storage + root attribute application as theme source of truth.
- Keep shared preview surface/theme overrides in `apps/frontend-docs/shared/storybook/hoiteThemePreview.css`.
- Do not add per-app Storybook globals/decorators for design-system theme state.

## Validation

Run relevant checks for touched apps:

- `pnpm --filter @hoite-dev/docs lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue lint`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components lint`
- `pnpm --filter @hoite-dev/docs typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components typecheck`
