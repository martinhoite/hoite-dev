import type { Theme } from '~/types';
import type { SimplifiedUmbracoLink, UmbracoImage, UmbracoSiteSettings } from '~/types/umbraco';

export const useSettings = defineStore('settings', () => {
  const {
    public: { fallbackLocale }
  } = useRuntimeConfig();
  const settings = shallowRef<UmbracoSiteSettings>({} as UmbracoSiteSettings);
  const currentTheme = shallowRef<Theme>('light');

  function setTheme(newTheme: Theme) {
    currentTheme.value = newTheme;
  }

  async function initSettings(path: string) {
    const { getUmbracoSiteSettings } = useUmbracoDeliveryApi();
    const locale = getLocaleFromPath(path) || fallbackLocale;

    const settingsResponse = await getUmbracoSiteSettings(locale);

    // TODO: Custom extension of API to send single arrays as an object for links and images.
    settings.value = {
      hostName: settingsResponse.properties.hostName as URLString,
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
      footerLogo: handleUmbracoSingleArray(settingsResponse.properties.footerLogo) as UmbracoImage
    };
  }

  return {
    settings,
    currentTheme,
    setTheme,
    initSettings
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
