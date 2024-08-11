<script setup lang="ts">
import type { ConcreteComponent } from 'vue';
import type { UmbracoPageResponse } from '~/types/umbracoDeliveryApi';

const { getUmbracoContentByRoute } = useUmbracoDeliveryApi();
const { path } = useRoute();
const { settings } = useSettings();
const encodedPath = encodeURIComponent(path);
const pageData = shallowRef<UmbracoDeliveryApiResponse<UmbracoPageResponse>>();

async function getPageData() {
  try {
    const { data, error } = await useAsyncData(encodedPath, () => getUmbracoContentByRoute(path), { deep: false });

    if (!data.value || error.value) {
      throw createError({
        statusCode: 404,
        fatal: true
      });
    }

    pageData.value = data.value;
  } catch (error) {
    devOnlyConsoleLog('Failed getting pageData in slug', error);
  }
}

await getPageData();

const contentPageView = resolveComponent('ViewsContentPage');
let viewComponent: ConcreteComponent | string | null = null;
switch (pageData.value?.contentType) {
  case 'website':
    break;
  case 'contentPage':
    viewComponent = contentPageView;
    break;
}

const pageHeading = computed(() => {
  return pageData.value?.name;
});

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
});
</script>
<template>
  <section>
    <h1 class="page-heading">{{ pageHeading }}</h1>
    <h2>Settings</h2>
    <pre>
      <code>
      {{ settings }}
    </code>
  </pre>
    <hr />
    <h2>Page data</h2>
    <pre>
      <code>
      {{ pageData }}
    </code>
  </pre>
  </section>
  <component
    :is="viewComponent"
    v-if="viewComponent"
    :blocks="pageData?.properties.blocks"
  />
</template>
<style lang="postcss" scoped></style>
