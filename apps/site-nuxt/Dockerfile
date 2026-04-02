# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /workspace

ENV CI=true
ENV npm_config_update_notifier=false

COPY . .

RUN --mount=type=cache,target=/root/.npm npm ci
RUN npm run build --workspace @hoite-dev/site-nuxt

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=build --chown=node:node /workspace/apps/site-nuxt/.output ./.output

EXPOSE 3000

USER node

CMD ["node", ".output/server/index.mjs"]
