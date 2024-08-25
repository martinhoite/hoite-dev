<script setup lang="ts">
type Props = {
  logoSize?: number;
  logoLink?: SimplifiedUmbracoLink | null;
  logoText?: string | null;
  lightThemeLogoPath: string;
  darkThemeLogoPath: string;
};

const props = withDefaults(defineProps<Props>(), {
  logoSize: 64,
  logoLink: undefined,
  logoText: undefined
});

const settings = useSettings();

const logoPath = computed(() => {
  const themeKey = `${settings.currentTheme}ThemeLogoPath` as keyof Props;
  return props[themeKey] as string | null;
});
</script>
<template>
  <BaseLink
    v-if="logoLink?.url && logoPath"
    :to="logoLink"
  >
    <NuxtImg
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
</template>
<style lang="postcss" scoped></style>
