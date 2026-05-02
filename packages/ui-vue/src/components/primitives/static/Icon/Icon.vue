<script lang="ts">
import {
  type IconName,
  type IconRotation,
  type IconSize,
  type IconVariant,
  iconVariants,
  resolveIconDefinition,
} from '@hoite-dev/ui';
import { computed, defineComponent, type PropType } from 'vue';

type IconBaseProps = {
  id?: string;
  label?: string;
  name: IconName;
  rotation?: IconRotation;
  role?: string;
  size?: IconSize;
  title?: string;
  variant?: IconVariant;
  'aria-label'?: string;
};

type IconDataAttributes = {
  [Key in `data-${string}`]?: boolean | number | string | undefined;
};

export type IconProps = IconBaseProps & IconDataAttributes;

function pickDataAttributes(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-')));
}

export default defineComponent({
  inheritAttrs: false,
  props: {
    'aria-label': {
      required: false,
      type: String,
    },
    id: {
      required: false,
      type: String,
    },
    label: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String as PropType<IconName>,
    },
    rotation: {
      type: String as PropType<IconRotation>,
    },
    role: {
      required: false,
      type: String,
    },
    size: {
      type: String as PropType<IconSize>,
    },
    title: {
      required: false,
      type: String,
    },
    variant: {
      type: String as PropType<IconVariant>,
    },
  },
  setup(props: Readonly<IconBaseProps>, { attrs }) {
    const definition = computed(() => resolveIconDefinition(props.name));
    const accessibleLabel = computed(() => props.label ?? props['aria-label']);
    const isDecorative = computed(
      () => accessibleLabel.value === undefined || accessibleLabel.value.length === 0,
    );
    const className = computed(() =>
      iconVariants({
        class: attrs.class,
        rotation: props.rotation,
        size: props.size,
        variant: props.variant,
      }),
    );
    const dataAttributes = computed(() => pickDataAttributes(attrs));
    const resolvedRole = computed(() => {
      if (isDecorative.value) {
        return undefined;
      }

      return props.role ?? 'img';
    });

    return {
      accessibleLabel,
      className,
      dataAttributes,
      definition,
      isDecorative,
      resolvedRole,
    };
  },
});
</script>

<template>
  <svg
    v-bind="dataAttributes"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="isDecorative ? undefined : accessibleLabel"
    :class="className"
    focusable="false"
    :id="id"
    :role="resolvedRole"
    :viewBox="definition.viewBox"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title v-if="title">{{ title }}</title>
    <path
      v-for="path in definition.paths"
      :key="`${definition.name}-${path}`"
      :d="path"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>
