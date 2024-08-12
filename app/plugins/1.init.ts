export default defineNuxtPlugin(async () => {
  if (!import.meta.server) {
    return;
  }

  const { path } = useRoute();
  const { initSettings } = useSettings();
  const { initNavigation } = useNavigation();

  try {
    await Promise.allSettled([initSettings(path), initNavigation()]);
  } catch (_) {
    throw createError({
      statusCode: 500,
      message: 'Error initializing site'
    });
  }
});
