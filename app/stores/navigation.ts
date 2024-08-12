import type { UmbracoNavigationItem } from '~/types/umbraco';

export const useNavigation = defineStore('navigation', () => {
  const navigationItems = shallowRef<UmbracoNavigationItem[]>([] as UmbracoNavigationItem[]);

  function buildNavigation(
    navigationItemsResponse: UmbracoDeliveryApiResponse<UmbracoNavigationItemProperties>[]
  ): UmbracoNavigationItem[] {
    const lookup: { [key: string]: UmbracoNavigationItem } = {};

    navigationItemsResponse.forEach((item) => {
      if (item.properties.includeInNavigation) {
        lookup[item.id] = {
          name: item.name,
          path: item.route.path,
          children: []
        };
      }
    });

    const rootItems: UmbracoNavigationItem[] = [];

    navigationItemsResponse.forEach((item) => {
      const itemPathSegments = item.route.path.split('/').filter((segment) => segment);

      if (itemPathSegments.length > 2) {
        const parentPath = `/${itemPathSegments.slice(0, -1).join('/')}/`;
        const parentItem = navigationItemsResponse.find((apiResponse) => apiResponse.route.path === parentPath);

        if (parentItem && parentItem.properties.includeChildrenInNavigation) {
          lookup[parentItem.id].children!.push(lookup[item.id]);
        }
      } else {
        rootItems.push(lookup[item.id]);
      }
    });

    return rootItems;
  }

  async function initNavigation() {
    const { getUmbracoNavigationItems } = useUmbracoDeliveryApi();
    const navigationItemsResponse = await getUmbracoNavigationItems();
    if (navigationItemsResponse) {
      navigationItems.value = buildNavigation(navigationItemsResponse.items);
    } else {
      devOnlyConsoleLog('Failed to get navigationItems during navigation init');
    }
  }

  return {
    navigationItems,
    initNavigation
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
