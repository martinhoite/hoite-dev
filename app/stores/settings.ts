import type { SimplifiedUmbracoLink, UmbracoImage, UmbracoSiteSettings } from '~/types/umbraco';

export const useSettings = defineStore('settings', () => {
  const {
    public: { fallbackLocale }
  } = useRuntimeConfig();

  const settings = shallowRef<UmbracoSiteSettings>({} as UmbracoSiteSettings);
  const currentHostUrl = shallowRef<URLString>(setCurrentHostUrl());

  function setCurrentHostUrl(): URLString {
    const requestUrl = useRequestURL();

    if (requestUrl.hostname.includes('localhost')) {
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

    const settingsResponse = await getUmbracoSiteSettings(locale);

    // TODO: Custom extension of API to send single arrays as an object for links and images.
    settings.value = {
      metaTitleExtension: settingsResponse.properties.metaTitleExtension || '',
      seoTwitterFallbackImage: handleUmbracoSingleArray(
        settingsResponse.properties.seoTwitterFallbackImage
      ) as UmbracoImage,
      seoOpenGraphFallbackImage: handleUmbracoSingleArray(
        settingsResponse.properties.seoOpenGraphFallbackImage
      ) as UmbracoImage,
      lightThemeHeaderLogo: handleUmbracoSingleArray(settingsResponse.properties.lightThemeHeaderLogo) as UmbracoImage,
      darkThemeHeaderLogo: handleUmbracoSingleArray(settingsResponse.properties.darkThemeHeaderLogo) as UmbracoImage,
      headerLogoLink: getSingleUmbracoUrlFromArray(settingsResponse.properties.headerLogoLink) as SimplifiedUmbracoLink,
      headerLogoText: settingsResponse.properties.headerLogoText,
      footerLogo: handleUmbracoSingleArray(settingsResponse.properties.footerLogo) as UmbracoImage,
      defaultTheme: settingsResponse.properties.defaultTheme?.toString().toLowerCase() || 'dark'
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
