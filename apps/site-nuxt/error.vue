<script setup lang="ts">
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

useHead({
  meta: [{ name: 'description', content: missingLocaleDescription.value ?? undefined }],
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
      {{ error?.statusText || 'The requested page could not be resolved.' }}
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
