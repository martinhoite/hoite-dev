import type { Locale } from 'types';
import type { UmbracoSiteSettingsResponse } from 'types/umbraco';
import type {
  UmbracoAlias,
  UmbracoContentResponse,
  UmbracoDeliveryApiResponse,
  UmbracoNodePath,
  UmbracoPageResponse
} from 'types/umbracoDeliveryApi';

export default function () {
  /**
   * Gets the current start item based on the request host or a local development subdomain.
   *
   * @returns {string} The start item, which is either derived from the request host or the local development subdomain.
   */
  const getCurrentStartItem = (): string => {
    const requestUrl = useRequestURL();
    if (requestUrl.hostname.includes('local.hoite')) {
      const {
        public: { localDevelopmentHost }
      } = useRuntimeConfig();

      return getSubdomain(localDevelopmentHost) || '';
    }
    return getSubdomain(useRequestHeaders().host) || '';
  };

  /**
   * Sets the default headers for the HTTP request.
   *
   * @param {string} [path=''] - The path to determine the locale.
   * @param {string} [startItem=''] - An optional custom start item. If not provided, the default will be used.
   * @returns {HeadersInit} The headers object with 'Accept-Language' and 'Start-Item' fields.
   */
  const setDefaultHeaders = (path: string = '', startItem: string = '') => {
    const {
      public: { fallbackLocale }
    } = useRuntimeConfig();
    const culture = getLocaleFromPath(path) || (fallbackLocale as Locale);

    const headers: HeadersInit = {
      'Accept-Language': culture,
      'Start-Item': startItem !== '' ? startItem : getCurrentStartItem()
    };

    return headers;
  };

  /**
   * Fetches Umbraco content based on provided parameters and an optional custom start item.
   *
   * @template ItemTypes - The type of items expected in the response.
   * @param {UmbracoContentParameters} parameters - The parameters to fetch Umbraco content.
   * @param {string} [customStartItem=''] - An optional custom start item. If not provided, defaults to the current subdomain.
   * @returns {Promise<UseFetchResponse<UmbracoContentResponse<ItemTypes>>>} The fetch response with Umbraco content.
   */
  const getUmbracoContent = <ItemTypes = unknown>(
    parameters: UmbracoContentParameters,
    customStartItem: string = ''
  ) => {
    const headers = setDefaultHeaders(customStartItem);

    return UseFetch<UmbracoContentResponse<ItemTypes>>('/umbraco/delivery/api/v2/content', {
      keepalive: true,
      params: parameters,
      headers
    });
  };

  /**
   * Fetches Umbraco content based on the route provided.
   *
   * @template PropertiesType - The type of properties expected in the response.
   * @param {string} path - The path to fetch content for.
   * @returns {Promise<UseFetchResponse<UmbracoDeliveryApiResponse<PropertiesType>>>} The fetch response with Umbraco content.
   */
  const getUmbracoContentByRoute = <PropertiesType = UmbracoPageResponse>(path: string) => {
    const pathWithoutLocale = removeLocaleFromPath(path);
    const headers = setDefaultHeaders(path);

    return UseFetch<UmbracoDeliveryApiResponse<PropertiesType>>(
      `/umbraco/delivery/api/v2/content/item${pathWithoutLocale}`,
      {
        keepalive: true,
        headers
      }
    );
  };

  /**
   * Fetches Umbraco site settings based on the provided locale.
   *
   * @template PropertiesType - The type of properties expected in the response.
   * @param {string} locale - The locale to fetch site settings for.
   * @returns {Promise<UseFetchResponse<UmbracoSiteSettingsResponse<PropertiesType>>>} The fetch response with Umbraco site settings.
   */
  const getUmbracoSiteSettings = <PropertiesType = UmbracoSiteSettingsResponse>(locale: string) => {
    return getUmbracoContentByRoute<PropertiesType>(`/${locale}/settings`);
  };

  /**
   * Fetches Umbraco navigation items with predefined parameters for filtering and sorting.
   *
   * @returns {Promise<UseFetchResponse<UmbracoContentResponse<UmbracoNavigationItemProperties>>>} The fetch response with Umbraco navigation items.
   */
  const getUmbracoNavigationItems = () => {
    return getUmbracoContent<UmbracoNavigationItemProperties>({
      fetch: `descendants:${'/' as UmbracoNodePath}`,
      filter: `contentType:${'!siteSettings' as UmbracoAlias}`,
      fields: `properties${'[includeInNavigation, includeChildrenInNavigation]' as UmbracoPropertyAliasArray}`
    });
  };

  return {
    getUmbracoContent,
    getUmbracoContentByRoute,
    getUmbracoSiteSettings,
    getUmbracoNavigationItems
  };
}
