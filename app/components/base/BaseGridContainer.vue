<script setup lang="ts">
import {
  MobileGridFullWidthSize,
  TabletGridFullWidthSize,
  LaptopAndAboveGridFullWidthSize
} from '~/constants/baseGrid';
import type { BaseGridColumnSizes } from '~/types/baseGrid';

type Props = BaseGridColumnSizes;

withDefaults(defineProps<Props>(), {
  mobileStartColumn: 1,
  mobileEndColumn: MobileGridFullWidthSize,
  tabletStartColumn: 1,
  tabletEndColumn: TabletGridFullWidthSize,
  laptopStartColumn: 1,
  laptopEndColumn: LaptopAndAboveGridFullWidthSize,
  smallStartktopEndColumn: 1,
  smallDesktopEndColumn: LaptopAndAboveGridFullWidthSize,
  desktopStartColumn: 1,
  desktopEndColumn: LaptopAndAboveGridFullWidthSize
});
</script>
<template>
  <section class="section-grid">
    <slot></slot>
  </section>
</template>
<style lang="postcss">
.section-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(MobileGridFullWidthSize), 1fr);
  grid-template-rows: 1fr;

  @media (--tablet) {
    grid-template-columns: repeat(v-bind(TabletGridFullWidthSize), 1fr);
  }

  @media (--laptop) {
    grid-template-columns: repeat(v-bind(LaptopAndAboveGridFullWidthSize), 1fr);
  }

  > * {
    display: grid;
    grid-column-start: v-bind(mobileStartColumn);
    grid-column-end: calc(v-bind(mobileEndColumn) + 1);

    @media (--tablet) {
      grid-column-start: v-bind(tabletStartColumn);
      grid-column-end: calc(v-bind(tabletEndColumn) + 1);
    }

    @media (--laptop) {
      grid-column-start: v-bind(laptopStartColumn);
      grid-column-end: calc(v-bind(laptopEndColumn) + 1);
    }

    @media (--small-desktop) {
      grid-column-start: v-bind(smallDesktopStartColumn);
      grid-column-end: calc(v-bind(smallDesktopEndColumn) + 1);
    }

    @media (--desktop) {
      grid-column-start: v-bind(desktopStartColumn);
      grid-column-end: calc(v-bind(desktopEndColumn) + 1);
    }
  }
}
</style>
