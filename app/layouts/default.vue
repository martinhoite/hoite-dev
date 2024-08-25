<script setup lang="ts">
const settings = useSettings();

useHead({
  bodyAttrs: {
    class: `theme theme--${settings.currentTheme}`
  }
});
</script>
<template>
  <GlobalHeader class="layout-grid" />
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
