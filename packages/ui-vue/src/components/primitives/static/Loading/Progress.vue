<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  describeProgressNormalizationWarning,
  type LoadingColor,
  type LoadingSize,
  normalizeProgressValue,
  pickAriaAndDataAttributes,
  progressVariants,
} from '@hoite-dev/ui';
import { computed, defineComponent, getCurrentInstance, type PropType, watchEffect } from 'vue';

type ProgressBaseProps = {
  color?: LoadingColor;
  id?: string;
  label?: string;
  max?: number;
  size?: LoadingSize;
  value?: number;
};

type ProgressVisualStyle = {
  '--progress-value-percent': string;
};

function isPresent(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().length > 0;
}

export type ProgressProps = ProgressBaseProps;

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
    label: {
      required: false,
      type: String,
    },
    max: {
      required: false,
      type: Number,
    },
    size: {
      required: false,
      type: String as PropType<LoadingSize>,
    },
    value: {
      required: false,
      type: Number,
    },
  },
  setup(props: Readonly<ProgressBaseProps>, { attrs }) {
    const instance = getCurrentInstance();
    const generatedId = `progress-${instance?.uid ?? 0}`;

    const className = computed(() =>
      progressVariants({
        class: attrs.class,
        color: props.color,
        size: props.size,
      }),
    );
    const normalized = computed(() =>
      normalizeProgressValue({ max: props.max, value: props.value }),
    );
    const restAttrs = computed(() => pickAriaAndDataAttributes(attrs));
    const progressId = computed(() => {
      if (props.id) {
        return props.id;
      }

      if (isPresent(props.label)) {
        return generatedId;
      }

      return undefined;
    });
    const visualClassName = computed(() => {
      if (normalized.value.isIndeterminate) {
        return `${className.value} progress--indeterminate`;
      }

      return className.value;
    });
    const visualStyle = computed<ProgressVisualStyle>(() => ({
      '--progress-value-percent': `${normalized.value.valuePercent ?? 0}%`,
    }));

    watchEffect(() => {
      const ariaHidden = restAttrs.value['aria-hidden'];

      if (ariaHidden === true || ariaHidden === 'true') {
        return;
      }

      if (!isPresent(props.label)) {
        const ariaLabel = restAttrs.value['aria-label'];
        const ariaLabelledBy = restAttrs.value['aria-labelledby'];

        if (!isPresent(ariaLabel) && !isPresent(ariaLabelledBy)) {
          warnInDevelopment(
            '[Progress] Accessible loading text is missing. Provide `label`, `aria-label`, or `aria-labelledby`, or mark the progress as decorative with `aria-hidden`.',
          );
        }
      }

      for (const warningReason of normalized.value.warningReasons) {
        warnInDevelopment(`[Progress] ${describeProgressNormalizationWarning(warningReason)}`);
      }
    });

    return {
      className,
      isOnFill: computed(() => props.color === 'on-fill'),
      normalized,
      progressId,
      restAttrs,
      visualClassName,
      visualStyle,
    };
  },
});
</script>

<template>
  <div :class="isOnFill ? 'progress-field progress-field--on-fill' : 'progress-field'">
    <label
      v-if="label && progressId"
      class="progress-field__label"
      :for="progressId"
    >
      {{ label }}
    </label>
    <div
      aria-hidden="true"
      :class="visualClassName"
      :style="visualStyle"
    >
      <span class="progress__indicator" />
    </div>
    <progress
      v-bind="restAttrs"
      class="loading-visually-hidden"
      :id="progressId"
      :max="normalized.max"
      :value="normalized.isIndeterminate ? undefined : normalized.value"
    />
  </div>
</template>
