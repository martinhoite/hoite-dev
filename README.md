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

## Editor Extensions

If you use VS Code, install the recommended workspace extensions.

The most important one for this repo is the Biome extension so format-on-save matches the repo's formatter and pre-commit checks.

## Umbraco API generation

The shared Umbraco client package is wired for OpenAPI-based generation:

1. Copy `.env.example` to `.env`.
2. Update `UMBRACO_OPENAPI_URL` to match your Umbraco Swagger URL.
3. If your local Umbraco instance uses a locally trusted certificate authority such as `mkcert`, run `mkcert -CAROOT` and set `UMBRACO_OPENAPI_CA_CERT_PATH` to `<that-path>/rootCA.pem`.
4. Run `npm run generate:content:umbraco`.
5. The workspace will:
   - download the OpenAPI document into `packages/umbraco-client/openapi/`
   - generate TypeScript API types
   - derive document type unions
   - apply exclusions from `packages/umbraco-client/openapi/public-api.config.json`

The generator reads `UMBRACO_OPENAPI_URL` and `UMBRACO_OPENAPI_CA_CERT_PATH` from the root `.env` file.

If the CA certificate path is omitted, the generator uses Node's default trust store.

The current generator expects a live OpenAPI URL. If you need to work from a checked-in artifact instead, manually add or update `packages/umbraco-client/openapi/umbraco-delivery.openapi.json`, and update `packages/umbraco-client/openapi/doc-types.seed.json` if the document types changed.

## Local app hosts

Apps own their default local development hostnames.

Convention:

```text
<app>.local.hoite.dev
```

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License with an Additional Permission Clause.
