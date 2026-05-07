<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import { type LoadingColor, type LoadingSize, loaderVariants } from '@hoite-dev/ui';
import { computed, defineComponent, type PropType, watchEffect } from 'vue';
import { pickAriaAndDataAttributes } from '../../../../utils/attributes';

type LoaderBaseProps = {
  color?: LoadingColor;
  id?: string;
  size?: LoadingSize;
};

function isPresent(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().length > 0;
}

export type LoaderProps = LoaderBaseProps;

export default defineComponent({
  inheritAttrs: false,
  props: {
    color: {
      required: false,
      type: String as PropType<LoadingColor>,
    },
    id: {
      required: false,
      type: String,
    },
    size: {
      required: false,
      type: String as PropType<LoadingSize>,
    },
  },
  setup(props: Readonly<LoaderBaseProps>, { attrs }) {
    const className = computed(() =>
      loaderVariants({
        class: attrs.class,
        color: props.color,
        size: props.size,
      }),
    );
    const restAttrs = computed(() => pickAriaAndDataAttributes(attrs));

    watchEffect(() => {
      const ariaHidden = restAttrs.value['aria-hidden'];

      if (ariaHidden === true || ariaHidden === 'true') {
        return;
      }

      const ariaLabel = restAttrs.value['aria-label'];
      const ariaLabelledBy = restAttrs.value['aria-labelledby'];

      if (!isPresent(ariaLabel) && !isPresent(ariaLabelledBy)) {
        warnInDevelopment(
          '[Loader] Accessible loading text is missing. Provide `aria-label` or `aria-labelledby`, or mark the loader as decorative with `aria-hidden`.',
        );
      }
    });

    return {
      className,
      restAttrs,
    };
  },
});
</script>

<template>
  <span
    v-bind="restAttrs"
    :class="className"
    :id="id"
    role="status"
  />
</template>
