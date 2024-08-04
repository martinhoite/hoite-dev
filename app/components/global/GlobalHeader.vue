<script setup lang="ts">
const { settings } = useSettings();
</script>
<template>
  <header class="header">
    <GlobalLogo
      v-if="settings.headerLogo?.url && settings.headerLogoLink"
      :logo-link="settings.headerLogoLink"
      :logo-path="settings.headerLogo?.url"
      class="header__logo"
    >
      <span> Hoite.dev </span>
    </GlobalLogo>
  </header>
</template>
<style lang="postcss" scoped>
.header {
  height: var(--header-height);
  background-color: pink;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;

  &__logo {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>
