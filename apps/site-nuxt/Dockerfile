# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /workspace

ENV CI=true
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

COPY . .

RUN corepack enable
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter @hoite-dev/site-nuxt run build

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=build --chown=node:node /workspace/apps/site-nuxt/.output ./.output
COPY --chown=node:node apps/site-nuxt/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

USER node

ENTRYPOINT ["./docker-entrypoint.sh"]
