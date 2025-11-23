import type { SiteSettingsLogo, UmbracoImage, UmbracoSiteSettings } from '~/types/umbraco';

export const useSettings = defineStore('settings', () => {
  const {
    public: { fallbackLocale, localContentHost }
  } = useRuntimeConfig();
  const { getCurrentHost, isLocalhost } = useHost();

  const settings = shallowRef<UmbracoSiteSettings>({} as UmbracoSiteSettings);
  const currentHostUrl = shallowRef<URLString>(setCurrentHostUrl());

  function setCurrentHostUrl(): URLString {
    if (isLocalhost()) {
      return `https://${localContentHost}` as URLString;
    }

    const hostWithPort = getCurrentHost();
    return `https://${hostWithPort}` as URLString;
  }

  async function initSettings(path: string) {
    const { getUmbracoSiteSettings } = useUmbracoDeliveryApi();
    const locale = getLocaleFromPath(path) || (fallbackLocale as Locale);

    const siteSettingsResponse = await getUmbracoSiteSettings({ locale });
    if (!siteSettingsResponse) {
      throw new Error(`Missing site settings for locale "${locale}"`);
    }

    const { properties: siteSettings } = siteSettingsResponse;

    const theme = siteSettings.defaultTheme?.toString().toLowerCase();
    const defaultTheme: Theme = AvailableThemes.includes(theme as Theme) ? (theme as Theme) : 'dark';

    // TODO: Custom extension of API to send single arrays as an object for links and images.
    settings.value = {
      metaTitleExtension: siteSettings.metaTitleExtension || '',
      seoTwitterFallbackImage: handleUmbracoSingleArray<UmbracoImage>(siteSettings.seoTwitterFallbackImage),
      seoOpenGraphFallbackImage: handleUmbracoSingleArray<UmbracoImage>(siteSettings.seoOpenGraphFallbackImage),
      headerLogo: handleUmbracoSingleArray<SiteSettingsLogo>(siteSettings.headerLogo),
      headerLogoLink: getSingleUmbracoUrlFromArray(siteSettings.headerLogoLink),
      headerLogoText: siteSettings.headerLogoText,
      footerLogo: handleUmbracoSingleArray<SiteSettingsLogo>(siteSettings.footerLogo),
      defaultTheme
    };
  }

  return {
    settings,
    currentHostUrl,
    initSettings
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
