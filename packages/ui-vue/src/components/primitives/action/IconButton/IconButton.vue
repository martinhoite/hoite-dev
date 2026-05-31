<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type IconButtonSize,
  type IconButtonVariant,
  type IconName,
  iconButtonVariants,
  resolveActionIconSize,
  resolveActionIconVariant,
  resolveActionLoaderColor,
  resolveActionLoaderSize,
} from '@hoite-dev/ui';
import { computed, defineComponent, type PropType, watchEffect } from 'vue';

import Icon from '../../static/Icon';
import { Loader } from '../../static/Loading';

type IconButtonBaseProps = {
  disabled?: boolean;
  icon: IconName;
  isLoading?: boolean;
  size?: IconButtonSize;
  type?: 'button' | 'reset' | 'submit';
  variant?: IconButtonVariant;
};

export type IconButtonProps = IconButtonBaseProps;

function isPresent(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().length > 0;
}

function pickButtonAttributes(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  );
}

function resolveAriaBusy(
  isLoading: boolean | undefined,
  ariaBusy: unknown,
): boolean | 'false' | 'true' | undefined {
  if (isLoading === true) {
    return true;
  }

  if (typeof ariaBusy === 'boolean' || ariaBusy === 'false' || ariaBusy === 'true') {
    return ariaBusy;
  }

  return undefined;
}

export default defineComponent({
  inheritAttrs: false,
  components: {
    Icon,
    Loader,
  },
  props: {
    disabled: {
      default: false,
      required: false,
      type: Boolean,
    },
    icon: {
      required: true,
      type: String as PropType<IconName>,
    },
    isLoading: {
      default: false,
      required: false,
      type: Boolean,
    },
    size: {
      required: false,
      type: String as PropType<IconButtonSize>,
    },
    type: {
      default: 'button',
      required: false,
      type: String as PropType<'button' | 'reset' | 'submit'>,
    },
    variant: {
      required: false,
      type: String as PropType<IconButtonVariant>,
    },
  },
  setup(props: Readonly<IconButtonBaseProps>, { attrs }) {
    const restAttrs = computed(() => pickButtonAttributes(attrs));
    const ariaBusy = computed(() => resolveAriaBusy(props.isLoading, restAttrs.value['aria-busy']));
    const isButtonDisabled = computed(() => props.disabled === true || props.isLoading === true);
    const className = computed(() =>
      iconButtonVariants({
        class: attrs.class,
        size: props.size,
        variant: props.variant,
      }),
    );
    const iconSize = computed(() => resolveActionIconSize(props.size));
    const iconVariant = computed(() =>
      resolveActionIconVariant(props.variant, isButtonDisabled.value),
    );
    const loaderColor = computed(() =>
      resolveActionLoaderColor(props.variant, isButtonDisabled.value),
    );
    const loaderSize = computed(() => resolveActionLoaderSize(props.size));

    watchEffect(() => {
      if (
        isPresent(restAttrs.value['aria-label']) ||
        isPresent(restAttrs.value['aria-labelledby'])
      ) {
        return;
      }

      warnInDevelopment(
        '[IconButton] Accessible name is missing. Provide `aria-label` or `aria-labelledby` for icon-only actions.',
      );
    });

    return {
      ariaBusy,
      className,
      iconSize,
      iconVariant,
      isButtonDisabled,
      loaderColor,
      loaderSize,
      restAttrs,
    };
  },
});
</script>

<template>
  <button
    v-bind="restAttrs"
    :aria-busy="ariaBusy"
    :class="className"
    :disabled="isButtonDisabled"
    :type="type"
  >
    <Loader
      v-if="isLoading"
      aria-hidden="true"
      class="icon-button__loader"
      :color="loaderColor"
      :size="loaderSize"
    />
    <Icon
      v-else
      aria-hidden="true"
      class="icon-button__visual"
      :name="icon"
      :size="iconSize"
      :variant="iconVariant"
    />
  </button>
</template>
