import type { FetchOptions } from 'ofetch';
import type { Locale } from 'types';
import type { UmbracoNavigationItemProperties, UmbracoSiteSettingsResponse } from 'types/umbraco';
import type {
  UmbracoAlias,
  UmbracoContentResponse,
  UmbracoDeliveryApiResponse,
  UmbracoNodePath,
  UmbracoPageResponse
} from 'types/umbracoDeliveryApi';

export default function () {
  const { getNormalizedHostname, isLocalhost } = useHost();
  /**
   * Gets the current start item based on the request host or a local development subdomain.
   *
   * @returns {string} The start item, which is either derived from the request host or the local development subdomain.
   */
  const getCurrentStartItem = (): string => {
    const {
      public: { localContentHost }
    } = useRuntimeConfig();

    const hostname = getNormalizedHostname();

    if (isLocalhost()) {
      return getSubdomain(localContentHost) || '';
    }

    return getSubdomain(hostname) || '';
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
   * Wraps UseFetch to ensure default headers (locale + start item) are always applied.
   *
   * @template ResponseType - The expected response payload.
   * @param {string} path - The API path to call.
   * @param {FetchOptions<'json'>} options - Additional fetch options.
   * @param {string} [pathForLocale=''] - Optional path used to derive locale header.
   * @param {string} [startItemOverride=''] - Optional start item override.
   * @returns {Promise<ResponseType>} Fetch response with defaults applied.
   */
  const fetchFromUmbraco = <ResponseType = unknown>(
    path: string,
    options: FetchOptions<'json'> = {},
    pathForLocale: string = '',
    startItemOverride: string = ''
  ) => {
    const defaultHeaders = setDefaultHeaders(pathForLocale, startItemOverride);

    return UseFetch<ResponseType>(path, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });
  };

  /**
   * Fetches Umbraco content based on provided parameters and optional overrides.
   *
   * @template ItemTypes - The type of items expected in the response.
   * @param {object} args - Object of arguments.
   * @param {UmbracoContentParameters} args.parameters - Parameters to control the content query.
   * @param {string} [args.pathForLocale=''] - Path used to derive the Accept-Language header.
   * @param {string} [args.startItem=''] - Optional custom start item, defaults to inferred start item.
   * @returns {Promise<UseFetchResponse<UmbracoContentResponse<ItemTypes>>>} The fetch response with Umbraco content.
   */
  const getUmbracoContent = <ItemTypes = unknown>({
    parameters,
    pathForLocale = '',
    startItem = ''
  }: {
    parameters: UmbracoContentParameters;
    pathForLocale?: string;
    startItem?: string;
  }) => {
    return fetchFromUmbraco<UmbracoContentResponse<ItemTypes>>(
      '/umbraco/delivery/api/v2/content',
      {
        params: parameters
      },
      pathForLocale,
      startItem
    );
  };

  /**
   * Fetches Umbraco content based on the route provided.
   *
   * @template PropertiesType - The type of properties expected in the response.
   * @param {object} args - Object of arguments.
   * @param {string} args.path - The path to fetch content for.
   * @returns {Promise<UseFetchResponse<UmbracoDeliveryApiResponse<PropertiesType>>>} The fetch response with Umbraco content.
   */
  const getUmbracoContentByRoute = <PropertiesType = UmbracoPageResponse>({ path }: { path: string }) => {
    const pathWithoutLocale = removeLocaleFromPath(path);
    return fetchFromUmbraco<UmbracoDeliveryApiResponse<PropertiesType>>(
      `/umbraco/delivery/api/v2/content/item${pathWithoutLocale}`,
      {},
      path
    );
  };

  /**
   * Fetches Umbraco site settings based on the provided locale.
   *
   * @template PropertiesType - The type of properties expected in the response.
   * @param {object} args - Object of arguments.
   * @param {Locale} args.locale - The locale to fetch site settings for.
   * @returns {Promise<UseFetchResponse<UmbracoSiteSettingsResponse<PropertiesType>>>} The fetch response with Umbraco site settings.
   */
  const getUmbracoSiteSettings = async ({ locale }: { locale: Locale }) => {
    const allSiteSettings = await getUmbracoContent<UmbracoSiteSettingsResponse>({
      parameters: {
        filter: `contentType:${'siteSettings' as UmbracoAlias}`,
        fields: 'properties[$all]'
      }
    });

    const matching = allSiteSettings?.items.find((item) => {
      const cultureInfo = item.cultures?.[locale];
      return cultureInfo?.path?.startsWith(`/${locale}`);
    });

    return matching ?? null;
  };

  /**
   * Fetches Umbraco navigation items with predefined parameters for filtering and sorting.
   *
   * @param {object} [args] - Optional arguments.
   * @param {string} [args.startItem] - Optional start item override.
   * @param {string} [args.pathForLocale] - Optional path to derive locale header.
   * @returns {Promise<UseFetchResponse<UmbracoContentResponse<UmbracoNavigationItemProperties>>>} The fetch response with Umbraco navigation items.
   */
  const getUmbracoNavigationItems = ({
    startItem = '',
    pathForLocale = ''
  }: {
    startItem?: string;
    pathForLocale?: string;
  } = {}) => {
    return getUmbracoContent<UmbracoNavigationItemProperties>({
      parameters: {
        fetch: `descendants:${'/' as UmbracoNodePath}`,
        filter: `contentType:${'!siteSettings' as UmbracoAlias}`,
        fields: `properties${'[includeInNavigation, includeChildrenInNavigation]' as UmbracoPropertyAliasArray}`
      },
      pathForLocale,
      startItem
    });
  };

  return {
    getUmbracoContent,
    getUmbracoContentByRoute,
    getUmbracoSiteSettings,
    getUmbracoNavigationItems
  };
}
