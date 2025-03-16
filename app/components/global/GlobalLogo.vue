<script setup lang="ts">
const { settings } = useSettings();
type Props = {
  logoSize?: number;
  logoLink?: SimplifiedUmbracoLink | null;
  logoText?: string | null;
};

withDefaults(defineProps<Props>(), {
  logoSize: 64,
  logoLink: undefined,
  logoText: undefined
});

// const cookieTheme = useCookie('theme');

const logoPath = computed(() => {
  return settings.headerLogo?.url;
});
</script>
<template>
  <BaseLink
    v-if="logoLink?.url && logoPath"
    :to="logoLink"
  >
    <NuxtImg
      class="logo"
      aria-hidden="true"
      tabindex="-1"
      :width="logoSize"
      :src="getMediaLink(logoPath)"
    />
    <span v-if="logoText">{{ logoText }}</span>
  </BaseLink>
  <NuxtImg
    v-else-if="logoPath"
    :width="logoSize"
    :src="getMediaLink(logoPath)"
  />
  <img
    :style="`--logo-size:${logoSize}px`"
    class="logo"
  />
</template>
<style lang="postcss" scoped>
.logo {
  mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  mask-position: center;
  width: var(--logo-size);
  height: var(--logo-size);
  mask-image: url('@/assets/images/hoite_dev-logo.svg');
  -webkit-mask-image: url(@/assets/images/hoite_dev-logo.svg);
  background: var(--color-logo);
}
</style>
