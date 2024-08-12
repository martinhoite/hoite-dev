import type { SimplifiedUmbracoLink, UmbracoImage, UmbracoSiteSettings } from '~/types/umbraco';

export const useSettings = defineStore('settings', () => {
  const {
    public: { fallbackLocale }
  } = useRuntimeConfig();
  const settings = shallowRef<UmbracoSiteSettings>({} as UmbracoSiteSettings);

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
      headerLogo: handleUmbracoSingleArray(settingsResponse.properties.headerLogo) as UmbracoImage,
      headerLogoLink: getSingleUmbracoUrlFromArray(settingsResponse.properties.headerLogoLink) as SimplifiedUmbracoLink,
      footerLogo: handleUmbracoSingleArray(settingsResponse.properties.footerLogo) as UmbracoImage
    };
  }

  return {
    settings,
    initSettings
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
