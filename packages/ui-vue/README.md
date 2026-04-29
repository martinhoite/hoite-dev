# @hoite-dev/ui-vue

Vue component package for the Hoite Dev design system.

## Purpose

`@hoite-dev/ui-vue` contains the Vue component implementations for the Hoite Dev design system.

It builds on the shared styling foundation from `@hoite-dev/ui` and exposes Vue components for Vue and Nuxt applications.

## Package boundary

- `@hoite-dev/ui` owns the shared styling foundation and contract-level exports
- `@hoite-dev/ui-vue` owns the Vue component implementations built on top of that foundation

## Storybook

Shared foundations such as tokens and contract-level documentation belong in `apps/frontend-docs/hub`.

Vue implementation stories belong in `apps/frontend-docs/design-system-vue` and should prove that the Vue wrappers render the shared contract correctly.
