# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /workspace

ENV CI=true
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

COPY . .

RUN corepack enable
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter @hoite-dev/ui run build
RUN pnpm --filter @hoite-dev/frontend-docs-design-system-react run build

FROM nginx:1.29-alpine AS runtime

COPY --from=build /workspace/apps/frontend-docs/design-system-react/storybook-static /usr/share/nginx/html

EXPOSE 80
