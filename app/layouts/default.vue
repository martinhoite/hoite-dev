<script setup lang="ts">
const { settings } = useSettings();
const cookieTheme = useCookie('theme');
const bodyClass = ref<string>(`theme theme--${cookieTheme.value || settings.defaultTheme}`);

function setTheme(newTheme: Theme) {
  cookieTheme.value = newTheme;
  refreshCookie('theme');
}

watch(
  () => cookieTheme.value,
  (newValue) => {
    bodyClass.value = `theme theme--${newValue}`;
    refreshCookie('theme');
  }
);

useHead({
  bodyAttrs: {
    class: bodyClass
  }
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
