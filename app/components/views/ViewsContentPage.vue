<script setup lang="ts">
type Props = {
  propOne: string;
};

const props = withDefaults(defineProps<Props>(), {
  propOne: ''
});
</script>
<template>
  <section>
    <h1>Standard contentPage</h1>
  </section>
</template>
<style lang="postcss" scoped></style>
