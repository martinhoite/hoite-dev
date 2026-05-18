import {
  copyFrontendDocsSnippetToClipboard,
  createFrontendDocsComponentSnippet,
  createFrontendDocsHighlightedSnippetHtml,
  createFrontendDocsPlaygroundParameters,
  createVueStoryPreview,
  createVueStorySourcePanel,
  withStoryPlayground,
  withVueStoryPlaygroundContent,
} from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type IconButtonSize,
  type IconButtonVariant,
  type IconName,
  iconButtonDocs,
  supportedIconButtonSizes,
  supportedIconButtonVariants,
  supportedIconNames,
} from '@hoite-dev/ui';
import { IconButton } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, onBeforeUnmount, ref } from 'vue';

type IconButtonStoryArgs = {
  'aria-label': string;
  disabled: boolean;
  icon: IconName;
  isLoading: boolean;
  size: IconButtonSize;
  variant: IconButtonVariant;
};

const defaultIconButtonArgs: IconButtonStoryArgs = {
  'aria-label': 'Create item',
  disabled: false,
  icon: 'plus',
  isLoading: false,
  size: 'medium',
  variant: 'primary',
};

const storyArgTypes: Partial<ArgTypes<IconButtonStoryArgs>> = {
  'aria-label': {
    control: 'text',
    description: iconButtonDocs.argTypeDescriptions['aria-label'],
    name: 'aria-label',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  disabled: {
    control: 'boolean',
    description: iconButtonDocs.argTypeDescriptions.disabled,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  icon: {
    control: 'select',
    description: iconButtonDocs.argTypeDescriptions.icon,
    options: supportedIconNames,
    table: {
      category: 'Component API',
    },
  },
  isLoading: {
    control: 'boolean',
    description: iconButtonDocs.argTypeDescriptions.isLoading,
    table: {
      category: 'Component API',
    },
  },
  size: {
    control: 'select',
    description: iconButtonDocs.argTypeDescriptions.size,
    options: supportedIconButtonSizes,
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: iconButtonDocs.argTypeDescriptions.variant,
    options: supportedIconButtonVariants,
    table: {
      category: 'Component API',
    },
  },
};

function normalizeIconButtonArgs(args: IconButtonStoryArgs): IconButtonStoryArgs {
  const icon = supportedIconNames.includes(args.icon) ? args.icon : defaultIconButtonArgs.icon;
  const size = supportedIconButtonSizes.includes(args.size)
    ? args.size
    : defaultIconButtonArgs.size;
  const variant = supportedIconButtonVariants.includes(args.variant)
    ? args.variant
    : defaultIconButtonArgs.variant;

  return {
    ...args,
    icon,
    size,
    variant,
  };
}

const IconButtonPlaygroundPreview = defineComponent({
  components: { IconButton },
  props: {
    'aria-label': {
      required: true,
      type: String,
    },
    disabled: {
      required: true,
      type: Boolean,
    },
    icon: {
      required: true,
      type: String as () => IconName,
    },
    isLoading: {
      required: true,
      type: Boolean,
    },
    size: {
      required: true,
      type: String as () => IconButtonSize,
    },
    variant: {
      required: true,
      type: String as () => IconButtonVariant,
    },
  },
  setup(props) {
    const iconButtonArgs = computed(() => ({
      'aria-label': props['aria-label'],
      disabled: props.disabled,
      icon: props.icon,
      isLoading: props.isLoading,
      size: props.size,
      variant: props.variant,
    }));
    const snippet = computed(() =>
      createFrontendDocsComponentSnippet({
        componentName: 'IconButton',
        framework: 'vue',
        props: [
          {
            defaultValue: defaultIconButtonArgs.icon,
            name: 'icon',
            value: props.icon,
          },
          {
            defaultValue: defaultIconButtonArgs.variant,
            name: 'variant',
            value: props.variant,
          },
          {
            defaultValue: defaultIconButtonArgs.size,
            name: 'size',
            value: props.size,
          },
          {
            defaultValue: false,
            name: 'isLoading',
            value: props.isLoading,
          },
          {
            defaultValue: false,
            name: 'disabled',
            value: props.disabled,
          },
          {
            name: 'aria-label',
            value: props['aria-label'],
          },
        ],
      }),
    );
    const copyButtonLabel = ref('Copy code');
    const copySnippet = async () => {
      copyButtonLabel.value = 'Copying';
      copyButtonLabel.value = (await copyFrontendDocsSnippetToClipboard(snippet.value))
        ? 'Copied'
        : 'Copy error';
    };
    const highlightedSnippet = computed(() =>
      createFrontendDocsHighlightedSnippetHtml(snippet.value),
    );

    return {
      copyButtonLabel,
      copySnippet,
      highlightedSnippet,
      iconButtonArgs,
      snippet,
    };
  },
  template: withStoryPlayground(`
    <div
      class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4"
    >
      <p class="m-0 text-sm text-[var(--color-text-primary)]">
        IconButton renders a native <code>button</code> for icon-only actions and requires
        <code>aria-label</code> or <code>aria-labelledby</code>.
      </p>
    </div>
    ${withVueStoryPlaygroundContent(`
      ${createVueStoryPreview(`
        <IconButton v-bind="iconButtonArgs" />
      `)}
      ${createVueStorySourcePanel()}
    `)}
  `),
});

const meta: Meta<IconButtonStoryArgs> = {
  args: defaultIconButtonArgs,
  argTypes: storyArgTypes,
  component: IconButtonPlaygroundPreview,
  parameters: {
    controls: {
      include: ['icon', 'variant', 'size', 'isLoading', 'disabled', 'aria-label'],
      sort: 'none',
    },
  },
  title: 'Primitives/Action/IconButton',
};

export default meta;

type Story = StoryObj<IconButtonStoryArgs>;

const stateLabels = ['Default', 'Hover', 'Focused', 'Pressed', 'Disabled', 'Loading'] as const;

const InteractiveLoadingExample = defineComponent({
  components: { IconButton },
  setup() {
    const isLoading = ref(false);
    const timeout = ref<ReturnType<typeof setTimeout> | undefined>();

    function runAction(): void {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;
      timeout.value = setTimeout(() => {
        isLoading.value = false;
        timeout.value = undefined;
      }, 2000);
    }

    onBeforeUnmount(() => {
      if (timeout.value !== undefined) {
        clearTimeout(timeout.value);
      }
    });

    return {
      isLoading,
      runAction,
    };
  },
  template: `
    <div class="grid gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4">
      <div class="grid gap-1">
        <h3 class="m-0 text-base font-semibold text-[var(--color-text-primary)]">
          Interactive loading action
        </h3>
        <p class="m-0 max-w-2xl text-sm text-[var(--color-text-secondary)]">
          Click the button to emulate a two second action.
        </p>
      </div>
      <IconButton
        :aria-label="isLoading ? 'Creating item' : 'Create item'"
        icon="plus"
        :is-loading="isLoading"
        @click="runAction"
      />
    </div>
  `,
});

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: ['icon', 'variant', 'size', 'isLoading', 'disabled', 'aria-label'],
      sort: 'none',
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => ({
    components: { IconButtonPlaygroundPreview },
    setup() {
      return {
        args: computed(() => normalizeIconButtonArgs(args)),
      };
    },
    template: '<IconButtonPlaygroundPreview v-bind="args" />',
  }),
};

export const Variants: Story = {
  name: 'Variants',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.variants,
      },
    },
  },
  render: () => ({
    components: { IconButton },
    setup() {
      return {
        stateLabels,
        variants: supportedIconButtonVariants,
      };
    },
    template: `
          <div class="flex flex-wrap gap-4">
            <IconButton
              v-for="variant in variants"
              :aria-label="variant + ' create action'"
              icon="plus"
              :key="variant"
              :variant="variant"
            />
          </div>
        `,
  }),
  tags: ['!dev'],
};

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.sizes,
      },
    },
  },
  render: () => ({
    components: { IconButton },
    setup() {
      return {
        sizes: supportedIconButtonSizes,
      };
    },
    template: `
          <div class="flex flex-wrap items-center gap-4">
            <IconButton
              v-for="size in sizes"
              :aria-label="size + ' create action'"
              icon="plus"
              :key="size"
              :size="size"
            />
          </div>
        `,
  }),
  tags: ['!dev'],
};

