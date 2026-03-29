<script setup lang="ts">
const { settings } = useSettings();
const cookieTheme = useCookie('theme');
const bodyThemeClass = ref<string>(`theme theme--${cookieTheme.value || settings.defaultTheme}`);

function setTheme(newTheme: Theme) {
  cookieTheme.value = newTheme;
  refreshCookie('theme');
}

watch(
  () => cookieTheme.value,
  (newValue) => {
    bodyThemeClass.value = `theme theme--${newValue}`;
    refreshCookie('theme');
  },
);

useHead({
  bodyAttrs: {
    class: bodyThemeClass,
  },
});
</script>
<template>
  <GlobalHeader
    class="layout-grid"
    @set-theme="setTheme"
  />
  <main class="layout-grid">
    <slot></slot>
  </main>
  <GlobalFooter class="layout-grid" />
</template>
<style lang="postcss" scoped>
main {
  padding-top: var(--header-height);
}
</style>
