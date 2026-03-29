<script setup lang="ts">
import type { UmbracoDeliveryApiResponse, UmbracoPageResponse } from '~/types/umbracoDeliveryApi';

import type { ConcreteComponent } from 'vue';

const route = useRoute();
const { getUmbracoContentByRoute } = useUmbracoDeliveryApi();
const { settings, currentHostUrl } = useSettings();

const path = route.path;
const encodedPath = encodeURIComponent(path);

const { data: pageData, error: pageError } = await useAsyncData<UmbracoDeliveryApiResponse<UmbracoPageResponse>>(
  `page:${encodedPath}`,
  () => getUmbracoContentByRoute({ path }),
  { deep: false },
);

if (pageError.value || !pageData.value) {
  devOnlyConsoleLog('Failed getting pageData in slug', 'error', pageError.value);

  throw createError({
    statusCode: pageError.value?.statusCode ?? 500,
    statusMessage:
      pageError.value?.message ??
      'Failed to get page content, please try again later - and / or inform martin@hoite.dev',
  });
}

const contentPageView = resolveComponent('ViewsContentPage');
let viewComponent: ConcreteComponent | string | null = null;
switch (pageData.value?.contentType) {
  case 'frontpage':
    break;
  case 'contentPage':
    viewComponent = contentPageView;
    break;
}

const pageProperties = computed(() => pageData.value?.properties);

const pageHeading = computed(() => pageData.value?.name);

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
    const extension = settings.metaTitleExtension?.trim();

    if (title && extension) {
      return `${title} | ${extension}`;
    }

    if (title) {
      return title;
    }

    if (extension) {
      return extension;
    }

    return null;
  },
  meta: [
    { name: 'description', content: pageProperties.value?.seoDescription },
    {
      name: 'robots',
      content: `${pageProperties.value?.robotsIndex ? 'index' : 'noindex'} ${pageProperties.value?.robotsFollow ? 'follow' : 'nofollow'}`,
    },

    { name: 'twitter:title', content: pageProperties.value?.seoTitle },
    { name: 'twitter:description', content: pageProperties.value?.seoDescription },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: getMediaLink(twitterImagePath.value) },

    { name: 'og:title', content: pageProperties.value?.seoTitle },
    { name: 'og:description', content: pageProperties.value?.seoDescription },
    { name: 'og:type', content: 'website' },
    { name: 'og:url', content: `${currentHostUrl}${pageData.value?.route.path}` },
    { name: 'og:image', content: getMediaLink(openGraphImagePath.value) },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
  ],
});
</script>

<template>
  <h1 class="page-heading">{{ pageHeading }}</h1>
  <KitchenSink />
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
  <component
    :is="viewComponent"
    v-if="viewComponent"
    :blocks="pageData?.properties.blocks"
  />
</template>
<style lang="postcss" scoped></style>
