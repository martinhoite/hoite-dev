// plugins/2.logging.ts
import { LoggingService } from '~/services/loggingService';

export default defineNuxtPlugin(() => {
  const environment = process.env.NUXT_PUBLIC_ENVIRONMENT || useRuntimeConfig().public.environment || 'development';

  const logger = new LoggingService(environment);

  return {
    provide: {
      logger
    }
  };
});