export const States: Story = {
  name: 'States',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.states,
      },
    },
  },
  render: () => ({
    components: { IconButton },
    setup() {
      return {
        stateLabels,
        variants: supportedIconButtonVariants,
      };
    },
    template: `
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="variant in variants"
              class="grid gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4"
              :key="variant"
            >
              <span class="text-sm font-medium text-[var(--color-text-secondary)]">{{ variant }}</span>
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="state in stateLabels"
                  class="grid justify-items-center gap-2"
                  :key="state"
                >
                  <IconButton
                    :aria-label="state + ' create action'"
                    :class="{
                      'icon-button--force-hover': state === 'Hover',
                      'icon-button--force-focused': state === 'Focused',
                      'icon-button--force-pressed': state === 'Pressed',
                    }"
                    :disabled="state === 'Disabled'"
                    icon="plus"
                    :is-loading="state === 'Loading'"
                    :variant="variant"
                  />
                  <span class="text-xs text-[var(--color-text-secondary)]">{{ state }}</span>
                </div>
              </div>
            </div>
          </div>
        `,
  }),
  tags: ['!dev'],
};

export const Loading: Story = {
  name: 'Loading',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.loading,
      },
    },
  },
  render: () => ({
    components: { InteractiveLoadingExample },
    template: `
          <InteractiveLoadingExample />
        `,
  }),
  tags: ['!dev'],
};
