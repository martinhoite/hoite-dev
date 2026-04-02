import { $fetch } from 'ofetch';

import { defaultExcludedDocTypes } from '../config/default-excluded-doc-types';

import type {
  UmbracoClientConfig,
  UmbracoClientRequestOptions,
  UmbracoContentCollection,
  UmbracoContentItem,
  UmbracoContentQueryParameters,
} from '../types/umbraco';

const contentTypePrefix = 'contentType:';

export class UmbracoExcludedContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UmbracoExcludedContentError';
  }
}

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

const assertDocTypeIsPublic = (contentType: string, excludedDocTypes: readonly string[]) => {
  if (excludedDocTypes.includes(contentType)) {
    throw new UmbracoExcludedContentError(
      `Document type "${contentType}" is excluded from the public Umbraco client.`,
    );
  }
};

const assertFilterIsPublic = (
  parameters: UmbracoContentQueryParameters,
  excludedDocTypes: readonly string[],
) => {
  for (const contentType of getFilterValues(parameters.filter)) {
    assertDocTypeIsPublic(contentType, excludedDocTypes);
  }
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
  const excludedDocTypes = config.excludedDocTypes ?? defaultExcludedDocTypes;
  const defaultHeaders = new Headers(config.defaultHeaders);

  if (config.deliveryApiKey) {
    defaultHeaders.set('Api-Key', config.deliveryApiKey);
  }

  const get = async <ResponseType>(
    path: string,
    query: Record<string, string | number | string[] | undefined>,
    options: UmbracoClientRequestOptions = {},
  ) =>
    await $fetch<ResponseType>(path, {
      baseURL: config.baseUrl,
      headers: buildHeaders(options, defaultHeaders),
      query,
    });

  const getContent = async <Properties = unknown>(
    parameters: UmbracoContentQueryParameters,
    options: UmbracoClientRequestOptions = {},
  ) => {
    assertFilterIsPublic(parameters, excludedDocTypes);

    const response = await get<UmbracoContentCollection<Properties>>(
      '/umbraco/delivery/api/v2/content',
      parameters,
      options,
    );

    for (const item of response.items) {
      assertDocTypeIsPublic(item.contentType, excludedDocTypes);
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

    assertDocTypeIsPublic(response.contentType, excludedDocTypes);

    return response;
  };

  return {
    excludedDocTypes,
    getContent,
    getContentByRoute,
  };
};
