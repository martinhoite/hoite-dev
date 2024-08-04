<script setup lang="ts">
import type { SimplifiedUmbracoLink } from '~/types/umbraco';
type Props = {
  to?: SimplifiedUmbracoLink;
};

defineProps<Props>();
</script>
<template>
  <NuxtLink
    v-if="to?.url"
    :to="to.url"
    :title="to.title"
    :target="to.target"
  >
    <slot></slot>
  </NuxtLink>
</template>
<style lang="postcss" scoped></style>
