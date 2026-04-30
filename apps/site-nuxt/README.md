# Site Nuxt

![Nuxt version](https://img.shields.io/badge/Nuxt%20version-%5E4.4.2-00DC82)

## Setup

Install dependencies from the monorepo root:

```bash
corepack enable
pnpm install
```

Copy `apps/site-nuxt/.env.example` to `apps/site-nuxt/.env` and fill out relevant values for the app's runtime configuration.

## Development Server

Use the default local app hostname:

```text
site-nuxt.local.hoite.dev
```

Add this to your local hosts file unless you have a local DNS setup:

```text
127.0.0.1 site-nuxt.local.hoite.dev
```

Set the canonical/public site URL explicitly with `NUXT_PUBLIC_SITE_BASE_URL`.

Set the Umbraco content root explicitly with `NUXT_UMBRACO_START_ITEM`.

This lets the frontend run locally while still behaving as the correct public site and querying the correct Umbraco root.

Start the development server:

```bash
pnpm run dev
```

## Local HTTPS

Shared local wildcard certificates are stored at the repo root in `ssl/`.

Follow the root local SSL setup in [DEVELOPMENT.md](../../DEVELOPMENT.md#local-ssl) to generate:

- `ssl/local.hoite.dev.pem`
- `ssl/local.hoite.dev-key.pem`

If you're running the Umbraco instance locally, its certificate may not be trusted by Node. As a local workaround, add the following to your local `.env` file:
```NODE_TLS_REJECT_UNAUTHORIZED=0```

This is only required for local development.

## Multilingual

Locales are path-based in this app.

Examples:

```text
/en/
/da/
```

The app resolves the locale from the first path segment.

The root path `/` redirects to `NUXT_PUBLIC_FALLBACK_LOCALE`.

Other routes must start with a valid locale such as `/en/` or `/da/`.

Invalid or non-localized routes return a 404 via [`middleware/enforce-locale.global.ts`](./middleware/enforce-locale.global.ts).

## Build

Build the application:

```bash
pnpm run build
```

Preview the built app locally:

```bash
pnpm run preview
```

## Docker

Build the Docker image manually from the monorepo root:

```bash
docker build -f apps/site-nuxt/Dockerfile -t site-nuxt:local .
```

## Stack

- Nuxt
- Vite
- Pinia
- TypeScript
- PostCSS
