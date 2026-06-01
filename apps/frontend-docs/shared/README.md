# @hoite-dev/frontend-docs-shared

Internal workspace package for frontend-docs code shared across multiple Storybook apps.

It owns:
- shared docs rendering helpers exposed through `@hoite-dev/frontend-docs-shared/docs`
- shared Storybook setup helpers exposed through `@hoite-dev/frontend-docs-shared/storybook`
- shared playground addon-panel visibility defaults through `createFrontendDocsPlaygroundParameters(...)`
- shared Storybook manager toolbar visibility through `frontendDocsManagerConfig`
- the Storybook preparation script exposed through `@hoite-dev/frontend-docs-shared/storybook/prepareStorybook`

It depends on `@hoite-dev/ui` for shared design-system contracts and on the composition-theme addon for shared Storybook theming behavior.

It does not own the root public docs architecture. `apps/docs` owns the Docusaurus explanation, reference, and architecture layer at `/`, while the frontend-docs Storybooks stay focused on framework implementation workbenches.
