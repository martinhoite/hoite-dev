# Hoite Monorepo

![Node engine](https://img.shields.io/badge/Node%20engine-%3E%3D24.0.0-026E00)

This repository is a Turborepo monorepo managed with `npm` workspaces and a single root `node_modules`.

## Commands

```bash
npm install
npm run dev
npm run dev:site:nuxt
npm run dev:storybook
npm run lint
npm run typecheck
npm run build
npm run generate:content:umbraco
```

## Workspace layout

```text
.
|- apps/
|  |- site-nuxt/         # Site app built with Nuxt
|  `- storybook/         # Storybook app for shared UI development
|- packages/
|  |- biome-config/      # Shared Biome configuration
|  |- ui/                # Shared styling foundation for the Hoite Dev design system
|  |- ui-react/          # React component package for the Hoite Dev design system
|  |- ui-vue/            # Vue component package for the Hoite Dev design system
|  `- umbraco-client/    # Source-oriented Umbraco content package
|- biome.jsonc
|- turbo.json
`- tsconfig.base.json
```

## Workspace docs

- [apps/site-nuxt/README.md](./apps/site-nuxt/README.md)
- [apps/storybook/README.md](./apps/storybook/README.md)
- [packages/ui/README.md](./packages/ui/README.md)
- [packages/ui-vue/README.md](./packages/ui-vue/README.md)
- [packages/ui-react/README.md](./packages/ui-react/README.md)
- [packages/umbraco-client/README.md](./packages/umbraco-client/README.md)

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

Local wildcard certificates are shared repo-level infrastructure for apps running on `*.local.hoite.dev`.

The expected local certificate files are stored in:

```text
ssl/local.hoite.dev.pem
ssl/local.hoite.dev-key.pem
```

`mkcert` is a simple tool for creating locally trusted development certificates.

1. Install `mkcert`.
   Using Chocolatey:

   ```powershell
   choco install mkcert -y
   ```

   Or install it manually from the [mkcert GitHub releases page](https://github.com/FiloSottile/mkcert/releases).
2. Install the local root CA:

   ```powershell
   mkcert -install
   ```

3. From the repo root, generate the shared wildcard certificates:

   ```powershell
   mkdir ssl; mkcert -cert-file ./ssl/local.hoite.dev.pem -key-file ./ssl/local.hoite.dev-key.pem local.hoite.dev *.local.hoite.dev
   ```

These files are local-only and should not be committed.

## Deployment model

Frontend apps are built from this monorepo and shipped as separate Docker images. Each app in `apps/*` is a deployable unit with its own Dockerfile, runtime configuration, and container lifecycle.

Shared packages under `packages/*` are internal build dependencies only. They are compiled into the app image and are not deployed as standalone services.

## Git hooks

`npm install` also enables Husky Git hooks for this repo:

- `pre-commit`: runs Biome only on staged files
- `pre-push`: runs `npm run typecheck`

## Editor extensions

If you use VS Code, install the recommended workspace extensions.

The most important one for this repo is the Biome extension so format-on-save matches the repo formatter and pre-commit checks.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License with an Additional Permission Clause.
