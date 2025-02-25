import { LoggingService } from '~/services/loggingService';

export default defineNuxtPlugin(() => {
  if (!import.meta.server) {
    return;
  }

  const environment = process.env.NUXT_PUBLIC_ENVIRONMENT || 'development';

  return {
    provide: {
      logger: new LoggingService(environment)
    }
  };
});
