import {
  copyFrontendDocsSnippetToClipboard,
  createFrontendDocsComponentSnippet,
  createFrontendDocsHighlightedSnippetHtml,
  createFrontendDocsPlaygroundParameters,
  createVueStoryPreview,
  createVueStorySourcePanel,
  withStoryPlayground,
  withStoryStack,
  withVueStoryPlaygroundContent,
} from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type LoadingColor,
  type LoadingSize,
  loadingDocs,
  supportedLoadingColors,
  supportedLoadingSizes,
} from '@hoite-dev/ui';
import { CircularProgress, Loader, Progress } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { type ComputedRef, computed, defineComponent, ref } from 'vue';

type CircularValueDisplay = 'fraction' | 'percent';

type LoadingStoryArgs = {
  ariaLabel: string;
  color: LoadingColor;
  indeterminate: boolean;
  labelClass: string;
  label: string;
  max: number;
  showValue: boolean;
  size: LoadingSize;
  valueClass: string;
  valueLabel: string;
  value: number;
  valueDisplay: CircularValueDisplay;
};

function createSnippetCopyState(snippet: ComputedRef<string>) {
  const copyButtonLabel = ref('Copy code');
  const highlightedSnippet = computed(() =>
    createFrontendDocsHighlightedSnippetHtml(snippet.value),
  );
  const copySnippet = async () => {
    copyButtonLabel.value = 'Copying';
    copyButtonLabel.value = (await copyFrontendDocsSnippetToClipboard(snippet.value))
      ? 'Copied'
      : 'Copy error';
  };

  return {
    copyButtonLabel,
    copySnippet,
    highlightedSnippet,
  };
}

const storyArgTypes: Partial<ArgTypes<LoadingStoryArgs>> = {
  size: {
    control: 'select',
    description: loadingDocs.argTypeDescriptions.size,
    options: supportedLoadingSizes,
    table: {
      category: 'Component API',
    },
  },
  color: {
    control: 'select',
    description: loadingDocs.argTypeDescriptions.color,
    options: supportedLoadingColors,
    table: {
      category: 'Component API',
    },
  },
  label: {
    control: 'text',
    description: loadingDocs.argTypeDescriptions.label,
    table: {
      category: 'Component API',
    },
  },
  labelClass: {
    control: 'text',
    description: 'Optional class applied to the CircularProgress label element.',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  ariaLabel: {
    control: 'text',
    description: loadingDocs.argTypeDescriptions.ariaLabel,
    name: 'aria-label',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  max: {
    control: 'number',
    description: loadingDocs.argTypeDescriptions.max,
    table: {
      category: 'Component API',
    },
  },
  value: {
    control: 'number',
    description: loadingDocs.argTypeDescriptions.value,
    table: {
      category: 'Component API',
    },
  },
  valueLabel: {
    control: 'text',
    description: 'Optional custom value text shown inside CircularProgress.',
    table: {
      category: 'Component API',
    },
  },
  valueClass: {
    control: 'text',
    description: 'Optional class applied to the CircularProgress value element.',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  indeterminate: {
    control: 'boolean',
    description: 'When true, renders the indeterminate loading state.',
    table: {
      category: 'Component API',
    },
  },
  showValue: {
    control: 'boolean',
    description: loadingDocs.argTypeDescriptions.showValue,
    table: {
      category: 'Component API',
    },
  },
  valueDisplay: {
    control: 'inline-radio',
    description: loadingDocs.argTypeDescriptions.valueDisplay,
    options: ['percent', 'fraction'] satisfies CircularValueDisplay[],
    table: {
      category: 'Component API',
    },
  },
};

const LoaderPlaygroundPreview = defineComponent({
  components: { Loader },
  props: {
    ariaLabel: {
      required: true,
      type: String,
    },
    color: {
      required: true,
      type: String as () => LoadingColor,
    },
    size: {
      required: true,
      type: String as () => LoadingSize,
    },
  },
  setup(props) {
    const normalizedAriaLabel = computed(() => {
      if (props.ariaLabel.trim().length > 0) {
        return props.ariaLabel;
      }

      return undefined;
    });
    const surfaceClass = computed(() => getSurfaceClass(props.color));
    const snippet = computed(() =>
      createFrontendDocsComponentSnippet({
        componentName: 'Loader',
        framework: 'vue',
        props: [
          {
            name: 'aria-label',
            value: normalizedAriaLabel.value,
          },
          {
            name: 'color',
            value: props.color,
          },
          {
            name: 'size',
            value: props.size,
          },
        ],
      }),
    );
    const { copyButtonLabel, copySnippet, highlightedSnippet } = createSnippetCopyState(snippet);

    return {
      copyButtonLabel,
      copySnippet,
      highlightedSnippet,
      normalizedAriaLabel,
      snippet,
      surfaceClass,
    };
  },
  template: withStoryPlayground(`
      <div class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4 text-sm text-[var(--color-text-secondary)]">
        Use <code>aria-label</code> or <code>aria-labelledby</code> when no visible label is present.
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(`
          <div :class="surfaceClass">
            <Loader :aria-label="normalizedAriaLabel" :color="color" :size="size" />
          </div>
        `)}
        ${createVueStorySourcePanel()}
      `)}
  `),
});

const ProgressPlaygroundPreview = defineComponent({
  components: { Progress },
  props: {
    ariaLabel: {
      required: true,
      type: String,
    },
    color: {
      required: true,
      type: String as () => LoadingColor,
    },
    indeterminate: {
      required: true,
      type: Boolean,
    },
    label: {
      required: true,
      type: String,
    },
    labelClass: {
      required: true,
      type: String,
    },
    max: {
      required: true,
      type: Number,
    },
    size: {
      required: true,
      type: String as () => LoadingSize,
    },
    value: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const normalizedAriaLabel = computed(() => {
      if (props.ariaLabel.trim().length > 0) {
        return props.ariaLabel;
      }

      return undefined;
    });
    const normalizedLabel = computed(() => {
      if (props.label.trim().length > 0) {
        return props.label;
      }

      return undefined;
    });
    const normalizedValue = computed(() => {
      if (props.indeterminate) {
        return undefined;
      }

      return props.value;
    });
    const surfaceClass = computed(() => getSurfaceClass(props.color));
    const snippet = computed(() =>
      createFrontendDocsComponentSnippet({
        componentName: 'Progress',
        framework: 'vue',
        props: [
          {
            name: 'aria-label',
            value: normalizedAriaLabel.value,
          },
          {
            name: 'color',
            value: props.color,
          },
          {
            name: 'label',
            value: normalizedLabel.value,
          },
          {
            name: 'max',
            value: props.max,
          },
          {
            name: 'size',
            value: props.size,
          },
          {
            name: 'value',
            value: normalizedValue.value,
          },
        ],
      }),
    );
    const { copyButtonLabel, copySnippet, highlightedSnippet } = createSnippetCopyState(snippet);

    return {
      copyButtonLabel,
      copySnippet,
      highlightedSnippet,
      normalizedAriaLabel,
      normalizedLabel,
      normalizedValue,
      snippet,
      surfaceClass,
    };
  },
  template: withStoryPlayground(`
      <div class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4 text-sm text-[var(--color-text-secondary)]">
        Indeterminate progress omits <code>value</code>; otherwise value is normalized against <code>max</code>.
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(
          `
          <div :class="[surfaceClass, 'box-border w-full [&_.progress-field]:w-full']">
            <Progress
              :aria-label="normalizedAriaLabel"
              :color="color"
              :label="normalizedLabel"
              :max="max"
              :size="size"
              :value="normalizedValue"
            />
          </div>
        `,
          'min-w-0 w-full',
        )}
        ${createVueStorySourcePanel()}
      `)}
  `),
});

