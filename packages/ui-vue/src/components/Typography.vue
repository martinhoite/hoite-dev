<script lang="ts">
import {
  resolveTypographyDefaultTag,
  type TypographyTag,
  type TypographyVariant,
  typographyVariants,
} from '@hoite-dev/ui';
import { computed, defineComponent, type PropType } from 'vue';
import { pickAriaAndDataAttributes } from '../utils/attributes';

type TypographyBaseProps = {
  id?: string;
  role?: string;
  tag?: TypographyTag;
  title?: string;
  variant: TypographyVariant;
};

export default defineComponent({
  inheritAttrs: false,
  props: {
    id: {
      required: false,
      type: String,
    },
    role: {
      required: false,
      type: String,
    },
    tag: {
      required: false,
      type: String as PropType<TypographyTag>,
    },
    title: {
      required: false,
      type: String,
    },
    variant: {
      required: true,
      type: String as PropType<TypographyVariant>,
    },
  },
  setup(props: Readonly<TypographyBaseProps>, { attrs }) {
    const componentTag = computed(() => props.tag ?? resolveTypographyDefaultTag(props.variant));
    const className = computed(() =>
      typographyVariants({
        class: attrs.class,
        variant: props.variant,
      }),
    );
    const restAttrs = computed(() => pickAriaAndDataAttributes(attrs));

    return {
      className,
      componentTag,
      restAttrs,
    };
  },
});
</script>

<template>
  <component
    :is="componentTag"
    v-bind="restAttrs"
    :class="className"
    :id="id"
    :role="role"
    :title="title"
  >
    <slot></slot>
  </component>
</template>
