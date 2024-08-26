<script setup lang="ts">
import type { BaseGridColumnSizes, GridBreakPoint } from '~/types/baseGrid';

const props = defineProps<BaseGridColumnSizes>();

const propToCssClassMapping: Record<string, GridBreakPoint> = {
  mobile: 'mobile',
  tablet: 'tablet',
  laptop: 'laptop',
  smallDesktop: 'small-desktop',
  desktop: 'desktop'
};

function createSectionGridClass(
  breakpoint: keyof typeof propToCssClassMapping,
  startColumn?: number | string,
  endColumn?: number | string
) {
  const isFullSize = !startColumn && !endColumn;
  return `section-grid__${breakpoint}-col-span--${isFullSize ? 'full' : `${startColumn}-${endColumn}`}`;
}

const computedClasses = computed(() => {
  const classArray: string[] = [];

  (Object.keys(propToCssClassMapping) as Array<keyof typeof propToCssClassMapping>).forEach((prop) => {
    const startColumnKey = `${prop}StartColumn` as keyof BaseGridColumnSizes;
    const endColumnKey = `${prop}EndColumn` as keyof BaseGridColumnSizes;

    const startColumn = props[startColumnKey] || `${propToCssClassMapping[prop]}-grid-start`;
    const endColumn = props[endColumnKey] || `${propToCssClassMapping[prop]}-grid-end`;

    if (props[startColumnKey] || props[endColumnKey]) {
      classArray.push(createSectionGridClass(prop, startColumn, endColumn));
    }
  });

  return classArray;
});
</script>
<template>
  <section
    class="section-grid"
    :class="computedClasses"
  >
    <slot></slot>
  </section>
</template>
<style lang="postcss" scoped></style>
