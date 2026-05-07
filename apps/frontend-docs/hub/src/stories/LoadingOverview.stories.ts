import {
  circularProgressVariants,
  type LoadingColor,
  type LoadingSize,
  loaderVariants,
  normalizeProgressValue,
  progressVariants,
  supportedLoadingColors,
  supportedLoadingSizes,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Primitives/Feedback/Loading',
};

export default meta;

type Story = StoryObj;

type LoaderSample = {
  classOutput: string;
  color: LoadingColor;
  key: string;
  size: LoadingSize;
  surfaceClass: string;
};

type ProgressSample = {
  ariaLabel?: string;
  classOutput: string;
  isOnFill: boolean;
  key: string;
  label?: string;
  max: number;
  progressId: string;
  surfaceClass: string;
  value?: number;
  valuePercent: string;
};

type CircularSample = {
  ariaLabel?: string;
  classOutput: string;
  indicatorClassName: string;
  indicatorStyle: {
    '--circular-progress-circumference': string;
    '--circular-progress-offset': string;
  };
  isOnFill: boolean;
  key: string;
  label?: string;
  max: number;
  progressId: string;
  showValue: boolean;
  surfaceClass: string;
  value?: number;
  valueText: string;
};

const radius = 18;
const circumference = 2 * Math.PI * radius;

function getSurfaceClass(color: LoadingColor): string {
  if (color === 'on-fill') {
    return 'rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]';
  }

  return 'rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5';
}

function getProgressSample(
  key: string,
  options: {
    ariaLabel?: string;
    color: LoadingColor;
    label?: string;
    max: number;
    size: LoadingSize;
    value?: number;
  },
): ProgressSample {
  const normalized = normalizeProgressValue({ max: options.max, value: options.value });
  const className = normalized.isIndeterminate ? 'progress--indeterminate' : undefined;

  return {
    ariaLabel: options.ariaLabel,
    classOutput: progressVariants({
      className,
      color: options.color,
      size: options.size,
    }),
    isOnFill: options.color === 'on-fill',
    key,
    label: options.label,
    max: normalized.max,
    progressId: `progress-${key}`,
    surfaceClass: getSurfaceClass(options.color),
    value: normalized.isIndeterminate ? undefined : normalized.value,
    valuePercent: `${normalized.valuePercent ?? 0}%`,
  };
}

function getCircularSample(
  key: string,
  options: {
    ariaLabel?: string;
    color: LoadingColor;
    label?: string;
    max: number;
    showValue?: boolean;
    size: LoadingSize;
    valueDisplay?: 'fraction' | 'percent';
    value?: number;
  },
): CircularSample {
  const normalized = normalizeProgressValue({ max: options.max, value: options.value });
  const valuePercent = normalized.valuePercent;
  const roundedPercent = valuePercent === undefined ? undefined : Math.round(valuePercent);
  const roundedValue = normalized.value === undefined ? undefined : Math.round(normalized.value);
  const roundedMax = Math.round(normalized.max);
  const showValue = options.showValue ?? true;
  let valueText = '...';

  if (roundedPercent !== undefined) {
    if (options.valueDisplay === 'fraction') {
      valueText = `${roundedValue}/${roundedMax}`;
    } else {
      valueText = `${roundedPercent}%`;
    }
  }

  return {
    ariaLabel: options.ariaLabel,
    classOutput: circularProgressVariants({
      color: options.color,
      size: options.size,
    }),
    indicatorClassName:
      normalized.isIndeterminate || valuePercent === undefined
        ? 'circular-progress__indicator circular-progress__indicator--indeterminate'
        : 'circular-progress__indicator',
    indicatorStyle: {
      '--circular-progress-circumference': `${circumference}`,
      '--circular-progress-offset':
        valuePercent === undefined
          ? `${circumference}`
          : `${circumference * (1 - valuePercent / 100)}`,
    },
    isOnFill: options.color === 'on-fill',
    key,
    label: options.label,
    max: normalized.max,
    progressId: `circular-progress-${key}`,
    showValue,
    surfaceClass: getSurfaceClass(options.color),
    value: normalized.isIndeterminate ? undefined : normalized.value,
    valueText,
  };
}

const loaderSamples: readonly LoaderSample[] = supportedLoadingColors.flatMap((color) =>
  supportedLoadingSizes.map((size) => ({
    classOutput: loaderVariants({ color, size }),
    color,
    key: `${color}-${size}`,
    size,
    surfaceClass: getSurfaceClass(color),
  })),
);

