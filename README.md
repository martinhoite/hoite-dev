# Hoite Monorepo

This repository is structured as a Turborepo monorepo with a single root `node_modules` managed by `npm workspaces`.

## Workspace layout

```text
.
|- apps/
|  `- nuxt-app/          # Nuxt 4 app consuming workspace packages
|- packages/
|  |- api-client/        # Umbraco delivery client + OpenAPI/type generation scaffold
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
npm run dev:nuxt
npm run lint
npm run typecheck
npm run build
npm run generate:api
```

## Umbraco API generation

The shared API client is wired for OpenAPI-based generation:

1. Set `UMBRACO_OPENAPI_URL` to a non-production Umbraco Swagger/OpenAPI endpoint.
2. Run `npm run generate:api`.
3. The workspace will:
   - download the OpenAPI document into `packages/api-client/openapi/`
   - generate TypeScript API types
   - derive document type unions
   - apply exclusions from `packages/api-client/openapi/public-api.config.json`

If Swagger is disabled for the environment you target, keep a checked-in OpenAPI artifact or seed manifest in the repo and generate from that instead.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License with an Additional Permission Clause.
