import type { UmbracoSiteSettings, UrlString } from '@hoite-dev/content-client';
import { toUrlString } from '@hoite-dev/content-client';
import { isLocale } from 'types';

const createDefaultSiteSettings = (): UmbracoSiteSettings => ({
  defaultTheme: 'dark',
  footerLogo: null,
  headerLogo: null,
  headerLogoLink: null,
  headerLogoText: null,
  metaTitleExtension: '',
  seoOpenGraphFallbackImage: null,
  seoTwitterFallbackImage: null,
});

export const useSettings = defineStore('settings', () => {
  const {
    public: { fallbackLocale, localContentHost },
  } = useRuntimeConfig();
  const { getCurrentHost, isLocalhost } = useHost();

  const settings = shallowRef<UmbracoSiteSettings>(createDefaultSiteSettings());
  const currentHostUrl = shallowRef<UrlString>(setCurrentHostUrl());

  function setCurrentHostUrl(): UrlString {
    if (isLocalhost()) {
      return toUrlString(`https://${localContentHost}`);
    }

    const hostWithPort = getCurrentHost();
    return toUrlString(`https://${hostWithPort}`);
  }

  async function initSettings(path: string) {
    const { getSiteSettings } = useContentApi();
    const locale = getLocaleFromPath(path) || (isLocale(fallbackLocale) ? fallbackLocale : null);

    if (!locale) {
      throw new Error('Invalid NUXT_PUBLIC_FALLBACK_LOCALE runtime configuration.');
    }

    const siteSettings = await getSiteSettings({ locale });
    if (!siteSettings) {
      throw new Error(`Missing site settings for locale "${locale}"`);
    }

    settings.value = siteSettings;
  }

  return {
    settings,
    currentHostUrl,
    initSettings,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
