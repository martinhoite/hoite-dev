import type {
  UmbracoDeliveryApiResponse,
  UmbracoNavigationItem,
  UmbracoPageResponse,
  UmbracoSiteSettings,
} from '@hoite-dev/content-client';
import type { Locale } from 'types';
import { isLocale } from 'types';

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

  const getLocale = (path: string = '') => {
    const {
      public: { fallbackLocale },
    } = useRuntimeConfig();

    const localeFromPath = getLocaleFromPath(path);

    if (localeFromPath) {
      return localeFromPath;
    }

    if (isLocale(fallbackLocale)) {
      return fallbackLocale;
    }

    throw new Error('Invalid NUXT_PUBLIC_FALLBACK_LOCALE runtime configuration.');
  };

  const getPageByRoute = ({ path }: { path: string }) => {
    return $fetch<UmbracoDeliveryApiResponse<UmbracoPageResponse>>('/api/content/page-by-route', {
      cache: 'no-cache',
      keepalive: true,
      params: {
        locale: getLocale(path),
        path: removeLocaleFromPath(path),
        startItem: getCurrentStartItem(),
      },
    });
  };

  const getSiteSettings = ({ locale }: { locale: Locale }) => {
    return $fetch<UmbracoSiteSettings | null>('/api/content/site-settings', {
      cache: 'no-cache',
      keepalive: true,
      params: {
        locale,
        startItem: getCurrentStartItem(),
      },
    });
  };

  const getNavigation = ({ pathForLocale = '' }: { pathForLocale?: string } = {}) => {
    return $fetch<UmbracoNavigationItem[]>('/api/content/navigation', {
      cache: 'no-cache',
      keepalive: true,
      params: {
        locale: getLocale(pathForLocale),
        startItem: getCurrentStartItem(),
      },
    });
  };

  return {
    getNavigation,
    getPageByRoute,
    getSiteSettings,
  };
}
