import {
  createUmbracoContentClient,
  defaultExcludedDocTypes,
  isLocaleCode,
  isRoutePath,
  isStartItemKey,
  type LocaleCode,
  type RoutePath,
  type StartItemKey,
  toLocaleCode,
  toRoutePath,
  toStartItemKey,
  type UmbracoContentClientIssue,
  UmbracoExcludedContentError,
} from '@hoite-dev/umbraco-client';
import { createError } from 'h3';
import { LoggingService } from '~/services/loggingService';

const getOptionalQueryString = (value: unknown) => {
  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === 'string' ? firstValue : undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return undefined;
};

export { getOptionalQueryString };

export const getBooleanValue = (value: unknown) => {
  const resolved = getOptionalQueryString(value)?.toLowerCase();

  if (!resolved) {
    return undefined;
  }

  if (resolved === 'true') {
    return true;
  }

  if (resolved === 'false') {
    return false;
  }

  return undefined;
};

const createInvalidQueryError = (queryName: string, expectedDescription: string) =>
  createError({
    statusCode: 400,
    statusMessage: `Invalid ${queryName} query parameter. Expected ${expectedDescription}.`,
  });

export const getLocaleValue = (value: unknown): LocaleCode | undefined => {
  const queryValue = getOptionalQueryString(value);

  if (queryValue == null) {
    return undefined;
  }

  if (!isLocaleCode(queryValue)) {
    throw createInvalidQueryError('locale', 'a locale code string');
  }

  return toLocaleCode(queryValue);
};

export const getRoutePathValue = (value: unknown): RoutePath | undefined => {
  const queryValue = getOptionalQueryString(value);

  if (queryValue == null) {
    return undefined;
  }

  if (!isRoutePath(queryValue)) {
    throw createInvalidQueryError('path', 'a root-relative route path');
  }

  return toRoutePath(queryValue);
};

export const toContentHttpError = (error: unknown) => {
  if (error instanceof UmbracoExcludedContentError) {
    return createError({
      statusCode: 404,
      statusMessage: error.message,
    });
  }

  return error;
};

const logContentIssue = (issue: UmbracoContentClientIssue) => {
  const {
    public: { environment },
  } = useRuntimeConfig();
  const logger = new LoggingService(environment || 'development');

  logger.warn('[umbraco-client]', false, issue);
};

const getConfiguredUmbracoStartItem = (value: string): StartItemKey => {
  if (!isStartItemKey(value)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid NUXT_UMBRACO_START_ITEM runtime configuration.',
    });
  }

  return toStartItemKey(value);
};

export const createServerUmbracoContentClient = () => {
  const config = useRuntimeConfig();

  if (!config.umbracoBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_UMBRACO_BASE_URL runtime configuration.',
    });
  }

  if (!config.umbracoStartItem) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_UMBRACO_START_ITEM runtime configuration.',
    });
  }

  const excludedDocTypes = config.umbracoExcludedDocTypes
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const startItem = getConfiguredUmbracoStartItem(config.umbracoStartItem);

  const client = createUmbracoContentClient({
    baseUrl: config.umbracoBaseUrl,
    deliveryApiKey: config.umbracoDeliveryApiKey || undefined,
    excludedDocTypes: excludedDocTypes.length > 0 ? excludedDocTypes : defaultExcludedDocTypes,
    onIssue: logContentIssue,
  });

  return {
    getNavigation: (options: Omit<Parameters<typeof client.getNavigation>[0], 'startItem'>) =>
      client.getNavigation({
        ...options,
        startItem,
      }),
    getPageByRoute: (options: Omit<Parameters<typeof client.getPageByRoute>[0], 'startItem'>) =>
      client.getPageByRoute({
        ...options,
        startItem,
      }),
    getSiteSettings: (options: Omit<Parameters<typeof client.getSiteSettings>[0], 'startItem'>) =>
      client.getSiteSettings({
        ...options,
        startItem,
      }),
  };
};
