# Site Nuxt Components Docs

`@hoite-dev/frontend-docs-site-nuxt-components` is a small integration PoC for app-specific component documentation from `apps/site-nuxt`.

It exists to prove that app-owned Storybooks can build static output, resolve shared styling dependencies, and share the frontend-docs infrastructure. It should not be presented as a complete or mature public docs surface.

## Scope

- Uses `apps/site-nuxt/components/global/GlobalLogo.vue` as the initial component reference.
- Includes one basic story and one attached MDX docs page.
- Stubs only the minimum Nuxt runtime needed for this PoC.
- Reuses shared docs-page composition from `@hoite-dev/frontend-docs-shared/docs` for source links, examples, and controls layout.

## Local host

```text
site-nuxt-components.local.hoite.dev
```

Add this host to your local hosts file:

```text
127.0.0.1 site-nuxt-components.local.hoite.dev
```

## Local development

```bash
pnpm run dev:frontend-docs:site-nuxt-components
```

Then open:

```text
https://site-nuxt-components.local.hoite.dev:6009
```

In normal local development, this Storybook runs side by side with the docs app as an independent workbench instead of being mounted into the same-origin host.

This PoC is currently parked until app-specific docs return to active maintenance. If that surface is restored, decide its final route deliberately inside the docs-owned architecture instead of reintroducing ref-based composition assumptions.
