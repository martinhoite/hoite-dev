<script setup lang="ts">
import defaultDevLogo from '@/assets/images/hoite_dev-logo.svg?raw';
const { settings } = useSettings();
type Props = {
  logoSize?: number;
  logoLink?: SimplifiedUmbracoLink | null;
  logoText?: string | null;
};

const props = withDefaults(defineProps<Props>(), {
  logoSize: 64,
  logoLink: undefined,
  logoText: undefined
});

const logoUrl = computed(() => {
  //TODO: Use global page frontpage when implemented.
  return props.logoLink ? props.logoLink : ({ url: '/', title: 'Return to frontpage' } as SimplifiedUmbracoLink);
});

const logoMaskUrl = computed(() => {
  if (settings.headerLogo?.url) {
    return getMediaLink(settings.headerLogo.url);
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(defaultDevLogo)}`;
});
</script>
<template>
  <BaseLink
    class="global-logo"
    :link="logoUrl"
  >
    <img
      :style="`--logo-size:${logoSize}px;
              mask-image: url('${logoMaskUrl}');
              -webkit-mask-image: url('${logoMaskUrl}');`"
      class="global-logo__logo"
    />
    <span v-if="logoText">{{ logoText }}</span>
  </BaseLink>
</template>
<style lang="postcss" scoped>
.global-logo {
  &__logo {
    mask-size: 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    mask-position: center;
    width: var(--logo-size);
    height: var(--logo-size);
    background: var(--color-logo);
  }
}
</style>
