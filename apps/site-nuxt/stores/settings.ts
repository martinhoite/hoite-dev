import type { UmbracoSiteSettings, UrlString } from '@hoite-dev/umbraco-client';
import { toUrlString } from '@hoite-dev/umbraco-client';
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
    public: { fallbackLocale, siteBaseUrl },
  } = useRuntimeConfig();

  const settings = shallowRef<UmbracoSiteSettings>(createDefaultSiteSettings());
  const siteUrl = shallowRef<UrlString>(setSiteUrl());

  function setSiteUrl(): UrlString {
    if (!siteBaseUrl) {
      throw new Error('Missing NUXT_PUBLIC_SITE_BASE_URL runtime configuration.');
    }

    return toUrlString(siteBaseUrl);
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
    siteUrl,
    initSettings,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
