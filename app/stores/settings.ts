import type { SimplifiedUmbracoLink, SiteSettingsLogo, UmbracoImage, UmbracoSiteSettings } from '~/types/umbraco';

export const useSettings = defineStore('settings', () => {
  const {
    public: { fallbackLocale }
  } = useRuntimeConfig();

  const settings = shallowRef<UmbracoSiteSettings>({} as UmbracoSiteSettings);
  const currentHostUrl = shallowRef<URLString>(setCurrentHostUrl());

  function setCurrentHostUrl(): URLString {
    const requestUrl = useRequestURL();

    if (requestUrl.hostname.includes('local.hoite')) {
      const {
        public: { localDevelopmentHost }
      } = useRuntimeConfig();

      return `https://${localDevelopmentHost}` as URLString;
    }

    return `https://${requestUrl.host}` as URLString;
  }

  async function initSettings(path: string) {
    const { getUmbracoSiteSettings } = useUmbracoDeliveryApi();
    const locale = getLocaleFromPath(path) || fallbackLocale;

    const { properties: siteSettings } = await getUmbracoSiteSettings(locale);

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
