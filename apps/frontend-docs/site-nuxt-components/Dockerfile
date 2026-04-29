# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /workspace

ENV CI=true
ENV npm_config_update_notifier=false

COPY . .

RUN --mount=type=cache,target=/root/.npm npm ci
RUN npm run build --workspace @hoite-dev/frontend-docs-site-nuxt-components

FROM nginx:1.29-alpine AS runtime

COPY --from=build /workspace/apps/frontend-docs/site-nuxt-components/storybook-static /usr/share/nginx/html

EXPOSE 80
