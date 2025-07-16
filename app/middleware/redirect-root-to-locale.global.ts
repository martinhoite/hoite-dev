import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app';
import { AvailableLocales, type Locale } from 'types';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/') return;

  const {
    public: { fallbackLocale }
  } = useRuntimeConfig();

  if (!AvailableLocales.includes(fallbackLocale as Locale)) return;

  return navigateTo(`/${fallbackLocale}`, { redirectCode: 302 });
});
