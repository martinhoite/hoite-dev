<script setup lang="ts">
import type { UmbracoPageResponse } from '~/types/umbracoDeliveryApi';

const { getUmbracoContentByRoute } = useUmbracoDeliveryApi();
const { path } = useRoute();
const encodedPath = encodeURIComponent(path);

const pageData = shallowRef<UmbracoPageResponse>();

async function getPageData() {
  try {
    const { data, error } = await useAsyncData(encodedPath, () => getUmbracoContentByRoute(path), { deep: false });

    if (!data.value || error.value) {
      throw createError({
        statusCode: 404,
        fatal: true
      });
    }
    pageData.value = data.value.properties;
  } catch (error) {
    devOnlyConsoleLog('Failed getting pagedata in slug', error);
  }
}

await getPageData();

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: 'favicon.svg'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: 'favicon.png'
    }
  ]
});
</script>
<template>
  <!-- <ViewsKitchenSink /> -->
  <pre>
    <code>
      {{ pageData }}
  </code>
  </pre>
</template>
<style lang="postcss" scoped></style>
