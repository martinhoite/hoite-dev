import {
  createFrontendDocsPlaygroundParameters,
  createVueStoryPreview,
  createVueStorySourcePanel,
  withStoryPlayground,
  withVueStoryPlaygroundContent,
} from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type ButtonStoryArgs,
  createButtonPlaygroundControls,
  createButtonPlaygroundSnippet,
  defaultButtonStoryArgs,
  normalizeButtonStoryArgs,
} from '@hoite-dev/frontend-docs-shared/storybook/story-configs';
import {
  type ButtonSize,
  type ButtonVariant,
  buttonDocs,
  type IconName,
  supportedButtonSizes,
  supportedButtonVariants,
  supportedIconNames,
} from '@hoite-dev/ui';
import { Button } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, onBeforeUnmount, ref } from 'vue';
import { createVueSnippetCopyState } from './vueSnippetCopyState';

const storyArgTypes: Partial<ArgTypes<ButtonStoryArgs>> = {
  children: {
    control: 'text',
    description: 'Visible button content.',
    name: 'Text content',
    table: {
      category: 'Component API',
    },
  },
  disabled: {
    control: 'boolean',
    description: buttonDocs.argTypeDescriptions.disabled,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  isLoading: {
    control: 'boolean',
    description: buttonDocs.argTypeDescriptions.isLoading,
    table: {
      category: 'Component API',
    },
  },
  leadingIcon: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.leadingIcon,
    options: supportedIconNames,
    table: {
      category: 'Component API',
    },
  },
  loadingLabel: {
    control: 'text',
    description: buttonDocs.argTypeDescriptions.loadingLabel,
    table: {
      category: 'Component API',
    },
  },
  preventLoadingShrink: {
    control: 'boolean',
    description: buttonDocs.argTypeDescriptions.preventLoadingShrink,
    table: {
      category: 'Component API',
    },
  },
  size: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.size,
    options: supportedButtonSizes,
    table: {
      category: 'Component API',
    },
  },
  trailingIcon: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.trailingIcon,
    options: supportedIconNames,
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.variant,
    options: supportedButtonVariants,
    table: {
      category: 'Component API',
    },
  },
};

const ButtonPlaygroundPreview = defineComponent({
  components: { Button },
  props: {
    children: {
      required: true,
      type: String,
    },
    disabled: {
      required: true,
      type: Boolean,
    },
    isLoading: {
      required: true,
      type: Boolean,
    },
    leadingIcon: {
      type: String as () => IconName | undefined,
    },
    loadingLabel: {
      required: true,
      type: String,
    },
    preventLoadingShrink: {
      required: true,
      type: Boolean,
    },
    size: {
      required: true,
      type: String as () => ButtonSize,
    },
    trailingIcon: {
      type: String as () => IconName | undefined,
    },
    variant: {
      required: true,
      type: String as () => ButtonVariant,
    },
  },
  setup(props) {
    const buttonArgs = computed(() =>
      normalizeButtonStoryArgs({
        children: props.children,
        disabled: props.disabled,
        isLoading: props.isLoading,
        leadingIcon: props.leadingIcon,
        loadingLabel: props.loadingLabel,
        preventLoadingShrink: props.preventLoadingShrink,
        size: props.size,
        trailingIcon: props.trailingIcon,
        variant: props.variant,
      }),
    );
    const snippet = computed(() => createButtonPlaygroundSnippet('vue', buttonArgs.value));
    const { copyButtonLabel, copySnippet, highlightedSnippet } = createVueSnippetCopyState(snippet);

    return {
      buttonArgs,
      copyButtonLabel,
      copySnippet,
      highlightedSnippet,
    };
  },
  template: withStoryPlayground(`
      <div
        class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4"
      >
        <p class="m-0 text-sm text-[var(--color-text-primary)]">
          Button renders a native <code>button</code>, defaults to
          <code>type=&quot;button&quot;</code>, and keeps loading state disabled with
          <code>aria-busy</code>.
        </p>
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(`
          <Button v-bind="buttonArgs">{{ children }}</Button>
        `)}
        ${createVueStorySourcePanel()}
      `)}
  `),
});

const InteractiveLoadingExample = defineComponent({
  components: { Button },
  setup() {
    const loadingAction = ref<'create' | 'save' | undefined>(undefined);
    const timeoutId = ref<ReturnType<typeof setTimeout> | undefined>(undefined);

    onBeforeUnmount(() => {
      if (timeoutId.value !== undefined) {
        clearTimeout(timeoutId.value);
      }
    });

    const runAction = (action: 'create' | 'save') => {
      if (loadingAction.value !== undefined) {
        return;
      }

      loadingAction.value = action;
      timeoutId.value = setTimeout(() => {
        loadingAction.value = undefined;
        timeoutId.value = undefined;
      }, 2000);
    };

    return {
      loadingAction,
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
      <div class="flex flex-wrap gap-4">
        <Button
          :isLoading="loadingAction === 'save'"
          loadingLabel="Saving"
          preventLoadingShrink
          @click="runAction('save')"
        >
          Save
        </Button>
        <Button
          :isLoading="loadingAction === 'create'"
          leadingIcon="plus"
          loadingLabel="Creating"
          preventLoadingShrink
          trailingIcon="arrow"
          @click="runAction('create')"
        >
          Create and continue
        </Button>
      </div>
    </div>
  `,
});

