# Hoite Dev

<!-- readme-version-badges:start -->
![Node engine](https://img.shields.io/badge/Node%20engine-%3E%3D24.0.0-026E00)
![Package manager](https://img.shields.io/badge/package%20manager-pnpm%2010.33.2-F69220)
![CI](https://github.com/martinhoite/hoite-dev/actions/workflows/ci.yml/badge.svg?branch=master)
<!-- readme-version-badges:end -->

This repository is a **Turborepo monorepo** managed with `pnpm` workspaces.

It contains the Hoite Dev site app, frontend documentation, shared design system packages, and Umbraco content tooling.

## Quick links

- [Development setup and commands](./DEVELOPMENT.md)
- [Workspace overview](#workspace-overview)
- [Workspace docs](#workspace-docs)
- [Third-party notices](#third-party-notices)
- [License](#license)

## Workspace overview

Apps live under `apps/*` and are the deployable surfaces of the repo.

Packages live under `packages/*` and provide shared code, styling, configuration, and generated content used by the apps.

```text
.
|- apps/
|  |- frontend-docs/
|  |  |- hub/                     # Frontend docs hub for shared design system foundations and refs
|  |  |- shared/                  # Internal workspace package for frontend-docs code shared across multiple Storybook apps
|  |  |- design-system-react/     # React implementation docs for the shared design system
|  |  |- design-system-vue/       # Vue implementation docs for the shared design system
|  |  `- site-nuxt-components/    # Nuxt app-specific component docs PoC
|  `- site-nuxt/                  # Site app built with Nuxt
|- packages/
|  |- brand-assets/      # Shared Hoite Dev brand assets
|  |- biome-config/      # Shared Biome configuration
|  |- diagnostics/       # Shared runtime diagnostics helpers
|  |- storybook-addon-composition-theme/ # Storybook theme synchronization addon
|  |- ui/                # Shared styling foundation for the Hoite Dev design system
|  |- ui-react/          # React component package for the Hoite Dev design system
|  |- ui-vue/            # Vue component package for the Hoite Dev design system
|  `- umbraco-client/    # Source-oriented Umbraco content package
|- biome.jsonc
|- turbo.json
`- tsconfig.base.json
```

## Applications

### `apps/site-nuxt`

Nuxt SSR site app, using Umbraco as the primary provider of content.

### `apps/frontend-docs`

Frontend documentation app for the shared design system and app-specific components.

Frontend docs are developed locally as separate Storybook workspaces. For deployment previews and production, they are built as one static output with the hub and composed Storybook refs served from the same app.

## Umbraco content layer

The shared Umbraco project is maintained in a separate private repository.

This keeps the public monorepo focused on the frontend experience, shared design system, and documentation surfaces. This repository only contains the frontend-facing Umbraco integration and generated content helpers.

See [the development notes](./DEVELOPMENT.md#umbraco-boundary) for more details. I am happy to walk through the private Umbraco setup on request.

## Packages

### `packages/ui`

Shared styling foundation for the Hoite Dev design system.

### `packages/ui-react`

React component package for the Hoite Dev design system.

### `packages/ui-vue`

Vue component package for the Hoite Dev design system.

### `packages/umbraco-client`

Source-oriented Umbraco content package.

### `packages/biome-config`

Shared Biome configuration.

### `packages/brand-assets`

Shared Hoite Dev brand assets consumed by app and docs surfaces.

### `packages/diagnostics`

Shared runtime diagnostics helpers.

### `packages/storybook-addon-composition-theme`

Storybook addon for synchronizing theme state across the manager, preview, and composed refs.

## Workspace docs

### Apps

- [apps/site-nuxt](./apps/site-nuxt/README.md)
- [apps/frontend-docs](./apps/frontend-docs/README.md)
- [apps/frontend-docs/hub](./apps/frontend-docs/hub/README.md)
- [apps/frontend-docs/design-system-react](./apps/frontend-docs/design-system-react/README.md)
- [apps/frontend-docs/design-system-vue](./apps/frontend-docs/design-system-vue/README.md)
- [apps/frontend-docs/site-nuxt-components](./apps/frontend-docs/site-nuxt-components/README.md)

### Packages

- [packages/ui](./packages/ui/README.md)
- [packages/ui-react](./packages/ui-react/README.md)
- [packages/ui-vue](./packages/ui-vue/README.md)
- [packages/brand-assets](./packages/brand-assets/README.md)
- [packages/diagnostics](./packages/diagnostics/README.md)
- [packages/storybook-addon-composition-theme](./packages/storybook-addon-composition-theme/README.md)
- [packages/umbraco-client](./packages/umbraco-client/README.md)

## Use of AI

AI is used as a support tool for ideation, technical planning, refactoring support, documentation, and language refinement.

It helps accelerate exploration and iteration, while final decisions, validation, and implementation remain my responsibility.

## Third-party notices

This project includes third-party assets and code.
See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for details.

## License

This project is licensed under the PolyForm Noncommercial License 1.0.0. Commercial use requires prior written permission.

See [LICENSE](./LICENSE.md).
