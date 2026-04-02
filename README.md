# Hoite Monorepo

![Node engine](https://img.shields.io/badge/Node%20engine-%3E%3D24.0.0-026E00)

This repository is structured as a Turborepo monorepo with a single root `node_modules` managed by `npm workspaces`.

## Workspace layout

```text
.
|- apps/
|  `- site-nuxt/         # Site app built with Nuxt 4
|- packages/
|  |- umbraco-client/   # Umbraco Delivery API client + OpenAPI/type generation
|  |- biome-config/      # Shared Biome configuration
|  `- components/        # Shared token-driven UI primitives
|- biome.json
|- turbo.json
`- tsconfig.base.json
```

## Commands

```bash
npm install
npm run dev
npm run dev:site:nuxt
npm run lint
npm run typecheck
npm run build
npm run generate:content:umbraco
```

`npm install` also enables Husky Git hooks for this repo:

- `pre-commit`: runs Biome only on staged files
- `pre-push`: runs `npm run typecheck`

## Umbraco API generation

The shared Umbraco client package is wired for OpenAPI-based generation:

1. Update `scripts/umbraco-generation.config.mjs` if the local Umbraco Swagger URL changes.
2. Run `npm run generate:content:umbraco`.
3. The workspace will:
   - download the OpenAPI document into `packages/umbraco-client/openapi/`
   - generate TypeScript API types
   - derive document type unions
   - apply exclusions from `packages/umbraco-client/openapi/public-api.config.json`

`UMBRACO_OPENAPI_URL` can still be set explicitly to override the local generation config when needed.

If Swagger is disabled for the environment you target, keep a checked-in OpenAPI artifact or seed manifest in the repo and generate from that instead.

## Local app hosts

Apps own their default local development hostnames.

Convention:

```text
<app>.local.hoite.dev
```

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License with an Additional Permission Clause.
