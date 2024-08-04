export const useNavigation = defineStore('navigation', () => {
  const navigation = shallowRef<unknown>({} as unknown);
  async function initNavigation(locale: string) {
    // TODO: Get navigation items
  }

  return {
    initNavigation
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettings, import.meta.hot));
}
