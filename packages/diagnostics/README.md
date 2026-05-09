# `@hoite-dev/diagnostics`

Small shared diagnostics utilities for the monorepo.

## Purpose

- Provide lightweight runtime diagnostics helpers that can be reused across apps and packages.
- Keep diagnostics behavior centralized instead of repeating local helper functions.

## Current API

- `warnInDevelopment(message, options?)`
  - Logs with `console.warn` only when `NODE_ENV === 'development'`.
  - Supports optional deduplication with `options.key` (warn once per key per runtime).

## Usage

```ts
import { warnInDevelopment } from '@hoite-dev/diagnostics';

warnInDevelopment('Missing optional docs metadata', { key: 'docs:metadata:missing' });
```

## Scripts

- `pnpm --filter @hoite-dev/diagnostics lint`
- `pnpm --filter @hoite-dev/diagnostics typecheck`
- `pnpm --filter @hoite-dev/diagnostics build`
