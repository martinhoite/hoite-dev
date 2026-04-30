# Site Nuxt Components Docs

`@hoite-dev/frontend-docs-site-nuxt-components` is a small integration PoC for app-specific component documentation from `apps/site-nuxt`.

It exists to prove that app-owned Storybooks can build static output, resolve shared styling dependencies, compose into the hub through refs, and ship alongside the design-system docs. It should not be presented as a complete or mature component docs surface yet.

## Scope

- Uses `apps/site-nuxt/components/global/GlobalLogo.vue` as the initial component reference.
- Includes one basic story and one small docs page.
- Stubs only the minimum Nuxt runtime needed for this PoC.

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

In normal local development, this Storybook runs side by side with the hub instead of being composed automatically.

The hub can reference this Storybook through `STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL` for explicit ref-based composition, such as the unified same-domain build served by `apps/frontend-docs/hub`.
