# Design System React Docs

`@hoite-dev/frontend-docs-design-system-react` is the React implementation docs app for the Hoite Dev design system.

It documents and proves the React wrappers from `@hoite-dev/ui-react`. Shared foundations such as tokens and contract-level documentation still belong in `@hoite-dev/frontend-docs-hub`.

For public component docs, this workspace uses attached MDX pages with shared docs metadata from `@hoite-dev/ui` and shared rendering helpers from `apps/frontend-docs/shared/docs`. The React CSF *(Component Story Format)* stories provide the rendered examples and React-specific controls.

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

In normal local development, this Storybook runs side by side with the hub instead of being composed automatically.

The hub can reference this Storybook through `STORYBOOK_REACT_REF_URL` for explicit ref-based composition, such as the unified same-domain build served by `apps/frontend-docs/hub`.
