# Frontend Docs Hub

`@hoite-dev/frontend-docs-hub` is the public entry point for the Hoite Dev frontend docs workspace.

It owns shared documentation such as design-system foundations, tokens, typography contract coverage, and Storybook refs. It consumes the shared UI packages, but it does not own framework implementation stories or app-specific component stories directly.

## Local host

```text
frontend-docs.local.hoite.dev
```

Add this host to your local hosts file:

```text
127.0.0.1 frontend-docs.local.hoite.dev
```

## Local development

Run the hub on its own:

```bash
npm run dev:frontend-docs:hub
```

Or run the full frontend docs workspace side by side:

```bash
npm run dev:frontend-docs
```

Then open:

```text
https://frontend-docs.local.hoite.dev:6006
```

## Refs

The hub can compose the following Storybooks through explicit refs:

- `STORYBOOK_REACT_REF_URL`
- `STORYBOOK_VUE_REF_URL`
- `STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL`

If a ref URL is not set, that ref stays disabled instead of breaking the hub.

In normal local development, the referenced Storybooks run side by side instead of being composed automatically. The preferred deployed model remains one unified public frontend docs experience, with the hub at `/` and same-domain refs such as `/refs/react/`, `/refs/vue/`, and `/refs/site-nuxt-components/`.

## Production container

`apps/frontend-docs/hub` is the canonical production frontend docs deploy target.

Its container builds and serves:

- the hub at `/`
- the React docs at `/refs/react/`
- the Vue docs at `/refs/vue/`
- the site-nuxt components PoC at `/refs/site-nuxt-components/`

From the repo root, you can build and run the unified container locally with:

```bash
npm run docker:frontend-docs
```

Then open:

```text
http://localhost:8080/
```
