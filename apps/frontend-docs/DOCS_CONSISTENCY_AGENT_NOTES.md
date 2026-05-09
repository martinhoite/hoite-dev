# Frontend Docs Consistency Agent Notes

Use this as a fast execution checklist when changing docs under `apps/frontend-docs`.

## Routing

- If contract meaning/copy changes: update shared docs metadata in `@hoite-dev/ui`.
- If framework rendering changes: update React/Vue framework stories.
- If docs page structure changes: update MDX and keep composition through shared docs helpers.
- If hub contract display changes: update hub overview stories with shared hub templates.

## Required Reuse

- `shared/docs/FrameworkComponentDocsPage.tsx`
- `shared/docs/DesignSystemDocsPage.tsx`
- `shared/docs/DocsExample.tsx`
- `shared/storybook/reactStoryLayouts.tsx`
- `shared/storybook/vueStoryTemplates.ts`
- `shared/storybook/hubContractTemplates.ts`
- `shared/storybook/config.ts`

## Consistency Rules

- Keep React and Vue docs aligned on section order, control intent, and example intent.
- Keep framework-specific source links present for each framework docs page.
- Keep Storybook config through `createFrontendDocsStorybookConfig<StorybookConfig>(...)`.
- Keep `@hoite-dev/ui/*.css` imports local to each Storybook app's `preview.ts`.

## Theming

- Keep Storybook theming on `@storybook/addon-themes` with `withThemeByDataAttribute` in each app `preview.ts`.
- Keep shared preview surface/theme overrides in `shared/storybook/hoiteThemePreview.css`.
- Do not add per-app `preview-head.html` or `manager-head.html` theme bootstrapping unless explicitly required.

## Validation

Run relevant checks for touched apps:

- `pnpm --filter @hoite-dev/frontend-docs-design-system-react lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue lint`
- `pnpm --filter @hoite-dev/frontend-docs-hub lint`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components lint`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-react typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-design-system-vue typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-hub typecheck`
- `pnpm --filter @hoite-dev/frontend-docs-site-nuxt-components typecheck`
