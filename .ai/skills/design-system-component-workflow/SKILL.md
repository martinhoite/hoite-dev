---
name: design-system-component-workflow
description: Add or update Hoite Dev design-system components across `@hoite-dev/ui`, `@hoite-dev/ui-react`, `@hoite-dev/ui-vue`, and the frontend-docs Storybook workspaces. Use when creating a new component, changing a component API or shared visual contract, adding React and Vue parity, updating exports, or wiring stories and MDX docs so component work stays aligned and does not require later cleanup refactors.
---

# Design System Component Workflow

## Overview

Use this skill to keep Hoite Dev design-system component work aligned across the shared UI package, the framework packages, and the frontend docs workspaces.

Prefer the smallest correct change. Do not extract shared helpers, move ownership across packages, or widen the public API unless the change clearly represents stable shared contract behavior.

## Workflow

### 1. Decide ownership before editing

Use this split consistently:

- `@hoite-dev/ui` owns framework-agnostic styling contract, docs metadata, shared visual policy, and shared exported values.
- `@hoite-dev/ui-react` owns React rendering, DOM behavior, and React-specific component wiring.
- `@hoite-dev/ui-vue` owns Vue rendering, DOM behavior, and Vue-specific component wiring.
- `apps/frontend-docs/*` owns Storybook stories, MDX docs pages, and docs-only helpers.

If a rule is only needed to make one framework implementation work, keep it in that framework package.

If a rule must stay identical across React and Vue as part of the design-system contract, it may belong in `@hoite-dev/ui`.

### 2. Build the shared contract first when needed

When the component introduces or changes shared design-system behavior:

- update tokens, CVA definitions, docs metadata, supported values, and shared exports in `@hoite-dev/ui`
- keep exports deliberate; do not add shared helpers just to avoid a few repeated lines unless the rule is truly contract-level
- keep public package exports stable when internal organization changes

If the request is implementation-only, do not force shared-package changes.

### 3. Implement React and Vue deliberately

For each framework package:

- keep the same component API unless the user explicitly wants divergence
- consume shared contract values from `@hoite-dev/ui` instead of duplicating options or docs copy
- keep rendering details local to the framework package
- avoid premature extraction; duplicate small local implementation details unless a real shared contract has emerged

### 4. Update Storybook as part of the component change

Component work is not done until the Storybook surfaces match the contract.

- keep Storybook grouping aligned with source grouping
- use attached MDX pages where the repo convention expects them
- keep React and Vue docs copy, controls guidance, and section structure aligned by consuming shared metadata where practical
- keep shared Storybook helpers config-safe; do not route story-only helpers through config-time barrels

### 5. Validate the same scope you changed

Run the narrowest useful checks for the packages you touched.

Typical commands:

```powershell
pnpm --filter @hoite-dev/ui lint
pnpm --filter @hoite-dev/ui typecheck
pnpm --filter @hoite-dev/ui-react lint
pnpm --filter @hoite-dev/ui-react typecheck
pnpm --filter @hoite-dev/ui-vue lint
pnpm --filter @hoite-dev/ui-vue typecheck
pnpm --filter @hoite-dev/frontend-docs-shared lint
pnpm --filter @hoite-dev/frontend-docs-shared typecheck
pnpm --filter @hoite-dev/frontend-docs-design-system-react lint
pnpm --filter @hoite-dev/frontend-docs-design-system-react typecheck
pnpm --filter @hoite-dev/frontend-docs-design-system-vue lint
pnpm --filter @hoite-dev/frontend-docs-design-system-vue typecheck
```

If the change affects Docker-served frontend docs, also verify through the repo's existing Docker workflow rather than ad hoc containers.

## Working Rules

- If the user says to keep something in the component, keep it in that component file unless they explicitly want a shared extraction.
- If a new helper crosses package boundaries, justify the ownership in terms of design-system contract, not just deduplication.
- If React and Vue start drifting, first decide whether the drift is acceptable framework implementation detail or a shared contract bug.
- Prefer adding a checklist item to this skill over doing another cleanup refactor later because a common touch point was forgotten.

## Reference

Read `references/component-touchpoints.md` at the start of new component work or any component API change. It is the concrete checklist for likely file touch points and common misses.
