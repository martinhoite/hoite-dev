import {
  createUmbracoContentClient,
  defaultExcludedDocTypeAliases,
  defaultRoutingExcludedDocTypeAliases,
  getUmbracoPublicErrorInfo,
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
  type UmbracoPublicErrorCode,
  umbracoPublicErrorCodes,
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

const parseDocTypeList = (value: string) => {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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

const getLogger = () => {
  const {
    public: { environment },
  } = useRuntimeConfig();

  return new LoggingService(environment || 'development');
};

const publicContentStatusMessages: Record<UmbracoPublicErrorCode, string> = {
  [umbracoPublicErrorCodes.contentConfigurationError]: 'Content is temporarily unavailable.',
  [umbracoPublicErrorCodes.contentNotFound]: 'Content not found.',
  [umbracoPublicErrorCodes.contentServiceError]: 'Content could not be loaded.',
};

export const toContentHttpError = (error: unknown) => {
  const publicErrorInfo = getUmbracoPublicErrorInfo(error);

  if (publicErrorInfo) {
    getLogger().error('[umbraco-client] Public content error', false, error);

    return createError({
      data: {
        code: publicErrorInfo.code,
      },
      statusCode: publicErrorInfo.statusCode,
      statusMessage: publicContentStatusMessages[publicErrorInfo.code],
    });
  }

  return error;
};

const logContentIssue = (issue: UmbracoContentClientIssue) => {
  getLogger().warn('[umbraco-client]', false, issue);
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

  const excludedDocTypeAliases = parseDocTypeList(config.umbracoExcludedDocTypeAliases);
  const routingExcludedDocTypeAliases = parseDocTypeList(
    config.umbracoRoutingExcludedDocTypeAliases,
  );
  const startItem = getConfiguredUmbracoStartItem(config.umbracoStartItem);

  const client = createUmbracoContentClient({
    baseUrl: config.umbracoBaseUrl,
    deliveryApiKey: config.umbracoDeliveryApiKey || undefined,
    excludedDocTypeAliases:
      excludedDocTypeAliases.length > 0 ? excludedDocTypeAliases : defaultExcludedDocTypeAliases,
    onIssue: logContentIssue,
    routingExcludedDocTypeAliases:
      routingExcludedDocTypeAliases.length > 0
        ? routingExcludedDocTypeAliases
        : defaultRoutingExcludedDocTypeAliases,
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
