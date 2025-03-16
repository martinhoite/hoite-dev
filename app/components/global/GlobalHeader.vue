<script setup lang="ts">
const { settings } = useSettings();
const { navigationItems } = useNavigation();

const emit = defineEmits(['setTheme']);

function setTheme(newTheme: Theme) {
  emit('setTheme', newTheme);
}
</script>
<template>
  <header class="header">
    <nav class="header__nav full-width">
      <BaseGridContainer class="header__temp-container">
        <GlobalLogo
          :logo-link="settings.headerLogoLink"
          :logo-text="settings.headerLogoText"
          class="header__logo"
        />
        <div class="header__actions">
          <button
            class="header__theme-button header__theme-button--dark"
            @click="setTheme('dark')"
          >
            dark
          </button>
          <button
            class="header__theme-button header__theme-button--light"
            @click="setTheme('light')"
          >
            light
          </button>
        </div>
      </BaseGridContainer>
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
  z-index: var(--header-z-index);
  position: fixed;
  top: 0;
  border-bottom: 1px solid var(--default-text-color);

  &__temp-container {
    display: flex;
    align-items: center;
  }

  &__logo {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: var(--default-grid-gap);
  }

  &__actions {
    margin-left: auto;
  }

  &__theme-button {
    border: var(--color-primary);
    padding: 0.5rem;
    cursor: pointer;

    &--dark {
      border-radius: 4px 0 0 4px;
      background: var(--color-dark);
    }

    &--light {
      color: var(--color-dark);
      border-radius: 0 4px 4px 0;
      background: var(--color-light);
    }
  }
}
</style>
