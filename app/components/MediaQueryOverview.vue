<script setup lang="ts">
const dom = useDOM();
const windowWidth = ref<number | null | undefined>(dom?.window?.innerWidth);

const activeColor = 'green';

const breakpoints = {
  tabletSize: '576px',
  laptopSize: '1024px',
  smallDesktopSize: '1280px',
  desktopSize: '1536px'
};

const breakpointLabels = {
  Mobile: `up to ${breakpoints.tabletSize}`,
  Tablet: `up to ${breakpoints.laptopSize}`,
  Laptop: `up to ${breakpoints.smallDesktopSize}`,
  'Small desktop': `up to ${breakpoints.desktopSize}`,
  Desktop: `${breakpoints.desktopSize} and up`
};

const updateWindowWidth = () => {
  windowWidth.value = dom?.window?.innerWidth;
};

onMounted(() => {
  if (dom?.window) {
    dom.window.addEventListener('resize', updateWindowWidth);
  }
});

onUnmounted(() => {
  if (dom?.window) {
    dom.window.removeEventListener('resize', updateWindowWidth);
  }
});
</script>
<template>
  <section class="media-queries">
    <h2 class="media-queries__heading">Media query overview</h2>
    <ul class="media-queries__sizes">
      <li
        v-for="(size, name) in breakpointLabels"
        :key="name"
        class="media-queries__size"
      >
        {{ name }}: {{ size }}
      </li>
    </ul>
    <h3 class="media-queries__current">Current window width: {{ windowWidth }}px</h3>
    <div class="media-queries__group">
      <h3 class="media-queries__heading">Specific breakpoints only</h3>
      <div class="media-queries__query media-queries__query--mobile-only">
        {{ activeColor }} on mobile (&lt;{{ breakpoints.tabletSize }}) only
      </div>
      <div class="media-queries__query media-queries__query--tablet-only">
        {{ activeColor }} on tablet (&ge;{{ breakpoints.tabletSize }} & &lt;{{ breakpoints.laptopSize }}) only
      </div>
      <div class="media-queries__query media-queries__query--laptop-only">
        {{ activeColor }} on laptop (&ge;{{ breakpoints.laptopSize }} & &lt;{{ breakpoints.smallDesktopSize }}) only
      </div>
      <div class="media-queries__query media-queries__query--small-desktop-only">
        {{ activeColor }} on small desktop (&ge;{{ breakpoints.smallDesktopSize }} & &lt;{{ breakpoints.desktopSize }})
        only
      </div>
    </div>
    <div class="media-queries__group">
      <h3 class="media-queries__heading">Breakpoints for device and up</h3>
      <div class="media-queries__query media-queries__query--tablet">
        {{ activeColor }} on tablet (&ge;{{ breakpoints.tabletSize }}) and up
      </div>
      <div class="media-queries__query media-queries__query--laptop">
        {{ activeColor }} on laptop (&ge;{{ breakpoints.laptopSize }}) and up
      </div>
      <div class="media-queries__query media-queries__query--small-desktop">
        {{ activeColor }} on small desktop (&ge;{{ breakpoints.smallDesktopSize }}) and up
      </div>
      <div class="media-queries__query media-queries__query--desktop">
        {{ activeColor }} on desktop (&ge;{{ breakpoints.desktopSize }}) and up
      </div>
    </div>
    <div class="media-queries__group">
      <h3 class="media-queries__heading">Breakpoints for device and down</h3>
      <div class="media-queries__query media-queries__query--tablet-down">
        {{ activeColor }} on tablet (&lt;{{ breakpoints.laptopSize }}) and down
      </div>
      <div class="media-queries__query media-queries__query--laptop-down">
        {{ activeColor }} on laptop (&lt;{{ breakpoints.smallDesktopSize }}) and down
      </div>
      <div class="media-queries__query media-queries__query--small-desktop-down">
        {{ activeColor }} on small desktop (&lt;{{ breakpoints.desktopSize }}) and down
      </div>
      <div class="media-queries__query media-queries__query--desktop-down">Always {{ activeColor }} (desktop)</div>
    </div>
  </section>
</template>
<style lang="postcss" scoped>
.media-queries {
  --active-color: v-bind(activeColor);
  --starting-color: red;

  display: grid;
  gap: calc(var(--default-grid-gap) * 2);

  &__current {
    background: var(--body-bg-color);
    position: sticky;
    top: 0;
    padding: var(--small-padding) 0;
    margin: 0;
  }

  &__group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--default-grid-gap);

    @media (--mobile-only) {
      flex-direction: column;
    }
  }

  &__heading {
    width: 100%;
  }

  &__query {
    background: var(--starting-color);
    padding: var(--small-padding);
    margin: 0;

    @media (--tablet) {
      width: calc(50% - var(--default-grid-gap));
    }

    &--mobile {
      &-only {
        @media (--mobile-only) {
          background: var(--active-color);
        }
      }
    }

    &--tablet {
      @media (--tablet) {
        background: var(--active-color);
      }

      &-only {
        @media (--tablet-only) {
          background: var(--active-color);
        }
      }

      &-down {
        @media (--tablet-down) {
          background: var(--active-color);
        }
      }
    }

    &--laptop {
      @media (--laptop) {
        background: var(--active-color);
      }

      &-only {
        @media (--laptop-only) {
          background: var(--active-color);
        }
      }

      &-down {
        @media (--laptop-down) {
          background: var(--active-color);
        }
      }
    }

    &--small-desktop {
      @media (--small-desktop) {
        background: var(--active-color);
      }

      &-only {
        @media (--small-desktop-only) {
          background: var(--active-color);
        }
      }

      &-down {
        @media (--small-desktop-down) {
          background: var(--active-color);
        }
      }
    }

    &--desktop {
      @media (--desktop) {
        background: var(--active-color);
      }

      &-down {
        background: var(--active-color);
      }
    }
  }
}
</style>
