export default defineNuxtPlugin(async () => {
  if (!import.meta.server) {
    return;
  }

  const { path } = useRoute();
  const { initSettings } = useSettings();

  try {
    await Promise.allSettled([initSettings(path)]);
  } catch (_) {
    throw createError({
      statusCode: 500,
      message: 'Error initializing site'
    });
  }
});
