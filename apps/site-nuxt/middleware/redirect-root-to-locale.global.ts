import { isLocale } from 'types';

import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/') {
    return;
  }

  const {
    public: { fallbackLocale },
  } = useRuntimeConfig();

  if (!isLocale(fallbackLocale)) {
    return;
  }

  return navigateTo(`/${fallbackLocale}`, { redirectCode: 302 });
});
