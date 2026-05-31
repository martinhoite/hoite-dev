import {
  createFrontendDocsPlaygroundParameters,
  createVueStoryPreview,
  createVueStorySourcePanel,
  withStoryPlayground,
  withVueStoryPlaygroundContent,
} from '@hoite-dev/frontend-docs-shared/storybook';
import {
  createIconPlaygroundControls,
  createIconPlaygroundSnippet,
  defaultIconStoryArgs,
  getIconPlaygroundSurfaceClass,
  getIconShowcaseSurfaceClass,
  type IconStoryArgs,
  normalizeIconStoryArgs,
} from '@hoite-dev/frontend-docs-shared/storybook/story-configs';
import {
  iconDocs,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from '@hoite-dev/ui';
import { CodeBlock, Icon } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent } from 'vue';

const storyArgTypes: Partial<ArgTypes<IconStoryArgs>> = {
  name: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.name,
    options: supportedIconNames,
    table: {
      category: 'Component API',
    },
    type: {
      name: 'string',
    },
  },
  size: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.size,
    options: supportedIconSizes,
    table: {
      category: 'Component API',
    },
    type: {
      name: 'string',
    },
  },
  rotation: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.rotation,
    options: supportedIconRotations,
    table: {
      category: 'Component API',
    },
    type: {
      name: 'string',
    },
  },
  variant: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.variant,
    options: supportedIconVariants,
    table: {
      category: 'Component API',
    },
    type: {
      name: 'string',
    },
  },
};

const IconPlaygroundPreview = defineComponent({
  components: { CodeBlock, Icon },
  props: {
    name: {
      required: true,
      type: String as () => IconStoryArgs['name'],
    },
    rotation: {
      required: true,
      type: String as () => IconStoryArgs['rotation'],
    },
    size: {
      required: true,
      type: String as () => IconStoryArgs['size'],
    },
    variant: {
      required: true,
      type: String as () => IconStoryArgs['variant'],
    },
  },
  setup(props) {
    const iconArgs = computed(() =>
      normalizeIconStoryArgs({
        name: props.name,
        rotation: props.rotation,
        size: props.size,
        variant: props.variant,
      }),
    );
    const surfaceClass = computed(() => getIconPlaygroundSurfaceClass(iconArgs.value.variant));
    const snippet = computed(() => createIconPlaygroundSnippet('vue', iconArgs.value));

    return {
      iconArgs,
      snippet,
      surfaceClass,
    };
  },
  template: withStoryPlayground(`
      <div
        class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4"
      >
        <p class="m-0 text-sm text-[var(--color-text-primary)]">
          Meaningful icons need <code>label</code> or <code>aria-label</code>. Supported
          passthroughs: <code>id</code>, <code>title</code>, <code>role</code>,
          <code>aria-label</code>, and deliberate <code>data-*</code> attributes.
        </p>
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(`
          <div :class="surfaceClass">
            <Icon v-bind="iconArgs" label="Playground icon" />
          </div>
        `)}
        ${createVueStorySourcePanel('snippet', "'html'", "'Vue'")}
      `)}
  `),
});

const meta: Meta<IconStoryArgs> = {
  args: defaultIconStoryArgs,
  argTypes: storyArgTypes,
  component: IconPlaygroundPreview,
  parameters: {
    controls: createIconPlaygroundControls(),
  },
  title: 'Primitives/Static/Icon',
};

export default meta;

type Story = StoryObj<IconStoryArgs>;

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: createIconPlaygroundControls(),
    docs: {
      description: {
        story: iconDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => ({
    components: { IconPlaygroundPreview },
    setup() {
      return {
        args: computed(() => normalizeIconStoryArgs(args)),
      };
    },
    template: '<IconPlaygroundPreview v-bind="args" />',
  }),
};

export const AllIcons: Story = {
  name: 'All icons',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconDocs.storyDescriptions.allIcons,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      return {
        iconNames: supportedIconNames,
      };
    },
    template: `
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="iconName in iconNames"
          :key="iconName"
          class="grid justify-items-center gap-3 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4"
        >
          <Icon :label="\`\${iconName} icon\`" :name="iconName" />
          <code>{{ iconName }}</code>
        </div>
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
        story: iconDocs.storyDescriptions.sizes,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      return {
        iconSizes: supportedIconSizes,
      };
    },
    template: `
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div
          v-for="size in iconSizes"
          :key="size"
          class="grid justify-items-center gap-3 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4"
        >
          <Icon :label="\`\${size} plus icon\`" name="plus" :size="size" />
          <code>{{ size }}</code>
        </div>
      </div>
    `,
  }),
};

export const Rotations: Story = {
  name: 'Rotations',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconDocs.storyDescriptions.rotations,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      return {
        iconRotations: supportedIconRotations,
      };
    },
    template: `
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="rotation in iconRotations"
          :key="rotation"
          class="grid justify-items-center gap-3 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4"
        >
          <Icon :label="\`\${rotation} degree chevron icon\`" name="chevron" :rotation="rotation" />
          <code>{{ rotation }}</code>
        </div>
      </div>
    `,
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
        story: iconDocs.storyDescriptions.variants,
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      const variants = supportedIconVariants.map((variant) => ({
        surfaceClass: getIconShowcaseSurfaceClass(variant),
        variant,
      }));

      return {
        variants,
      };
    },
    template: `
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="item in variants" :key="item.variant" :class="item.surfaceClass">
          <div class="grid justify-items-center gap-3 text-center">
            <Icon :label="\`\${item.variant} plus icon\`" name="plus" :variant="item.variant" />
            <span class="text-sm text-inherit">{{ item.variant }}</span>
          </div>
        </div>
      </div>
    `,
  }),
};
