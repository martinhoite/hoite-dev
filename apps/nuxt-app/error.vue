<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const { settings } = useSettings();

useHead({
  title: props.error.statusCode?.toString(),
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
  <div>
    <NuxtLayout>
      <div class="container">
        <div class="align-center flex flex-col items-center gap-8 py-28 text-center">
          <div>
            <h1 class="mb-4 text-[60px] lg:text-[96px]">
              {{ error?.statusCode }}
            </h1>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
