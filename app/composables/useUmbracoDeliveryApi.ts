import type { UmbracoDeliveryApiResponse, UmbracoPageResponse } from '~/types/umbracoDeliveryApi';

export default function () {
  const getUmbracoContentByRoute = <PropertiesType = UmbracoPageResponse>(url: string) => {
    return UseFetch<UmbracoDeliveryApiResponse<PropertiesType>>('/umbraco/delivery/api/v2/content/item', {
      params: {
        url
      },
      keepalive: true
    });
  };

  return {
    getUmbracoContentByRoute
  };
}
