# Site Nuxt Components Docs

`@hoite-dev/frontend-docs-site-nuxt-components` is a small integration PoC for app-specific component documentation from `apps/site-nuxt`.

It exists to prove that app-owned Storybooks can build static output, resolve shared styling dependencies, and share the frontend-docs infrastructure. It should not be presented as a complete or mature component docs surface yet.

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

In normal local development, this Storybook runs side by side with the hub instead of being composed automatically.

The hub ref for this PoC is currently parked until app-specific docs return to active maintenance. If that surface is restored, use a dedicated ref URL such as `STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL` so app-specific composition remains explicit.
