import type { UmbracoNavigationItem } from '@hoite-dev/umbraco-client';

export const useNavigation = defineStore('navigation', () => {
  const items = ref<UmbracoNavigationItem[]>([]);

  async function init() {
    const { getNavigation } = useContentApi();
    const nextItems = await getNavigation();
    items.value = nextItems || [];
  }

  return {
    items,
    init,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigation, import.meta.hot));
}
