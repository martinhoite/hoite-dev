# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /workspace

ENV CI=true
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

COPY . .

RUN corepack enable
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter @hoite-dev/docs run build:static-host

FROM nginx:1.29-alpine AS runtime

COPY apps/docs/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/docs/dist /usr/share/nginx/html

EXPOSE 80