const meta: Meta<ButtonStoryArgs> = {
  args: defaultButtonStoryArgs,
  argTypes: storyArgTypes,
  component: ButtonPlaygroundPreview,
  parameters: {
    controls: createButtonPlaygroundControls(),
  },
  title: 'Primitives/Action/Button',
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: createButtonPlaygroundControls(),
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => ({
    components: { ButtonPlaygroundPreview },
    setup() {
      return {
        args: computed(() => normalizeButtonStoryArgs(args)),
      };
    },
    template: '<ButtonPlaygroundPreview v-bind="args" />',
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
        story: buttonDocs.storyDescriptions.variants,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    setup() {
      return {
        variants: supportedButtonVariants,
      };
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <Button v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant === 'primary' ? 'Primary action' : 'Secondary action' }}
        </Button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.sizes,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    setup() {
      return {
        sizes: supportedButtonSizes,
      };
    },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button v-for="size in sizes" :key="size" :size="size">
          {{ size }} button
        </Button>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.states,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    setup() {
      return {
        variants: supportedButtonVariants,
      };
    },
    template: `
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="variant in variants"
          :key="variant"
          class="grid gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4"
        >
          <span class="text-sm font-medium text-[var(--color-text-secondary)]">{{ variant }}</span>
          <div class="flex flex-wrap gap-3">
            <Button :variant="variant">Default</Button>
            <Button class="frontend-docs-force-hover" :variant="variant">Hover</Button>
            <Button class="frontend-docs-force-focused" :variant="variant">Focused</Button>
            <Button class="frontend-docs-force-pressed" :variant="variant">Pressed</Button>
            <Button disabled :variant="variant">Disabled</Button>
            <Button isLoading :variant="variant">Loading</Button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const IconPatterns: Story = {
  name: 'Icon patterns',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.iconPatterns,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-4">
        <Button leadingIcon="plus">Create</Button>
        <Button trailingIcon="arrow">Continue</Button>
        <Button leadingIcon="plus" trailingIcon="arrow">Create and continue</Button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  name: 'Loading',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.loading,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Button, InteractiveLoadingExample },
    template: `
      <div class="grid gap-6">
        <div class="flex flex-wrap gap-4">
          <Button isLoading>Save</Button>
          <Button isLoading loadingLabel="Saving">Save</Button>
          <Button isLoading leadingIcon="plus">Create</Button>
          <Button isLoading trailingIcon="arrow">Continue</Button>
          <Button isLoading leadingIcon="plus" trailingIcon="arrow">Create and continue</Button>
        </div>
        <InteractiveLoadingExample />
      </div>
    `,
  }),
};
