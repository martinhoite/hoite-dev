<script setup lang="ts">
import type { SimplifiedUmbracoLink } from '@hoite-dev/umbraco-client';
import { toUrlString } from '@hoite-dev/umbraco-client';
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
  logoText: undefined,
});

const logoLink = computed(() => {
  //TODO: Use global page frontpage when implemented.
  const fallbackLink: SimplifiedUmbracoLink = {
    target: null,
    title: 'Return to frontpage',
    url: toUrlString('/'),
  };

  return props.logoLink ?? fallbackLink;
});

const logoMaskStyle = computed(() => {
  const logoMaskUrl = settings.headerLogo?.url
    ? getMediaLink(settings.headerLogo.url)
    : `data:image/svg+xml;utf8,${encodeURIComponent(defaultDevLogo)}`;

  if (logoMaskUrl === '') {
    return null;
  }

  const logoStyle = `--logo-size:${props.logoSize}px;
              mask-image: url('${logoMaskUrl}');
              -webkit-mask-image: url('${logoMaskUrl}');`;

  return logoStyle;
});
</script>
<template>
  <BaseLink
    class="global-logo"
    :link="logoLink"
  >
    <img
      v-if="logoMaskStyle"
      :style="logoMaskStyle"
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
