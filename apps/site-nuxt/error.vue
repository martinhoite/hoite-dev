<script setup lang="ts">
import { isUmbracoPublicErrorCode, umbracoPublicErrorCodes } from '@hoite-dev/umbraco-client';
import { AvailableLocales } from 'types';
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const { settings } = useSettings();

const isMissingLocaleError = computed(() => {
  const data = props.error.data;

  if (!data || typeof data !== 'object' || !('code' in data)) {
    return false;
  }

  return props.error.status === 404 && data.code === 'missing-locale';
});

const availableLocalePaths = AvailableLocales.map((locale) => {
  return `/${locale}/`;
});

const missingLocaleDescription = computed(() => {
  if (!isMissingLocaleError.value) {
    return null;
  }

  return `Supported locale roots: ${availableLocalePaths.join(', ')}`;
});

const publicContentErrorCode = computed(() => {
  const data = props.error.data;

  if (!data || typeof data !== 'object' || !('code' in data)) {
    return null;
  }

  return isUmbracoPublicErrorCode(data.code) ? data.code : null;
});

const publicErrorMessage = computed(() => {
  if (isMissingLocaleError.value) {
    return 'A valid locale is required in the URL. Try one of the localized roots below.';
  }

  switch (publicContentErrorCode.value) {
    case umbracoPublicErrorCodes.contentConfigurationError:
      return 'Content is temporarily unavailable.';
    case umbracoPublicErrorCodes.contentNotFound:
      return 'The requested page could not be resolved.';
    case umbracoPublicErrorCodes.contentServiceError:
      return 'Content could not be loaded.';
    default:
      return props.error.statusText || 'The requested page could not be resolved.';
  }
});

useHead({
  meta: [
    { name: 'description', content: missingLocaleDescription.value ?? publicErrorMessage.value },
  ],
  title: props.error.status?.toString(),
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
});
</script>

<template>
  <NuxtLayout>
    <h1>{{ error?.status }}</h1>
    <p v-if="isMissingLocaleError">
      A valid locale is required in the URL. Try one of the localized roots below.
    </p>
    <p v-else>
      {{ publicErrorMessage }}
    </p>
    <template v-if="isMissingLocaleError">
      <p>Supported locale roots:</p>
      <ul>
        <li
          v-for="localePath in availableLocalePaths"
          :key="localePath"
        >
          <NuxtLink :to="localePath">
            {{ localePath }}
          </NuxtLink>
        </li>
      </ul>
    </template>
  </NuxtLayout>
</template>
