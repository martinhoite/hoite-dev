import type { Locale } from '~/types';

export default defineNuxtPlugin(async () => {
  if (!import.meta.server) {
    return;
  }

  const {
    public: { fallbackLocale }
  } = useRuntimeConfig();
  const { path } = useRoute();
  const locale = getLocaleFromPath(path) || (fallbackLocale as Locale);
  const { initSettings } = useSettings();
  const { initNavigation } = useNavigation();

  try {
    await Promise.allSettled([initSettings(path), initNavigation(locale)]);
  } catch (_) {
    throw createError({
      statusCode: 500,
      message: 'Error initializing site'
    });
  }
});
