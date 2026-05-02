# Development

This document covers local setup, day-to-day development, and architecture notes for the Hoite Dev monorepo.

## Development setup

### Requirements

- Node.js `>=24.0.0`
- pnpm via Corepack
- Docker, when previewing container output locally
- Local SSL certificates for HTTPS development hosts.
  - This document includes setup guidance using `mkcert`, but the project only needs valid local certificate files at the expected paths.

Check the top-level [`README.md`](./README.md) badges for the current repo-level Node engine and pnpm versions.

### Install dependencies

```bash
corepack enable
pnpm install
```

### Editor extensions

If you use VS Code, install the recommended workspace extensions.

The most important one for this repo is the Biome extension so format-on-save matches the repo formatter and pre-commit checks.

### Git hooks

`pnpm install` also enables Husky Git hooks for this repo:

- `pre-commit`: runs Biome only on staged files
- `pre-push`: runs `pnpm run typecheck`

### Local app hosts

Apps own their default local development hostnames.

Convention:

```text
<app>.local.hoite.dev
```

Add the relevant app host to your local hosts file:

```text
127.0.0.1 <app>.local.hoite.dev
```

### Local SSL

Local wildcard certificates are repo-level local development infrastructure for apps running on `*.local.hoite.dev`.

The expected local certificate files are stored in:

```text
ssl/local.hoite.dev.pem
ssl/local.hoite.dev-key.pem
```

`mkcert` is a simple tool for creating locally trusted development certificates.

Install `mkcert` with Chocolatey:

```powershell
choco install mkcert -y
```

Or install it manually from the [mkcert GitHub releases page](https://github.com/FiloSottile/mkcert/releases).

Install the local root CA:

```powershell
mkcert -install
```

From the repo root, generate the shared wildcard certificates:

```powershell
mkdir ssl; mkcert -cert-file ./ssl/local.hoite.dev.pem -key-file ./ssl/local.hoite.dev-key.pem local.hoite.dev *.local.hoite.dev
```

These files are local-only and should not be committed.

## Development commands

### General commands

```bash
pnpm run dev
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run generate:content:umbraco
```

### Site app

```bash
pnpm run dev:site:nuxt
```

### Frontend docs

Use this for normal local frontend docs development:

```bash
pnpm run dev:frontend-docs
```

This runs the docs side by side on their own HTTPS local hosts:

```text
127.0.0.1 frontend-docs.local.hoite.dev
127.0.0.1 design-system-react.local.hoite.dev
127.0.0.1 design-system-vue.local.hoite.dev
127.0.0.1 site-nuxt-components.local.hoite.dev
```

To preview the unified frontend docs container locally, run:

```bash
pnpm run docker:frontend-docs
```

Then open:

```text
http://localhost:8080/
```

## Architecture notes

### Frontend docs model

Frontend docs are developed locally as separate Storybook workspaces:

- `hub`
- `design-system-react`
- `design-system-vue`
- `site-nuxt-components`

During local development, frontend docs run separately. The combined static output is used for deployment previews and production.

The deployment model is unified. Frontend docs are built as one static output with the hub at `/` and refs mounted under same-domain paths:

```text
/
/refs/react/
/refs/vue/
/refs/site-nuxt-components/
```

### Deployment model

Frontend apps are built from this monorepo and shipped as Docker images. Each app in `apps/*` is treated as a deployable unit with its own Dockerfile, runtime configuration, and container lifecycle.

`apps/site-nuxt` is deployed as a Nuxt SSR site app.

`apps/frontend-docs` is deployed as a static frontend docs app.

Shared packages under `packages/*` are internal build dependencies only. They are compiled into app images and are not deployed as standalone services.

### Umbraco boundary

The shared Umbraco implementation is maintained in a separate private repository.

This keeps the public monorepo focused on the frontend apps, shared design system packages, documentation surfaces, and frontend-facing integration code.

The main reason for this boundary is the Umbraco project’s use of uSync. uSync is useful because it keeps content types, data types, templates, configuration, and other backoffice structure portable and version-controlled. In this setup, that also means the Umbraco repository can contain a fairly complete representation of the shared backoffice setup.

Keeping that repository private avoids publishing the full Umbraco setup as part of the public frontend monorepo. The public repository can still show how apps consume Umbraco content, while the private repository remains the source of truth for the content structure and backoffice configuration.

This repository only contains frontend-facing Umbraco integration and generated content helpers.

I am happy to walk through the private Umbraco setup on request.
