import type { FetchOptions } from 'ofetch';
import type { Locale } from 'types';
import type { UmbracoNavigationItemProperties, UmbracoSiteSettingsResponse } from 'types/umbraco';
import type {
  UmbracoAlias,
  UmbracoContentResponse,
  UmbracoDeliveryApiResponse,
  UmbracoNodePath,
  UmbracoPageResponse,
} from 'types/umbracoDeliveryApi';

export default function () {
  const { getNormalizedHostname, isLocalhost } = useHost();

  const getCurrentStartItem = (): string => {
    const {
      public: { localContentHost },
    } = useRuntimeConfig();

    const hostname = getNormalizedHostname();

    if (isLocalhost()) {
      return getSubdomain(localContentHost) || '';
    }

    return getSubdomain(hostname) || '';
  };

  const setDefaultHeaders = (path: string = '', startItem: string = '') => {
    const {
      public: { fallbackLocale },
    } = useRuntimeConfig();
    const culture = getLocaleFromPath(path) || (fallbackLocale as Locale);

    const headers: HeadersInit = {
      'Accept-Language': culture,
      'x-start-item': startItem !== '' ? startItem : getCurrentStartItem(),
    };

    return headers;
  };

  const fetchFromUmbraco = <ResponseType = unknown>(
    path: string,
    options: FetchOptions<'json'> = {},
    pathForLocale: string = '',
    startItemOverride: string = '',
  ) => {
    const defaultHeaders = setDefaultHeaders(pathForLocale, startItemOverride);

    return UseFetch<ResponseType>(path, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });
  };

  const getUmbracoContent = <ItemTypes = unknown>({
    parameters,
    pathForLocale = '',
    startItem = '',
  }: {
    parameters: UmbracoContentParameters;
    pathForLocale?: string;
    startItem?: string;
  }) => {
    return fetchFromUmbraco<UmbracoContentResponse<ItemTypes>>(
      '/api/umbraco/content',
      {
        params: parameters,
      },
      pathForLocale,
      startItem,
    );
  };

  const getUmbracoContentByRoute = <PropertiesType = UmbracoPageResponse>({
    path,
  }: {
    path: string;
  }) => {
    return fetchFromUmbraco<UmbracoDeliveryApiResponse<PropertiesType>>(
      '/api/umbraco/content-by-route',
      {
        params: {
          path: removeLocaleFromPath(path),
        },
      },
      path,
    );
  };

  const getUmbracoSiteSettings = async ({ locale }: { locale: Locale }) => {
    const allSiteSettings = await getUmbracoContent<UmbracoSiteSettingsResponse>({
      parameters: {
        filter: `contentType:${'siteSettings' as UmbracoAlias}`,
        fields: 'properties[$all]',
      },
    });

    const matching = allSiteSettings?.items.find((item) => {
      const cultureInfo = item.cultures?.[locale];
      return cultureInfo?.path?.startsWith(`/${locale}`);
    });

    return matching ?? null;
  };

  const getUmbracoNavigationItems = ({
    startItem = '',
    pathForLocale = '',
  }: {
    startItem?: string;
    pathForLocale?: string;
  } = {}) => {
    return getUmbracoContent<UmbracoNavigationItemProperties>({
      parameters: {
        fetch: `descendants:${'/' as UmbracoNodePath}`,
        filter: `contentType:${'!siteSettings' as UmbracoAlias}`,
        fields: `properties${'[includeInNavigation, includeChildrenInNavigation]' as UmbracoPropertyAliasArray}`,
      },
      pathForLocale,
      startItem,
    });
  };

  return {
    getUmbracoContent,
    getUmbracoContentByRoute,
    getUmbracoSiteSettings,
    getUmbracoNavigationItems,
  };
}
