import type { UmbracoDeliveryApiResponse, UmbracoPageResponse } from '~/types/umbracoDeliveryApi';

export default function () {
  const getUmbracoContentByRoute = <PropertiesType = UmbracoPageResponse>(path: string) => {
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

  return {
    getUmbracoContentByRoute
  };
}
