#!/bin/sh

set -eu

require_env() {
  variable_name="$1"
  variable_value="$(printenv "$variable_name" 2>/dev/null || true)"

  if [ -z "$variable_value" ]; then
    echo "Missing required environment variable: $variable_name" >&2
    exit 1
  fi
}

export NODE_ENV="${NODE_ENV:-production}"
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-3000}"
export NITRO_HOST="${NITRO_HOST:-$HOST}"
export NITRO_PORT="${NITRO_PORT:-$PORT}"

require_env "NUXT_PUBLIC_ENVIRONMENT"
require_env "NUXT_PUBLIC_FALLBACK_LOCALE"
require_env "NUXT_PUBLIC_SITE_BASE_URL"
require_env "NUXT_UMBRACO_BASE_URL"
require_env "NUXT_UMBRACO_START_ITEM"

exec node .output/server/index.mjs
