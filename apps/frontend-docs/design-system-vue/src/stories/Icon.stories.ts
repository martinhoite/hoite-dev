import {
  type IconName,
  type IconRotation,
  type IconSize,
  type IconVariant,
  iconDocs,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from '@hoite-dev/ui';
import { Icon } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent } from 'vue';

type IconStoryArgs = {
  name: IconName;
  rotation: IconRotation;
  size: IconSize;
  variant: IconVariant;
};

const storyArgTypes: Partial<ArgTypes<IconStoryArgs>> = {
  name: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.name,
    options: supportedIconNames,
    table: {
      category: 'Component API',
    },
  },
  size: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.size,
    options: supportedIconSizes,
    table: {
      category: 'Component API',
    },
  },
  rotation: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.rotation,
    options: supportedIconRotations,
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: iconDocs.argTypeDescriptions.variant,
    options: supportedIconVariants,
    table: {
      category: 'Component API',
    },
  },
};

function getSurfaceClass(variant: IconVariant | undefined): string {
  if (variant === 'on-fill') {
    return 'inline-flex w-fit items-center rounded-xl bg-[var(--color-bg-brand)] p-4';
  }

  return 'inline-flex w-fit items-center rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4';
}

function getShowcaseSurfaceClass(variant: IconVariant): string {
  if (variant === 'on-fill') {
    return 'grid min-h-28 place-items-center rounded-xl bg-[var(--color-bg-brand)] p-4 text-[var(--color-text-on-fill)]';
  }

  return 'grid min-h-28 place-items-center rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4 text-[var(--color-text-primary)]';
}

const IconPlaygroundPreview = defineComponent({
  components: { Icon },
  props: {
    name: {
      required: true,
      type: String as () => IconName,
    },
    rotation: {
      required: true,
      type: String as () => IconRotation,
    },
    size: {
      required: true,
      type: String as () => IconSize,
    },
    variant: {
      required: true,
      type: String as () => IconVariant,
    },
  },
  setup(props) {
    const iconArgs = computed(() => ({
      name: props.name,
      rotation: props.rotation,
      size: props.size,
      variant: props.variant,
    }));
    const surfaceClass = computed(() => getSurfaceClass(props.variant));

    return {
      iconArgs,
      surfaceClass,
    };
  },
  template: `
    <div class="grid gap-4">
      <div
        class="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4"
      >
        <p class="m-0 text-sm text-[var(--color-text-primary)]">
          Use <code>name</code>, <code>size</code>, <code>rotation</code>, and
          <code>variant</code> as the main visual Icon API.
        </p>
        <p class="mb-0 mt-3 text-sm text-[var(--color-text-secondary)]">
          In app code, meaningful icons should also receive an accessible name with
          <code>label</code> or <code>aria-label</code>.
        </p>
        <p class="mb-0 mt-3 text-sm text-[var(--color-text-secondary)]">
          Supported passthrough attributes stay narrow: <code>id</code>, <code>title</code>,
          <code>role</code>, <code>aria-label</code>, and deliberate <code>data-*</code>
          attributes on the rendered SVG.
        </p>
      </div>
      <div :class="surfaceClass">
        <Icon v-bind="iconArgs" label="Playground icon" />
      </div>
    </div>
  `,
});

const meta: Meta<IconStoryArgs> = {
  args: {
    name: 'chevron',
    rotation: '0',
    size: 'md',
    variant: 'primary',
  },
  argTypes: storyArgTypes,
  component: IconPlaygroundPreview,
  parameters: {
    controls: {
      include: ['name', 'size', 'rotation', 'variant'],
      sort: 'none',
    },
  },
  title: 'Primitives/Static/Icon',
};

export default meta;

type Story = StoryObj<IconStoryArgs>;

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      include: ['name', 'size', 'rotation', 'variant'],
      sort: 'none',
    },
    docs: {
      description: {
        story: iconDocs.storyDescriptions.playground,
      },
    },
  },
  render: (args) => ({
    components: { IconPlaygroundPreview },
    setup() {
      return {
        args,
      };
    },
    template: `<IconPlaygroundPreview v-bind="args" />`,
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
        surfaceClass: getShowcaseSurfaceClass(variant),
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
