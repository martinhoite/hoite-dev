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
  const getCurrentStartItem = (): string => {
    const {
      public: { localDevelopmentSubdomain }
    } = useRuntimeConfig();
    return getSubdomain(useRequestHeaders().host) || localDevelopmentSubdomain;
  };

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
   *
   * @param parameters
   * @param customStartItem if not set, will default to the current subdomain as start item
   * @returns
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

  const getUmbracoSiteSettings = <PropertiesType = UmbracoSiteSettingsResponse>(locale: string) => {
    return getUmbracoContentByRoute<PropertiesType>(`/${locale}/settings`);
  };

  const getUmbracoNavigationItems = () => {
    // fetch=descendants%3A%2F&filter=contentType%3A%21siteSettings&fields=properties%5BincludeInNavigation%2CincludeChildrenInNavigation%5D`,
    // fetch=descendants:/&filter=contentType:!siteSettings&fields=properties[includeInNavigation,includeChildrenInNavigation]`,

    return getUmbracoContent<UmbracoNavigationItemProperties>({
      fetch: `descendants:${'/' as UmbracoNodePath}`,
      filter: `contentType:${'!siteSettings' as UmbracoAlias}`,
      fields: `properties${'[includeInNavigation, includeChildrenInNavigation]' as UmbracoPropertyAliasArray}`
    });

    // return UseFetch<UmbracoContentResponse<UmbracoNavigationItemProperties>>(
    //   `/umbraco/delivery/api/v2/content?
    //   {
    //     keepalive: true,
    //     headers
    //   }
    // );
  };

  return {
    getUmbracoContent,
    getUmbracoContentByRoute,
    getUmbracoSiteSettings,
    getUmbracoNavigationItems
  };
}
