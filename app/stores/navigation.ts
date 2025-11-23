import type { UmbracoNavigationItem } from '~/types/umbraco';

export const useNavigation = defineStore('navigation', () => {
  const navigationItems = shallowRef<UmbracoNavigationItem[]>([] as UmbracoNavigationItem[]);

  function buildNavigation(
    navigationItemsResponse: UmbracoDeliveryApiResponse<UmbracoNavigationItemProperties>[]
  ): UmbracoNavigationItem[] {
    const lookup: Record<string, UmbracoNavigationItem> = {};

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
      const currentNavItem = lookup[item.id];
      if (!currentNavItem) return;

      const itemPathSegments = item.route.path.split('/').filter((segment) => segment);

      if (itemPathSegments.length > 2) {
        const parentPath = `/${itemPathSegments.slice(0, -1).join('/')}/`;
        const parentItem = navigationItemsResponse.find((apiResponse) => apiResponse.route.path === parentPath);

        if (!parentItem) {
          rootItems.push(currentNavItem);
          return;
        }

        const parentNavItem = lookup[parentItem.id];

        if (parentNavItem && parentItem.properties.includeChildrenInNavigation) {
          parentNavItem.children?.push(currentNavItem);
        } else {
          rootItems.push(currentNavItem);
        }
      } else {
        rootItems.push(currentNavItem);
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
      devOnlyConsoleLog('Failed to get navigationItems during navigation init', 'error');
    }
  }

  return {
    navigationItems,
    initNavigation
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigation, import.meta.hot));
}
