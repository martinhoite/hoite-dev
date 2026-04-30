# @hoite-dev/umbraco-client

Source-oriented Umbraco content package for the Hoite Dev monorepo.

This package owns the Umbraco Delivery API client generation flow, generated source-shaped types, document type manifests, and the public content-facing exports consumed by apps.

It does not own app runtime configuration, local app HTTPS setup, routing behavior, or deployment concerns.

## Setup

The root generator command reads its environment from the root `.env` file.

Start from [`.env.example`](../../.env.example) and set:

```text
UMBRACO_OPENAPI_URL=https://<umbraco-origin>/umbraco/swagger/delivery/swagger.json
```

Optional:

```text
UMBRACO_OPENAPI_CA_CERT_PATH=C:/Users/<your-user>/AppData/Local/mkcert/rootCA.pem
```

`UMBRACO_OPENAPI_CA_CERT_PATH` is only needed when the OpenAPI URL uses HTTPS with a certificate authority that Node does not trust by default. This is separate from the repo `ssl/` wildcard certificates used by local apps.

## Generation

Run the generator from the repo root:

```bash
pnpm run generate:content:umbraco
```

Or run the package command directly:

```bash
pnpm --filter @hoite-dev/umbraco-client run generate
```

The direct package command expects `UMBRACO_OPENAPI_URL` and the optional
`UMBRACO_OPENAPI_CA_CERT_PATH` to already be available in the shell environment.

The generation flow:

1. Downloads the OpenAPI document into `openapi/umbraco-delivery.openapi.json`.
2. Generates TypeScript API types into `src/generated/umbraco-openapi.generated.ts`.
3. Derives document type unions from `openapi/doc-types.seed.json`.
4. Applies exclusions from `openapi/public-api.config.json`.
5. Formats generated files with Biome.

Generated outputs live under:

```text
openapi/
src/generated/
```

## Package boundary

This package includes:

- OpenAPI fetch and generation scripts
- Source-shaped Umbraco client exports
- Generated document type unions
- Public and internal Umbraco-related types and helpers

This package does not include:

- Repo-wide SSL certificate setup
- App host configuration
- Nuxt runtime configuration
- App-specific content shaping outside the shared content boundary

## Notes

The generator expects a live OpenAPI URL by default. If you need to work from a checked-in artifact instead, update `openapi/umbraco-delivery.openapi.json` and adjust `openapi/doc-types.seed.json` if the available document types changed.
