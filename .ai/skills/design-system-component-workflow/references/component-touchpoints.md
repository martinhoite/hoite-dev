# Component Touchpoints

Use this as the concrete checklist when adding a new design-system component or changing a component API.

## Shared contract: `packages/ui`

Likely touch points:

- component folder under `packages/ui/src/components/primitives/...`
- CVA or class contract helpers
- docs metadata such as `*.docs.ts`
- supported values and related types
- root exports in `packages/ui/src/index.ts`
- package README only if the package boundary or contract expectations changed

Ask first:

- Is this rule truly framework-agnostic?
- Is it styling contract or presentation policy that must stay aligned across React and Vue?
- Or is it just local implementation logic that happens to match today?

## React implementation: `packages/ui-react`

Likely touch points:

- component implementation under `packages/ui-react/src/components/primitives/...`
- component folder `index.ts`
- package root `src/index.ts`
- tests if present for that component area

Keep here:

- React rendering
- ARIA and DOM wiring specific to React
- React-only prop shaping

## Vue implementation: `packages/ui-vue`

Likely touch points:

- component implementation under `packages/ui-vue/src/components/primitives/...`
- component folder `index.ts`
- package root `src/index.ts`
- tests if present for that component area

Keep here:

- Vue rendering
- ARIA and DOM wiring specific to Vue
- Vue-only prop shaping

## Frontend docs: React Storybook

Likely touch points:

- `apps/frontend-docs/design-system-react/src/stories/Component.stories.tsx`
- `apps/frontend-docs/design-system-react/src/stories/Component.docs.mdx`
- shared frontend-docs story helpers only when the same pattern already exists across multiple stories

Check:

- title grouping matches source grouping
- controls use shared supported values from `@hoite-dev/ui`
- docs page structure matches the Vue page when both exist

## Frontend docs: Vue Storybook

Likely touch points:

- `apps/frontend-docs/design-system-vue/src/stories/Component.stories.ts`
- `apps/frontend-docs/design-system-vue/src/stories/Component.docs.mdx`
- shared frontend-docs story helpers only when the same pattern already exists across multiple stories

Check:

- title grouping matches source grouping
- controls use shared supported values from `@hoite-dev/ui`
- docs page structure matches the React page when both exist

## Shared docs and Storybook helpers

Likely touch points only when needed:

- `apps/frontend-docs/shared/docs/*`
- `apps/frontend-docs/shared/storybook/*`

Rules:

- keep config-time Storybook exports safe for Node-side evaluation
- move story-only helpers behind explicit subpaths instead of broad shared barrels
- do not build a new shared helper for one story unless the pattern is already stable

## Common misses

- forgetting a package root export after adding the component
- duplicating supported values locally instead of importing them from `@hoite-dev/ui`
- updating React docs but not Vue docs, or vice versa
- changing the contract in `@hoite-dev/ui` without updating framework consumers
- widening a shared package API just to avoid a few lines of duplication
- treating Storybook-only layout code as part of the production design-system contract

## Suggested execution order

1. Confirm ownership and boundary.
2. Update `@hoite-dev/ui` if the shared contract changed.
3. Update React implementation.
4. Update Vue implementation.
5. Update React and Vue stories and MDX docs.
6. Update exports.
7. Run the targeted validation commands for the touched packages.
