<script setup lang="ts">
type Props = {
  logoSize?: number;
  logoLink?: SimplifiedUmbracoLink;
  logoPath: string;
};

withDefaults(defineProps<Props>(), {
  logoSize: 64,
  logoLink: undefined
});
</script>
<template>
  <BaseLink
    v-if="logoLink?.url"
    :to="logoLink"
  >
    <NuxtImg
      :width="logoSize"
      :src="getMediaLink(logoPath)"
    />
  </BaseLink>
  <NuxtImg
    v-else
    :width="logoSize"
    :src="getMediaLink(logoPath)"
  />
</template>
<style lang="postcss" scoped></style>
