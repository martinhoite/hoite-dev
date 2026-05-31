# Design System React Docs

`@hoite-dev/frontend-docs-design-system-react` is the React implementation docs app for the Hoite Dev design system.

It documents and proves the React wrappers from `@hoite-dev/ui-react`. Shared foundations such as tokens and contract-level documentation live in `apps/docs`.

For public component docs, this workspace uses attached MDX pages with shared docs metadata from `@hoite-dev/ui` and shared rendering helpers from `@hoite-dev/frontend-docs-shared/docs`. The React CSF *(Component Story Format)* stories provide the rendered examples and React-specific controls.

Playground stories use `createFrontendDocsPlaygroundParameters(...)` from `@hoite-dev/frontend-docs-shared/storybook` so addon-panel visibility stays consistent unless an individual story deliberately overrides it. Manager toolbar visibility uses the shared frontend-docs manager config.

## Extensions

The recommended VS Code extension `unifiedjs.vscode-mdx` adds syntax highlight to the `.mdx` files.

## Local host

```text
design-system-react.local.hoite.dev
```

Add this host to your local hosts file:

```text
127.0.0.1 design-system-react.local.hoite.dev
```

## Local development

```bash
pnpm run dev:frontend-docs:design-system-react
```

Then open:

```text
https://design-system-react.local.hoite.dev:6007
```

In normal local development, this Storybook runs side by side with the docs app as an independent workbench.

In the final same-origin static host, this Storybook is mounted at `/design-system/react/`.
