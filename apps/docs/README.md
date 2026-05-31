# Hoite Dev Docs

`@hoite-dev/docs` is the main Hoite Dev documentation site.

It is implemented with Docusaurus and owns:

- the root `/` route
- design-system explanation pages
- token and package-boundary documentation
- architecture documentation
- simplified visual contract samples that stay within `@hoite-dev/ui`

The React and Vue Storybooks remain independent implementation workbenches and are mounted into the final same-origin static host at:

- `/design-system/react/`
- `/design-system/vue/`

## Local development

Add this hosts entry if it is not already present:

```text
127.0.0.1 docs.local.hoite.dev
```

Then run:

```bash
pnpm run dev:docs
```

Then open:

```text
http://docs.local.hoite.dev:3030
```

## Static host build

```bash
pnpm --filter @hoite-dev/docs run build:static-host
```

That command builds the docs app plus the React and Vue Storybooks, then assembles the final same-origin output under `apps/docs/dist`.
