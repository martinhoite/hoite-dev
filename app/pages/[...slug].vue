<script setup lang="ts">
import type { ConcreteComponent } from 'vue';
import type { UmbracoPageResponse } from '~/types/umbracoDeliveryApi';

const { getUmbracoContentByRoute } = useUmbracoDeliveryApi();
const { path } = useRoute();
const { settings, currentHostUrl } = useSettings();
const encodedPath = encodeURIComponent(path);
const pageData = shallowRef<UmbracoDeliveryApiResponse<UmbracoPageResponse>>();

async function getPageData() {
  const { data, error } = await useAsyncData(encodedPath, () => getUmbracoContentByRoute(path), { deep: false });

  if (!data.value || error.value) {
    devOnlyConsoleLog('Failed getting pageData in slug', 'error', error.value);
    throw createError({
      statusCode: error.value?.statusCode ?? 500,
      message:
        error.value?.message ?? 'Failed to get page content, please try again later - and / or inform martin@hoite.dev',
      fatal: true
    });
  }

  pageData.value = data.value;
}

await getPageData();

const contentPageView = resolveComponent('ViewsContentPage');
let viewComponent: ConcreteComponent | string | null = null;
switch (pageData.value?.contentType) {
  case 'frontpage':
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
  return `${currentHostUrl}${pageData.value?.properties.canonicalURL?.url || pageData.value?.route.path}`;
});

const twitterImagePath = computed(() => {
  const image = pageProperties.value?.seoTwitterImage;
  if (image) {
    return (handleUmbracoSingleArray(image) as UmbracoImage).url;
  }
  return settings.seoTwitterFallbackImage?.url || '';
});

const openGraphImagePath = computed(() => {
  const image = pageProperties.value?.seoOpenGraphImage;
  if (image) {
    return (handleUmbracoSingleArray(image) as UmbracoImage).url;
  }
  return settings.seoOpenGraphFallbackImage?.url || '';
});

useHead({
  title: pageData.value?.properties.seoTitle,
  titleTemplate(title: string | undefined) {
    return title ? `${title} | ${settings.metaTitleExtension}` : settings.metaTitleExtension;
  },
  meta: [
    { name: 'description', content: pageProperties.value?.seoDescription },
    {
      name: 'robots',
      content: `${pageProperties.value?.robotsIndex ? 'index' : 'noindex'} ${pageProperties.value?.robotsFollow ? 'follow' : 'nofollow'}`
    },

    { name: 'twitter:title', content: pageProperties.value?.seoTitle },
    { name: 'twitter:description', content: pageProperties.value?.seoDescription },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: getMediaLink(twitterImagePath.value) },

    { name: 'og:title', content: pageProperties.value?.seoTitle },
    { name: 'og:description', content: pageProperties.value?.seoDescription },
    { name: 'og:type', content: 'website' },
    { name: 'og:url', content: `${currentHostUrl}${pageData.value?.route.path}` },
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
  <h1 class="page-heading">{{ pageHeading }}</h1>
  <KitchenSink />
  <!-- <h2>Settings</h2>
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
    </pre> -->
  <component
    :is="viewComponent"
    v-if="viewComponent"
    :blocks="pageData?.properties.blocks"
  />
</template>
<style lang="postcss" scoped></style>
