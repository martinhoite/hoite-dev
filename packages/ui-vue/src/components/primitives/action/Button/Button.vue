<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
  type IconName,
  type IconSize,
  type IconVariant,
  type LoadingColor,
  type LoadingSize,
} from '@hoite-dev/ui';
import {
  Comment,
  computed,
  defineComponent,
  nextTick,
  onMounted,
  type PropType,
  ref,
  Text,
  watch,
  watchEffect,
} from 'vue';

import Icon from '../../static/Icon';
import { Loader } from '../../static/Loading';

type ButtonBaseProps = {
  disabled?: boolean;
  isLoading?: boolean;
  leadingIcon?: IconName;
  loadingLabel?: string;
  preventLoadingShrink?: boolean;
  size?: ButtonSize;
  trailingIcon?: IconName;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps;

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

function resolveIconVariant(variant: ButtonVariant | undefined, isDisabled: boolean): IconVariant {
  if (isDisabled) {
    return 'disabled';
  }

  if (variant === 'secondary') {
    return 'primary';
  }

  return 'on-fill';
}

function resolveIconSize(size: ButtonSize | undefined): IconSize {
  if (size === 'small') {
    return 'sm';
  }

  if (size === 'large') {
    return 'lg';
  }

  return 'md';
}

function resolveLoaderSize(size: ButtonSize | undefined): LoadingSize {
  if (size === 'small') {
    return 'small';
  }

  return 'medium';
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
    isLoading: {
      default: false,
      required: false,
      type: Boolean,
    },
    leadingIcon: {
      required: false,
      type: String as PropType<IconName>,
    },
    loadingLabel: {
      required: false,
      type: String,
    },
    preventLoadingShrink: {
      default: false,
      required: false,
      type: Boolean,
    },
    size: {
      required: false,
      type: String as PropType<ButtonSize>,
    },
    trailingIcon: {
      required: false,
      type: String as PropType<IconName>,
    },
    type: {
      default: 'button',
      required: false,
      type: String as PropType<'button' | 'reset' | 'submit'>,
    },
    variant: {
      required: false,
      type: String as PropType<ButtonVariant>,
    },
  },
  setup(props: Readonly<ButtonBaseProps>, { attrs, slots }) {
    const buttonElement = ref<HTMLButtonElement>();
    const preservedWidth = ref<number | undefined>();
    const restAttrs = computed(() => pickButtonAttributes(attrs));
    const ariaBusy = computed(() => resolveAriaBusy(props.isLoading, restAttrs.value['aria-busy']));
    const isButtonDisabled = computed(() => props.disabled === true || props.isLoading === true);
    const hasDefaultSlotContent = computed(() => {
      const slotNodes = slots.default?.() ?? [];

      return slotNodes.some((node) => {
        if (node.type === Comment) {
          return false;
        }

        if (node.type === Text && typeof node.children === 'string') {
          return node.children.trim().length > 0;
        }

        return true;
      });
    });
    const hasVisibleContent = computed(() => {
      if (props.isLoading === true && isPresent(props.loadingLabel)) {
        return true;
      }

      return hasDefaultSlotContent.value;
    });
    const className = computed(() =>
      buttonVariants({
        class: attrs.class,
        size: props.size,
        variant: props.variant,
      }),
    );
    const loaderColor = computed<LoadingColor>(() => {
      if (isButtonDisabled.value || props.variant === 'secondary') {
        return 'secondary';
      }

      return 'on-fill';
    });
    const loaderSize = computed(() => resolveLoaderSize(props.size));
    const iconSize = computed(() => resolveIconSize(props.size));
    const iconVariant = computed(() => resolveIconVariant(props.variant, isButtonDisabled.value));
    const shouldShowLeadingLoader = computed(
      () =>
        props.isLoading === true &&
        (props.leadingIcon !== undefined ||
          (props.trailingIcon === undefined && hasVisibleContent.value)),
    );
    const shouldShowTrailingLoader = computed(
      () =>
        props.isLoading === true &&
        props.leadingIcon === undefined &&
        props.trailingIcon !== undefined,
    );
    const buttonStyle = computed(() => {
      if (
        props.preventLoadingShrink === true &&
        props.isLoading === true &&
        preservedWidth.value !== undefined
      ) {
        return [attrs.style, { minWidth: `${preservedWidth.value}px` }];
      }

      return attrs.style;
    });
    const updatePreservedWidth = async () => {
      if (props.preventLoadingShrink !== true || props.isLoading === true) {
        return;
      }

      await nextTick();

      if (buttonElement.value === undefined) {
        return;
      }

      preservedWidth.value = buttonElement.value.getBoundingClientRect().width;
    };

    onMounted(() => {
      void updatePreservedWidth();
    });

    watch(
      [
        () => props.preventLoadingShrink,
        () => props.isLoading,
        () => props.loadingLabel,
        () => props.leadingIcon,
        () => props.trailingIcon,
        () => props.size,
        () => props.variant,
        hasDefaultSlotContent,
      ],
      () => {
        void updatePreservedWidth();
      },
    );

    watchEffect(() => {
      if (hasVisibleContent.value) {
        return;
      }

      warnInDevelopment(
        '[Button] Visible button text is missing. Use Button with visible content, or use IconButton for icon-only actions.',
      );
    });

    return {
      className,
      ariaBusy,
      buttonElement,
      buttonStyle,
      hasVisibleContent,
      iconSize,
      iconVariant,
      isButtonDisabled,
      loaderColor,
      loaderSize,
      restAttrs,
      shouldShowLeadingLoader,
      shouldShowTrailingLoader,
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
    ref="buttonElement"
    :style="buttonStyle"
    :type="type"
  >
    <Loader
      v-if="shouldShowLeadingLoader"
      aria-hidden="true"
      class="button__leading-visual button__loader"
      :color="loaderColor"
      :size="loaderSize"
    />
    <Icon
      v-else-if="leadingIcon !== undefined"
      class="button__leading-visual"
      :name="leadingIcon"
      :size="iconSize"
      :variant="iconVariant"
    />
    <span
      v-if="hasVisibleContent"
      class="button__content"
    >
      <template v-if="isLoading && loadingLabel">{{ loadingLabel }}</template>
      <slot v-else></slot>
    </span>
    <Loader
      v-if="shouldShowTrailingLoader"
      aria-hidden="true"
      class="button__trailing-visual button__loader"
      :color="loaderColor"
      :size="loaderSize"
    />
    <Icon
      v-else-if="trailingIcon !== undefined"
      class="button__trailing-visual"
      :name="trailingIcon"
      :size="iconSize"
      :variant="iconVariant"
    />
  </button>
</template>