const progressSamples: readonly ProgressSample[] = [
  getProgressSample('determinate', {
    color: 'primary',
    label: 'Deploying assets',
    max: 100,
    size: 'large',
    value: 76,
  }),
  getProgressSample('indeterminate', {
    ariaLabel: 'Syncing content',
    color: 'secondary',
    max: 100,
    size: 'medium',
    value: undefined,
  }),
  getProgressSample('on-fill', {
    color: 'on-fill',
    label: 'Publishing release',
    max: 120,
    size: 'small',
    value: 34,
  }),
];

const circularSamples: readonly CircularSample[] = [
  getCircularSample('determinate', {
    color: 'primary',
    label: 'Generating report',
    max: 100,
    size: 'large',
    value: 58,
  }),
  getCircularSample('indeterminate', {
    ariaLabel: 'Uploading files',
    color: 'secondary',
    max: 100,
    showValue: false,
    size: 'medium',
    value: undefined,
  }),
  getCircularSample('on-fill', {
    color: 'on-fill',
    label: 'Warming cache',
    max: 10,
    size: 'small',
    value: 4,
    valueDisplay: 'fraction',
  }),
];

export const Overview: Story = {
  name: 'Docs',
  parameters: {
    docsOnly: true,
  },
  render: () => ({
    setup() {
      return {
        circularSamples,
        loaderSamples,
        progressSamples,
        radius,
      };
    },
    template: `
      <div class="mx-auto w-full max-w-5xl px-4 py-6">
        <div class="grid gap-6">
          <section class="grid gap-3">
            <h2 class="m-0 text-base font-semibold">Loader</h2>
            <div class="grid gap-4 md:grid-cols-3">
              <div
                v-for="sample in loaderSamples"
                :key="sample.key"
                :class="sample.surfaceClass"
              >
                <div class="flex items-center justify-between">
                  <code>{{ sample.color }} / {{ sample.size }}</code>
                  <span
                    :class="sample.classOutput"
                    :aria-label="\`\${sample.color} \${sample.size} loader\`"
                    role="status"
                  />
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-3">
            <h2 class="m-0 text-base font-semibold">Progress</h2>
            <div class="grid gap-4">
              <div
                v-for="sample in progressSamples"
                :key="sample.key"
                :class="sample.surfaceClass"
              >
                <div class="progress-field" :class="sample.isOnFill ? 'progress-field--on-fill' : undefined">
                  <label
                    v-if="sample.label"
                    class="progress-field__label"
                    :for="sample.progressId"
                  >
                    {{ sample.label }}
                  </label>
                  <div
                    aria-hidden="true"
                    :class="sample.classOutput"
                    :style="{ '--progress-value-percent': sample.valuePercent }"
                  >
                    <span class="progress__indicator" />
                  </div>
                  <progress
                    class="loading-visually-hidden"
                    :aria-label="sample.ariaLabel"
                    :id="sample.progressId"
                    :max="sample.max"
                    :value="sample.value"
                  />
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-3">
            <h2 class="m-0 text-base font-semibold">CircularProgress</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="sample in circularSamples"
                :key="sample.key"
                :class="sample.surfaceClass"
              >
                <div class="progress-field" :class="sample.isOnFill ? 'progress-field--on-fill' : undefined">
                  <div class="circular-progress-field">
                    <div :class="sample.classOutput">
                      <svg aria-hidden="true" class="circular-progress__svg" viewBox="0 0 40 40">
                        <circle class="circular-progress__track" cx="20" cy="20" :r="radius" />
                        <circle
                          :class="sample.indicatorClassName"
                          cx="20"
                          cy="20"
                          :r="radius"
                          :style="sample.indicatorStyle"
                        />
                      </svg>
                      <span v-if="sample.showValue" class="circular-progress__value">
                        {{ sample.valueText }}
                      </span>
                      <progress
                        class="loading-visually-hidden"
                        :aria-label="sample.ariaLabel"
                        :id="sample.progressId"
                        :max="sample.max"
                        :value="sample.value"
                      />
                    </div>
                    <label
                      v-if="sample.label"
                      class="progress-field__label circular-progress-field__label"
                      :for="sample.progressId"
                    >
                      {{ sample.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `,
  }),
};
