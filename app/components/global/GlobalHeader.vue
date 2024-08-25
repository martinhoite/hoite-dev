<script setup lang="ts">
const { settings } = useSettings();
const { navigationItems } = useNavigation();
</script>
<template>
  <header class="header">
    <nav class="full-width">
      <GlobalLogo
        v-if="settings.lightThemeHeaderLogo?.url && settings.darkThemeHeaderLogo?.url"
        :logo-link="settings.headerLogoLink"
        :light-theme-logo-path="settings.lightThemeHeaderLogo?.url"
        :dark-theme-logo-path="settings.darkThemeHeaderLogo?.url"
        :logo-text="settings.headerLogoText"
        class="header__logo"
      />
    </nav>
  </header>
  <!-- <hr />
  <h2>Navigation items</h2>
  <pre>
    <code>
      {{ navigationItems }}
    </code>
  </pre>
  <hr /> -->
</template>
<style lang="postcss" scoped>
.header {
  height: var(--header-height);
  background-color: var(--header-bg-color);
  width: 100%;
  position: fixed;
  top: 0;

  &__logo {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: var(--default-grid-gap);
  }
}
</style>
