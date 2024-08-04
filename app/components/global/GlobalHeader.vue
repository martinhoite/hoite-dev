<script setup lang="ts">
const { settings } = useSettings();
</script>
<template>
  <header class="header">
    <GlobalLogo
      v-if="settings.headerLogo?.url && settings.headerLogoLink"
      :logo-link="settings.headerLogoLink"
      :logo-path="settings.headerLogo?.url"
    />
    This is the header
  </header>
</template>
<style lang="postcss" scoped>
.header {
  height: var(--header-height);
  background-color: pink;
}
</style>
