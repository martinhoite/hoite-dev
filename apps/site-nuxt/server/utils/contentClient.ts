import {
  type ContentClientIssue,
  createContentClient,
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
  UmbracoExcludedContentError,
} from '@hoite-dev/content-client';
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

export const getStartItemValue = (value: unknown): StartItemKey | undefined => {
  const queryValue = getOptionalQueryString(value);

  if (queryValue == null) {
    return undefined;
  }

  if (!isStartItemKey(queryValue)) {
    throw createInvalidQueryError('startItem', 'a start item key string');
  }

  return toStartItemKey(queryValue);
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

const logContentIssue = (issue: ContentClientIssue) => {
  const {
    public: { environment },
  } = useRuntimeConfig();
  const logger = new LoggingService(environment || 'development');

  logger.warn('[content-client]', false, issue);
};

export const createServerContentClient = () => {
  const config = useRuntimeConfig();

  if (!config.umbracoBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_UMBRACO_BASE_URL runtime configuration.',
    });
  }

  const excludedDocTypes = config.umbracoExcludedDocTypes
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return createContentClient({
    baseUrl: config.umbracoBaseUrl,
    deliveryApiKey: config.umbracoDeliveryApiKey || undefined,
    excludedDocTypes: excludedDocTypes.length > 0 ? excludedDocTypes : defaultExcludedDocTypes,
    onIssue: logContentIssue,
  });
};
