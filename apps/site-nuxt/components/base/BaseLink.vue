<script setup lang="ts">
import type { SimplifiedUmbracoLink } from '@hoite-dev/umbraco-client';

type Props = {
  link?: SimplifiedUmbracoLink;
};

defineProps<Props>();
</script>
<template>
  <NuxtLink v-if="link?.url" :to="link.url" :title="link.title" :target="link.target">
    <slot></slot>
  </NuxtLink>
</template>
<style lang="postcss" scoped></style>