const CircularProgressPlaygroundPreview = defineComponent({
  components: { CircularProgress },
  props: {
    ariaLabel: {
      required: true,
      type: String,
    },
    color: {
      required: true,
      type: String as () => LoadingColor,
    },
    label: {
      required: true,
      type: String,
    },
    labelClass: {
      required: true,
      type: String,
    },
    max: {
      required: true,
      type: Number,
    },
    showValue: {
      required: true,
      type: Boolean,
    },
    size: {
      required: true,
      type: String as () => LoadingSize,
    },
    valueClass: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: Number,
    },
    valueDisplay: {
      required: true,
      type: String as () => CircularValueDisplay,
    },
    valueLabel: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const normalizedAriaLabel = computed(() => {
      if (props.ariaLabel.trim().length > 0) {
        return props.ariaLabel;
      }

      return undefined;
    });
    const normalizedLabel = computed(() => {
      if (props.label.trim().length > 0) {
        return props.label;
      }

      return undefined;
    });
    const normalizedValueLabel = computed(() => {
      if (props.valueLabel.trim().length > 0) {
        return props.valueLabel;
      }

      return undefined;
    });
    const surfaceClass = computed(() => getSurfaceClass(props.color));
    const snippet = computed(() =>
      createFrontendDocsComponentSnippet({
        componentName: 'CircularProgress',
        framework: 'vue',
        props: [
          {
            name: 'aria-label',
            value: normalizedAriaLabel.value,
          },
          {
            name: 'color',
            value: props.color,
          },
          {
            name: 'label',
            value: normalizedLabel.value,
          },
          {
            name: 'label-class',
            value: props.labelClass,
          },
          {
            name: 'max',
            value: props.max,
          },
          {
            defaultValue: true,
            name: 'show-value',
            value: props.showValue,
          },
          {
            name: 'size',
            value: props.size,
          },
          {
            name: 'value',
            value: props.value,
          },
          {
            name: 'value-class',
            value: props.valueClass,
          },
          {
            name: 'value-display',
            value: props.valueDisplay,
          },
          {
            name: 'value-label',
            value: normalizedValueLabel.value,
          },
        ],
      }),
    );
    const { copyButtonLabel, copySnippet, highlightedSnippet } = createSnippetCopyState(snippet);

    return {
      copyButtonLabel,
      copySnippet,
      highlightedSnippet,
      normalizedAriaLabel,
      normalizedLabel,
      normalizedValueLabel,
      snippet,
      surfaceClass,
    };
  },
  template: withStoryPlayground(`
      <div class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4 text-sm text-[var(--color-text-secondary)]">
        Center value text can be generated as a percent or step fraction, or replaced with <code>valueLabel</code>.
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(`
          <div :class="surfaceClass">
            <CircularProgress
              :aria-label="normalizedAriaLabel"
              :color="color"
              :label="normalizedLabel"
              :label-class="labelClass || undefined"
              :max="max"
              :show-value="showValue"
              :size="size"
              :value="value"
              :value-class="valueClass || undefined"
              :value-display="valueDisplay"
              :value-label="normalizedValueLabel"
            />
          </div>
        `)}
        ${createVueStorySourcePanel()}
      `)}
  `),
});

const meta: Meta<LoadingStoryArgs> = {
  args: {
    ariaLabel: 'Loading content',
    color: 'primary',
    indeterminate: false,
    labelClass: '',
    label: 'Loading content',
    max: 100,
    showValue: true,
    size: 'medium',
    valueClass: '',
    valueLabel: '',
    value: 42,
    valueDisplay: 'percent',
  },
  argTypes: storyArgTypes,
  parameters: {
    controls: {
      sort: 'none',
    },
  },
  title: 'Primitives/Feedback/Loading',
};

export default meta;

type Story = StoryObj<LoadingStoryArgs>;

function getSurfaceClass(color: LoadingColor): string {
  if (color === 'on-fill') {
    return 'rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]';
  }

  return 'rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5';
}

export const LoaderPlayground: Story = {
  name: 'Loader Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: ['size', 'color', 'ariaLabel'],
      sort: 'none',
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => ({
    components: { LoaderPlaygroundPreview },
    setup() {
      return {
        args,
      };
    },
    template: '<LoaderPlaygroundPreview v-bind="args" />',
  }),
};

export const ProgressPlayground: Story = {
  name: 'Progress Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: ['size', 'color', 'label', 'ariaLabel', 'value', 'max', 'indeterminate'],
      sort: 'none',
    },
  }),
  render: (args) => ({
    components: { ProgressPlaygroundPreview },
    setup() {
      return {
        args,
      };
    },
    template: '<ProgressPlaygroundPreview v-bind="args" />',
  }),
};

export const CircularProgressPlayground: Story = {
  name: 'CircularProgress Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: [
        'size',
        'color',
        'label',
        'labelClass',
        'ariaLabel',
        'value',
        'max',
        'showValue',
        'valueLabel',
        'valueClass',
        'valueDisplay',
      ],
      sort: 'none',
    },
  }),
  render: (args) => ({
    components: { CircularProgressPlaygroundPreview },
    setup() {
      return {
        args,
      };
    },
    template: '<CircularProgressPlaygroundPreview v-bind="args" />',
  }),
};

export const LoaderExamples: Story = {
  name: 'Loader',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.loaderShowcase,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Loader },
    setup() {
      return {
        colors: supportedLoadingColors,
        getSurfaceClass,
        sizes: supportedLoadingSizes,
      };
    },
    template: `
      <div class="grid gap-4 md:grid-cols-3">
        <div
          v-for="color in colors"
          :key="color"
          :class="getSurfaceClass(color)"
        >
          <div class="grid gap-4">
            <div
              v-for="size in sizes"
              :key="\`\${color}-\${size}\`"
              class="flex items-center justify-between"
            >
              <code>{{ size }}</code>
              <Loader :aria-label="\`\${color} \${size} loader\`" :color="color" :size="size" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ProgressExamples: Story = {
  name: 'Progress',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.progressShowcase,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Progress },
    template: withStoryStack(`
        <div class="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5">
          <Progress color="primary" label="Deploying assets" :max="100" size="large" :value="76" />
        </div>
        <div class="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5">
          <Progress aria-label="Syncing content" color="secondary" size="medium" />
        </div>
        <div class="rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]">
          <Progress color="on-fill" label="Publishing release" :max="120" size="small" :value="34" />
        </div>
    `),
  }),
};

export const CircularProgressExamples: Story = {
  name: 'CircularProgress',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.circularProgressShowcase,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { CircularProgress },
    template: `
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5">
          <CircularProgress color="primary" label="Generating report" :max="100" size="large" :value="58" />
        </div>
        <div class="rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]">
          <CircularProgress color="on-fill" label="Warming cache" :max="10" size="small" :value="4" value-display="fraction" />
        </div>
      </div>
    `,
  }),
};
