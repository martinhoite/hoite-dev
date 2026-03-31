import type {
  ContentClientConfig,
  GetNavigationOptions,
  GetPageByRouteOptions,
  GetSiteSettingsOptions,
  UmbracoNavigationItemProperties,
  UmbracoPageResponse,
  UmbracoSiteSettingsResponse,
} from '../types/umbraco';
import {
  buildUmbracoNavigation,
  createIssueOperationContext,
  normalizeUmbracoPageItem,
  normalizeUmbracoSiteSettings,
} from '../utils/umbraco';
import { createUmbracoClient } from './create-umbraco-client';

export const createContentClient = (config: ContentClientConfig) => {
  const umbracoClient = createUmbracoClient({
    baseUrl: config.baseUrl,
    defaultHeaders: config.defaultHeaders,
    deliveryApiKey: config.deliveryApiKey,
    excludedDocTypes: config.excludedDocTypes,
  });

  const getPageByRoute = async ({ path, ...options }: GetPageByRouteOptions) => {
    const response = await umbracoClient.getContentByRoute<UmbracoPageResponse>(path, options);
    const operation = createIssueOperationContext({
      method: 'getPageByRoute',
      reportIssue: config.onIssue,
    });

    return normalizeUmbracoPageItem(response, operation);
  };

  const getSiteSettings = async (options: GetSiteSettingsOptions) => {
    const response = await umbracoClient.getContent<UmbracoSiteSettingsResponse>(
      {
        fields: 'properties[$all]',
        filter: 'contentType:siteSettings',
      },
      options,
    );

    const locale = options.locale;
    const matchingSiteSettings = locale
      ? response.items.find((item) => item.cultures?.[locale]?.path?.startsWith(`/${locale}`))
      : (response.items[0] ?? null);

    if (!matchingSiteSettings) {
      return null;
    }

    return normalizeUmbracoSiteSettings(
      matchingSiteSettings.properties,
      createIssueOperationContext({
        contentType: matchingSiteSettings.contentType,
        method: 'getSiteSettings',
        reportIssue: config.onIssue,
      }),
    );
  };

  const getNavigation = async (options: GetNavigationOptions) => {
    const response = await umbracoClient.getContent<UmbracoNavigationItemProperties>(
      {
        fetch: 'descendants:/',
        fields: 'properties[includeInNavigation, includeChildrenInNavigation]',
        filter: 'contentType:!siteSettings',
      },
      options,
    );

    return buildUmbracoNavigation(
      response.items,
      createIssueOperationContext({
        method: 'getNavigation',
        reportIssue: config.onIssue,
      }),
    );
  };

  return {
    excludedDocTypes: umbracoClient.excludedDocTypes,
    getNavigation,
    getPageByRoute,
    getSiteSettings,
  };
};
