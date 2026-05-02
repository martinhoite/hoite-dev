import {
  type IconName,
  type IconRotation,
  type IconSize,
  type IconVariant,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from '@hoite-dev/ui';
import { Icon } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent } from 'vue';
import { createSourceSection } from '../../../hub/src/utils/sourceLinks';

type IconStoryArgs = {
  name: IconName;
  rotation: IconRotation;
  size: IconSize;
  variant: IconVariant;
};

const iconNames = [...supportedIconNames] as IconName[];
const iconRotations = [...supportedIconRotations] as IconRotation[];
const iconSizes = [...supportedIconSizes] as IconSize[];
const iconVariants = [...supportedIconVariants] as IconVariant[];

const storyArgTypes: Partial<ArgTypes<IconStoryArgs>> = {
  name: {
    control: 'select',
    description: 'Selects which shared icon definition the component renders.',
    options: iconNames,
    table: {
      category: 'Component API',
    },
  },
  size: {
    control: 'select',
    description: 'Controls the token-backed icon dimensions.',
    options: iconSizes,
    table: {
      category: 'Component API',
    },
  },
  rotation: {
    control: 'select',
    description:
      'Rotates the rendered icon in fixed increments without changing the underlying asset.',
    options: iconRotations,
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: 'Controls which semantic icon color token is applied.',
    options: iconVariants,
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
    docs: {
      description: {
        component: [
          'Icon defines the shared static SVG contract across the design system.',
          '',
          'This overview focuses on supported names, token-backed sizes, visual variants, and the accessibility rules that Vue and React implementations follow.',
          '',
          createSourceSection([
            {
              label: 'Shared styling contract',
              path: 'packages/ui/src/components/primitives/static/icon/icon.ts',
            },
            {
              label: 'Vue implementation',
              path: 'packages/ui-vue/src/components/primitives/static/Icon/Icon.vue',
            },
            {
              label: 'Vue stories',
              path: 'apps/frontend-docs/design-system-vue/src/stories/Icon.stories.ts',
            },
          ]),
        ].join('\n'),
      },
    },
  },
  title: 'Primitives/Static/Icon',
};

export default meta;

type Story = StoryObj<IconStoryArgs>;

export const Playground: Story = {
  parameters: {
    controls: {
      include: ['name', 'size', 'rotation', 'variant'],
      sort: 'none',
    },
    docs: {
      description: {
        story: [
          'Use `name`, `size`, `rotation`, and `variant` as the main visual Icon API in this playground.',
          '',
          'For app code, meaningful icons should also receive an accessible name with `label` or `aria-label`.',
          '',
          'The rendered SVG also supports deliberate passthrough attributes when needed:',
          '',
          '- `id`',
          '- `title`',
          '- `role`',
          '- `aria-label`',
          '- `data-*` attributes',
        ].join('\n'),
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Supported icon names rendered with their default size and default visual treatment in the Vue implementation.',
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      return {
        iconNames,
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Token-backed icon size scale shown with the same icon name to isolate dimensional differences.',
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      return {
        iconSizes,
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed-angle rotation options shown with the chevron icon so directional changes stay legible.',
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      return {
        iconRotations,
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Semantic icon color variants shown against the surface treatment each variant expects.',
      },
    },
  },
  tags: ['!dev'],
  render: () => ({
    components: { Icon },
    setup() {
      const variants = iconVariants.map((variant) => ({
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
