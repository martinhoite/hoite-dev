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
      headerLogo: handleUmbracoSingleArray(settingsResponse.properties.headerLogo) as UmbracoImage,
      logoLink: getSingleUmbracoUrlFromArray(settingsResponse.properties.logoLink) as SimplifiedUmbracoLink,
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
