import { AvailableLocales, isLocale } from 'types';

import { createError, defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app';

const missingLocaleErrorData = {
  availableLocales: [...AvailableLocales],
  code: 'missing-locale',
} as const;

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/') {
    const {
      public: { fallbackLocale },
    } = useRuntimeConfig();

    if (!isLocale(fallbackLocale)) {
      return;
    }

    return navigateTo(`/${fallbackLocale}`, { redirectCode: 302 });
  }

  const firstPathSegment = to.path.split('/').filter((segment) => {
    return segment.length > 0;
  })[0];

  if (isLocale(firstPathSegment)) {
    return;
  }

  throw createError({
    data: missingLocaleErrorData,
    statusCode: 404,
    statusMessage: 'A valid locale is required in the URL.',
  });
});
