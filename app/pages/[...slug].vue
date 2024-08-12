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

const pageProperties = computed(() => {
  return pageData.value?.properties;
});

const pageHeading = computed(() => {
  return pageData.value?.name;
});

const canonicalUrl = computed(() => {
  return `${settings.hostName}${pageData.value?.properties.canonicalURL?.url || pageData.value?.route.path}`;
});

const twitterImagePath = computed(() => {
  let imagePath = settings.seoTwitterFallbackImage.url;
  if (pageProperties.value?.seoTwitterImage) {
    imagePath = (handleUmbracoSingleArray(pageProperties.value.seoTwitterImage) as UmbracoImage).url;
  }
  return imagePath;
});

const openGraphImagePath = computed(() => {
  let imagePath = settings.seoOpenGraphFallbackImage.url;
  if (pageProperties.value?.seoOpenGraphImage) {
    imagePath = (handleUmbracoSingleArray(pageProperties.value.seoOpenGraphImage) as UmbracoImage).url;
  }
  return imagePath;
});

useHead({
  title: pageData.value?.properties.seoTitle,
  titleTemplate(title: string | undefined) {
    return title ? `${title} | ${settings.metaTitleExtension}` : settings.metaTitleExtension;
  },
  meta: [
    { name: 'description', content: pageProperties.value?.seoDecription },
    {
      name: 'robots',
      content: `${pageProperties.value?.robotsIndex ? 'index' : 'noindex'} ${pageProperties.value?.robotsFollow ? 'follow' : 'nofollow'}`
    },

    { name: 'twitter:title', content: pageProperties.value?.seoTitle },
    { name: 'twitter:description', content: pageProperties.value?.seoDecription },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: getMediaLink(twitterImagePath.value) },

    { name: 'og:title', content: pageProperties.value?.seoTitle },
    { name: 'og:description', content: pageProperties.value?.seoDecription },
    { name: 'og:type', content: 'website' },
    { name: 'og:url', content: `${settings.hostName}${pageData.value?.route.path}` },
    { name: 'og:image', content: getMediaLink(openGraphImagePath.value) }
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    },
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
