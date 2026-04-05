import { $fetch } from 'ofetch';

import {
  defaultExcludedDocTypeAliases,
  defaultRoutingExcludedDocTypeAliases,
} from '../config/default-doc-type-policy';
import {
  UmbracoConfigurationError,
  UmbracoExcludedContentError,
  UmbracoRequestError,
} from '../errors/umbraco-errors';
import { allUmbracoDocTypes } from '../generated/all-doc-types.generated';

import type {
  UmbracoClientConfig,
  UmbracoClientRequestOptions,
  UmbracoContentCollection,
  UmbracoContentItem,
  UmbracoContentQueryParameters,
} from '../types/umbraco';

const contentTypePrefix = 'contentType:';
const knownUmbracoDocTypes = new Set<string>(allUmbracoDocTypes);

const getFilterValues = (filter?: string | string[]) => {
  const filters = Array.isArray(filter) ? filter : filter ? [filter] : [];

  return filters.flatMap((value) => {
    if (!value.startsWith(contentTypePrefix)) {
      return [];
    }

    return value
      .slice(contentTypePrefix.length)
      .split(',')
      .map((alias) => alias.replace(/^!+/, '').trim())
      .filter(Boolean);
  });
};

const assertDocTypeIsPublic = (contentType: string, excludedDocTypeAliases: readonly string[]) => {
  if (excludedDocTypeAliases.includes(contentType)) {
    throw new UmbracoExcludedContentError(
      `Document type "${contentType}" is excluded from the public Umbraco client.`,
    );
  }
};

const assertRouteDocTypeIsPublic = (
  contentType: string,
  excludedDocTypeAliases: readonly string[],
  routingExcludedDocTypeAliases: readonly string[],
) => {
  if (
    excludedDocTypeAliases.includes(contentType) ||
    routingExcludedDocTypeAliases.includes(contentType)
  ) {
    throw new UmbracoExcludedContentError(
      `Document type "${contentType}" is excluded from route lookups in the public Umbraco client.`,
    );
  }
};

const assertFilterIsPublic = (
  parameters: UmbracoContentQueryParameters,
  excludedDocTypeAliases: readonly string[],
) => {
  for (const contentType of getFilterValues(parameters.filter)) {
    assertDocTypeIsPublic(contentType, excludedDocTypeAliases);
  }
};

const assertConfiguredDocTypesAreKnown = (
  configKey: 'excludedDocTypeAliases' | 'routingExcludedDocTypeAliases',
  docTypes: readonly string[],
) => {
  const unknownDocTypes = docTypes.filter((docType) => !knownUmbracoDocTypes.has(docType));

  if (unknownDocTypes.length > 0) {
    throw new UmbracoConfigurationError(
      `Unknown Umbraco doc type alias(es) in "${configKey}": ${unknownDocTypes.join(', ')}. ` +
        `Expected Umbraco contentType aliases, not route segments. ` +
        `Valid aliases: ${allUmbracoDocTypes.join(', ')}.`,
      { configKey },
    );
  }
};

const getErrorStatusCode = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }

  if (
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    typeof error.response.status === 'number'
  ) {
    return error.response.status;
  }

  return undefined;
};

const buildHeaders = (options: UmbracoClientRequestOptions, defaultHeaders?: HeadersInit) => {
  const headers = new Headers(defaultHeaders);

  if (options.locale) {
    headers.set('Accept-Language', options.locale);
  }

  if (options.preview) {
    headers.set('Preview', 'true');
  }

  if (options.startItem) {
    headers.set('Start-Item', options.startItem);
  }

  if (options.headers) {
    for (const [key, value] of new Headers(options.headers).entries()) {
      headers.set(key, value);
    }
  }

  return headers;
};

export const createUmbracoClient = (config: UmbracoClientConfig) => {
  const excludedDocTypeAliases = config.excludedDocTypeAliases ?? defaultExcludedDocTypeAliases;
  const routingExcludedDocTypeAliases =
    config.routingExcludedDocTypeAliases ?? defaultRoutingExcludedDocTypeAliases;
  const defaultHeaders = new Headers(config.defaultHeaders);

  assertConfiguredDocTypesAreKnown('excludedDocTypeAliases', excludedDocTypeAliases);
  assertConfiguredDocTypesAreKnown('routingExcludedDocTypeAliases', routingExcludedDocTypeAliases);

  if (config.deliveryApiKey) {
    defaultHeaders.set('Api-Key', config.deliveryApiKey);
  }

  const get = async <ResponseType>(
    path: string,
    query: Record<string, string | number | string[] | undefined>,
    options: UmbracoClientRequestOptions = {},
  ) => {
    try {
      return await $fetch<ResponseType>(path, {
        baseURL: config.baseUrl,
        headers: buildHeaders(options, defaultHeaders),
        query,
      });
    } catch (error) {
      const statusCode = getErrorStatusCode(error);

      if (statusCode === 404) {
        throw new UmbracoRequestError('Umbraco content request returned 404.', {
          cause: error,
          statusCode,
        });
      }

      if (statusCode != null) {
        throw new UmbracoRequestError(`Umbraco content request failed with status ${statusCode}.`, {
          cause: error,
          statusCode,
        });
      }

      throw new UmbracoRequestError('Umbraco content request failed.', {
        cause: error,
      });
    }
  };

  const getContent = async <Properties = unknown>(
    parameters: UmbracoContentQueryParameters,
    options: UmbracoClientRequestOptions = {},
  ) => {
    assertFilterIsPublic(parameters, excludedDocTypeAliases);

    const response = await get<UmbracoContentCollection<Properties>>(
      '/umbraco/delivery/api/v2/content',
      parameters,
      options,
    );

    for (const item of response.items) {
      assertDocTypeIsPublic(item.contentType, excludedDocTypeAliases);
    }

    return response;
  };

  const getContentByRoute = async <Properties = unknown>(
    routePath: string,
    options: UmbracoClientRequestOptions = {},
  ) => {
    const normalizedRoutePath = routePath.startsWith('/') ? routePath : `/${routePath}`;

    const response = await get<UmbracoContentItem<Properties>>(
      `/umbraco/delivery/api/v2/content/item${normalizedRoutePath}`,
      {},
      options,
    );

    assertRouteDocTypeIsPublic(
      response.contentType,
      excludedDocTypeAliases,
      routingExcludedDocTypeAliases,
    );

    return response;
  };

  return {
    excludedDocTypeAliases,
    routingExcludedDocTypeAliases,
    getContent,
    getContentByRoute,
  };
};
