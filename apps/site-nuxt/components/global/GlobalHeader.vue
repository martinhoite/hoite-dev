<script setup lang="ts">
const site = useSite();

const emit = defineEmits(['setTheme']);

function setTheme(newTheme: Theme) {
  emit('setTheme', newTheme);
}
</script>
<template>
  <header class="header">
    <nav class="header__nav full-width">
      <BaseGridContainer class="header__temp-container">
        <GlobalLogo :logo-link="site.settings.headerLogoLink" :logo-text="site.settings.headerLogoText"
          class="header__logo" />
        <div class="header__actions">
          <button class="header__theme-button header__theme-button--dark" @click="setTheme('dark')">
            dark
          </button>
          <button class="header__theme-button header__theme-button--light" @click="setTheme('light')">
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
      {{ navigation.items }}
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
    display: flex;
    gap: var(--default-grid-gap);
  }

  &__theme-button {
    padding: 0.5rem 0.875rem;
    border: 1px solid var(--default-text-color);
    border-radius: 999px;
    cursor: pointer;

    &--dark {
      color: var(--color-light);
      background: var(--color-dark);
    }

    &--light {
      color: var(--color-dark);
      background: var(--color-light);
    }
  }
}
</style>
