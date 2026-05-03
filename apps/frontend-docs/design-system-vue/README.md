# Design System Vue Docs

`@hoite-dev/frontend-docs-design-system-vue` is the Vue implementation docs app for the Hoite Dev design system.

It documents and proves the Vue wrappers from `@hoite-dev/ui-vue`. Shared foundations such as tokens and contract-level documentation still belong in `@hoite-dev/frontend-docs-hub`.

For public component docs, this workspace uses attached MDX pages with shared docs metadata from `@hoite-dev/ui` and shared rendering helpers from `apps/frontend-docs/shared/docs`. The Vue CSF *(Component Story Format)* stories provide the rendered examples and Vue-specific controls.

## Extensions

The recommended VS Code extension `unifiedjs.vscode-mdx` adds syntax highlight to the `.mdx` files.

## Local host

```text
design-system-vue.local.hoite.dev
```

Add this host to your local hosts file:

```text
127.0.0.1 design-system-vue.local.hoite.dev
```

## Local development

```bash
pnpm run dev:frontend-docs:design-system-vue
```

Then open:

```text
https://design-system-vue.local.hoite.dev:6008
```

In normal local development, this Storybook runs side by side with the hub instead of being composed automatically.

The hub can reference this Storybook through `STORYBOOK_VUE_REF_URL` for explicit ref-based composition, such as the unified same-domain build served by `apps/frontend-docs/hub`.
