<script setup lang="ts">
const { path } = useRoute();
</script>
<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="var(--color-primary)" />
    <NuxtPage :key="path" />
  </NuxtLayout>
</template>
