<script setup lang="ts">
const { settings } = useSettings();
const { navigationItems } = useNavigation();
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
  <hr />
  <h2>Navigation items</h2>
  <pre>
    <code>
      {{ navigationItems }}
    </code>
  </pre>
  <hr />
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
