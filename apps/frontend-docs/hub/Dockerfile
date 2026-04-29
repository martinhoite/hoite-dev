# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build

WORKDIR /workspace

ENV CI=true
ENV npm_config_update_notifier=false

ARG STORYBOOK_REACT_REF_URL=/refs/react/
ARG STORYBOOK_VUE_REF_URL=/refs/vue/
ARG STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL=/refs/site-nuxt-components/

COPY . .

RUN --mount=type=cache,target=/root/.npm npm ci
RUN npm run build --workspace @hoite-dev/frontend-docs-design-system-react
RUN npm run build --workspace @hoite-dev/frontend-docs-design-system-vue
RUN npm run build --workspace @hoite-dev/frontend-docs-site-nuxt-components
RUN STORYBOOK_REACT_REF_URL=$STORYBOOK_REACT_REF_URL STORYBOOK_VUE_REF_URL=$STORYBOOK_VUE_REF_URL STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL=$STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL npm run build --workspace @hoite-dev/frontend-docs-hub

FROM nginx:1.29-alpine AS runtime

COPY apps/frontend-docs/hub/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/frontend-docs/hub/storybook-static /usr/share/nginx/html
COPY --from=build /workspace/apps/frontend-docs/design-system-react/storybook-static /usr/share/nginx/html/refs/react
COPY --from=build /workspace/apps/frontend-docs/design-system-vue/storybook-static /usr/share/nginx/html/refs/vue
COPY --from=build /workspace/apps/frontend-docs/site-nuxt-components/storybook-static /usr/share/nginx/html/refs/site-nuxt-components

EXPOSE 80
