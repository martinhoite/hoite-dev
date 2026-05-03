# @hoite-dev/ui-react

React component package for the Hoite Dev design system.

## Purpose

`@hoite-dev/ui-react` contains the React component implementations for the Hoite Dev design system.

It builds on the shared styling foundation from `@hoite-dev/ui` and exposes React components for React and Next applications.

## Package boundary

- `@hoite-dev/ui` owns the shared styling foundation and contract-level exports
- `@hoite-dev/ui-react` owns the React component implementations built on top of that foundation

## Storybook

Shared foundations such as tokens and contract-level documentation belong in `apps/frontend-docs/hub`.

React implementation stories belong in `apps/frontend-docs/design-system-react` and should prove that the React wrappers render the shared contract correctly.
When a Vue component docs page should match the React docs page, create an attached MDX page in `apps/frontend-docs/design-system-react`.

Use shared docs metadata from `@hoite-dev/ui` where possible, instead of repeating the same explanatory text in each story file.
