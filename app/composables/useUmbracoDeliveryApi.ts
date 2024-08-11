import type { Locale } from '~/types';
import type { UmbracoSiteSettingsResponse } from '~/types/umbraco';
import type {
  UmbracoContentHeaders,
  UmbracoDeliveryApiResponse,
  UmbracoPageResponse
} from '~/types/umbracoDeliveryApi';

export default function () {
  const getUmbracoContentByRoute = <PropertiesType = UmbracoPageResponse>(path: string) => {
    // TODO Extract startItem, culture and path handling for reuse.
    const {
      public: { localDevelopmentSubdomain, fallbackLocale }
    } = useRuntimeConfig();
    const startItem = getSubdomain(useRequestHeaders().host) || localDevelopmentSubdomain;
    const culture = getLocaleFromPath(path) || fallbackLocale;
    const pathWithoutLocale = removeLocaleFromPath(path);

    const headers: HeadersInit = {
      'Accept-Language': culture,
      'Start-Item': startItem
    };

    return UseFetch<UmbracoDeliveryApiResponse<PropertiesType>>(
      `/umbraco/delivery/api/v2/content/item${pathWithoutLocale}`,
      {
        keepalive: true,
        headers
      }
    );
  };

  const getUmbracoSiteSettings = <PropertiesType = UmbracoSiteSettingsResponse>(locale: string) => {
    return getUmbracoContentByRoute<PropertiesType>(`/${locale}/settings`);
  };

  // TODO: Create separate function for getting "list" content, and use that here instead of hardcoding the parameters
  const getUmbracoNavigationItems = (locale: Locale) => {
    // TODO: Extract startItem, culture and path handling for reuse.
    const {
      public: { localDevelopmentSubdomain }
    } = useRuntimeConfig();
    const startItem = getSubdomain(useRequestHeaders().host) || localDevelopmentSubdomain;

    const headers: HeadersInit = {
      'Accept-Language': locale,
      'Start-Item': startItem
    };

    return UseFetch<UmbracoNavigationItemsResponse>(
      `/umbraco/delivery/api/v2/content?fetch=descendants%3A%2F&filter=contentType%3A%21siteSettings&fields=properties%5BincludeInNavigation%2CincludeChildrenInNavigation%5D`,
      {
        keepalive: true,
        headers
      }
    );
  };

  return {
    getUmbracoContentByRoute,
    getUmbracoSiteSettings,
    getUmbracoNavigationItems
  };
}
