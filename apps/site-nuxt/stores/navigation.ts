import type { UmbracoNavigationItem } from '@hoite-dev/umbraco-client';

export const useNavigation = defineStore('navigation', () => {
  const navigationItems = ref<UmbracoNavigationItem[]>([]);

  async function initNavigation() {
    const { getNavigation } = useContentApi();
    const nextNavigationItems = await getNavigation();
    navigationItems.value = nextNavigationItems || [];
  }

  return {
    navigationItems,
    initNavigation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigation, import.meta.hot));
}
