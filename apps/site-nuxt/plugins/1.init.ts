export default defineNuxtPlugin(async () => {
  if (!import.meta.server) {
    return;
  }

  const { path } = useRoute();
  const site = useSite();
  const navigation = useNavigation();

  try {
    await Promise.allSettled([site.init(path), navigation.init()]);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error initializing site',
      data: error,
    });
  }
});
