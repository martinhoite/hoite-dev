# Hoite Monorepo

![Node engine](https://img.shields.io/badge/Node%20engine-%3E%3D24.0.0-026E00)

This repository is structured as a Turborepo monorepo with a single root `node_modules` managed by `npm workspaces`.

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

## Workspace layout

```text
.
|- apps/
|  `- site-nuxt/         # Site app built with Nuxt 4
|- packages/
|  |- umbraco-client/    # Umbraco Delivery API client + OpenAPI/type generation
|  |- biome-config/      # Shared Biome configuration
|  `- components/        # Shared token-driven UI primitives
|- biome.json
|- turbo.json
`- tsconfig.base.json
```

## Local app hosts

Apps own their default local development hostnames.

Convention:

```text
<app>.local.hoite.dev
```

Add the relevant app host to your local hosts file:

```text
127.0.0.1 <app>.local.hoite.dev
```

## Local SSL

Local wildcard certificates are shared repo-level infrastructure.

The expected local certificate files are stored in:

```text
ssl/local.hoite.dev.pem
ssl/local.hoite.dev-key.pem
```

`mkcert` is a simple tool for creating locally-trusted development certificates.

1. Install `mkcert`.
   - Using Chocolatey:
     ```powershell
     choco install mkcert -y
     ```
   - Or install it manually from the [mkcert GitHub releases page](https://github.com/FiloSottile/mkcert/releases).
2. Install the local root CA:
   ```powershell
   mkcert -install
   ```
3. From the repo root, generate the shared wildcard certs:
   ```powershell
   mkdir ssl; mkcert -cert-file ./ssl/local.hoite.dev.pem -key-file ./ssl/local.hoite.dev-key.pem local.hoite.dev *.local.hoite.dev
   ```

These files are local-only and should not be committed.

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

## Deployment model

Frontend apps are built from this monorepo and shipped as separate Docker images. Each app in `apps/*` is a deployable unit with its own Dockerfile, runtime configuration, and container lifecycle.

Shared packages under `packages/*` are internal build dependencies only. They are compiled into the app image and are not deployed as standalone services.

`npm install` also enables Husky Git hooks for this repo:

- `pre-commit`: runs Biome only on staged files
- `pre-push`: runs `npm run typecheck`

## Editor Extensions

If you use VS Code, install the recommended workspace extensions.

The most important one for this repo is the Biome extension so format-on-save matches the repo's formatter and pre-commit checks.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License with an Additional Permission Clause.
