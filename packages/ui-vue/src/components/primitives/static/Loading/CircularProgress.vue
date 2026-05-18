<script lang="ts">
import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  circularProgressVariants,
  describeProgressNormalizationWarning,
  type LoadingColor,
  type LoadingSize,
  normalizeProgressValue,
  pickAriaAndDataAttributes,
} from '@hoite-dev/ui';
import { computed, defineComponent, getCurrentInstance, type PropType, watchEffect } from 'vue';

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
      return Math.round(normalized.value.valuePercent ?? 0);
    });
    const roundedValue = computed(() => {
      return Math.round(normalized.value.value ?? 0);
    });
    const roundedMax = computed(() => Math.round(normalized.value.max));
    const resolvedValueText = computed(() => {
      if (isPresent(props.valueLabel)) {
        return props.valueLabel;
      }

      if (props.valueDisplay === 'fraction') {
        return `${roundedValue.value}/${roundedMax.value}`;
      }

      return `${roundedPercent.value}%`;
    });
    const isFractionValueDisplay = computed(() => props.valueDisplay === 'fraction');
    const indicatorStyle = computed<CircularProgressStyle>(() => {
      const valuePercent = normalized.value.valuePercent ?? 0;

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

      if (normalized.value.isIndeterminate) {
        warnInDevelopment(
          '[CircularProgress] Indeterminate state is no longer supported. Falling back to 0%.',
        );
      }
    });

    return {
      className,
      indicatorStyle,
      isOnFill: computed(() => props.color === 'on-fill'),
      normalized,
      progressId,
      radius,
      restAttrs,
      resolvedValueText,
      isFractionValueDisplay,
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
            class="circular-progress__indicator"
            cx="20"
            cy="20"
            :r="radius"
            :style="indicatorStyle"
          />
        </svg>
        <span
          v-if="showValue"
          :class="[
            'circular-progress__value',
            isFractionValueDisplay ? 'circular-progress__value--fraction' : undefined,
            valueClass,
          ]"
        >
          {{ resolvedValueText }}
        </span>
        <progress
          v-bind="restAttrs"
          class="loading-visually-hidden"
          :id="progressId"
          :max="normalized.max"
          :value="normalized.value ?? 0"
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
