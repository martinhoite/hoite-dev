<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  circularProgressVariants,
  describeProgressNormalizationWarning,
  type LoadingColor,
  type LoadingSize,
  normalizeProgressValue,
} from '@hoite-dev/ui';
import { computed, defineComponent, getCurrentInstance, type PropType, watchEffect } from 'vue';
import { pickAriaAndDataAttributes } from '../../../../utils/attributes';

type CircularProgressBaseProps = {
  color?: LoadingColor;
  id?: string;
  labelClass?: string;
  label?: string;
  max?: number;
  showValue?: boolean;
  size?: LoadingSize;
  valueClass?: string;
  valueDisplay?: 'fraction' | 'percent';
  valueLabel?: string;
  value?: number;
};

type CircularProgressStyle = {
  '--circular-progress-circumference': string;
  '--circular-progress-offset': string;
};

const radius = 18;
const circumference = 2 * Math.PI * radius;

function isPresent(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().length > 0;
}

export type CircularProgressProps = CircularProgressBaseProps;

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
    labelClass: {
      required: false,
      type: String,
    },
    max: {
      required: false,
      type: Number,
    },
    showValue: {
      default: true,
      required: false,
      type: Boolean,
    },
    size: {
      required: false,
      type: String as PropType<LoadingSize>,
    },
    valueClass: {
      required: false,
      type: String,
    },
    valueDisplay: {
      default: 'percent',
      required: false,
      type: String as PropType<'fraction' | 'percent'>,
    },
    valueLabel: {
      required: false,
      type: String,
    },
    value: {
      required: false,
      type: Number,
    },
  },
  setup(props: Readonly<CircularProgressBaseProps>, { attrs }) {
    const instance = getCurrentInstance();
    const generatedId = `circular-progress-${instance?.uid ?? 0}`;

    const className = computed(() =>
      circularProgressVariants({
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
    const roundedPercent = computed(() => {
      if (normalized.value.valuePercent === undefined) {
        return undefined;
      }

      return Math.round(normalized.value.valuePercent);
    });
    const roundedValue = computed(() => {
      if (normalized.value.value === undefined) {
        return undefined;
      }

      return Math.round(normalized.value.value);
    });
    const roundedMax = computed(() => Math.round(normalized.value.max));
    const resolvedValueText = computed(() => {
      if (isPresent(props.valueLabel)) {
        return props.valueLabel;
      }

      if (roundedPercent.value === undefined) {
        return '...';
      }

      if (props.valueDisplay === 'fraction') {
        return `${roundedValue.value}/${roundedMax.value}`;
      }

      return `${roundedPercent.value}%`;
    });
    const indicatorClassName = computed(() => {
      if (normalized.value.isIndeterminate || normalized.value.valuePercent === undefined) {
        return 'circular-progress__indicator circular-progress__indicator--indeterminate';
      }

      return 'circular-progress__indicator';
    });
    const indicatorStyle = computed<CircularProgressStyle>(() => {
      const valuePercent = normalized.value.valuePercent;

      if (valuePercent === undefined) {
        return {
          '--circular-progress-circumference': `${circumference}`,
          '--circular-progress-offset': `${circumference}`,
        };
      }

      return {
        '--circular-progress-circumference': `${circumference}`,
        '--circular-progress-offset': `${circumference * (1 - valuePercent / 100)}`,
      };
    });

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
            '[CircularProgress] Accessible loading text is missing. Provide `label`, `aria-label`, or `aria-labelledby`, or mark the progress as decorative with `aria-hidden`.',
          );
        }
      }

      for (const warningReason of normalized.value.warningReasons) {
        warnInDevelopment(
          `[CircularProgress] ${describeProgressNormalizationWarning(warningReason)}`,
        );
      }
    });

    return {
      className,
      indicatorClassName,
      indicatorStyle,
      isOnFill: computed(() => props.color === 'on-fill'),
      normalized,
      progressId,
      radius,
      restAttrs,
      resolvedValueText,
      roundedMax,
      roundedPercent,
      roundedValue,
    };
  },
});
</script>

<template>
  <div :class="isOnFill ? 'progress-field progress-field--on-fill' : 'progress-field'">
    <div class="circular-progress-field">
      <div :class="className">
        <svg
          aria-hidden="true"
          class="circular-progress__svg"
          viewBox="0 0 40 40"
        >
          <circle
            class="circular-progress__track"
            cx="20"
            cy="20"
            :r="radius"
          />
          <circle
            :class="indicatorClassName"
            cx="20"
            cy="20"
            :r="radius"
            :style="indicatorStyle"
          />
        </svg>
        <span
          v-if="showValue"
          :class="['circular-progress__value', valueClass]"
        >
          {{ resolvedValueText }}
        </span>
        <progress
          v-bind="restAttrs"
          class="loading-visually-hidden"
          :id="progressId"
          :max="normalized.max"
          :value="normalized.isIndeterminate ? undefined : normalized.value"
        />
      </div>
      <label
        v-if="label && progressId"
        :class="['progress-field__label', 'circular-progress-field__label', labelClass]"
        :for="progressId"
      >
        {{ label }}
      </label>
    </div>
  </div>
</template>
