import {
  supportedTypographyTags,
  type TypographyTag,
  type TypographyVariant,
  typographyDocs,
  typographyVariantConfig,
} from '@hoite-dev/ui';
import { Typography } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed } from 'vue';

const defaultTagOption = 'Default variant tag';
const variantKeys = Object.keys(typographyVariantConfig) as TypographyVariant[];

type TypographyStoryArgs = {
  children: string;
  tag: TypographyTag | typeof defaultTagOption;
  variant: TypographyVariant;
};

const defaultTypographyArgs: TypographyStoryArgs = {
  children: 'Typography sample',
  tag: defaultTagOption,
  variant: 'heading-large',
};

const storyArgTypes: Partial<ArgTypes<TypographyStoryArgs>> = {
  children: {
    control: 'text',
    description: typographyDocs.argTypeDescriptions.children,
    name: 'Text content',
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: typographyDocs.argTypeDescriptions.variant,
    options: variantKeys,
    table: {
      category: 'Component API',
    },
  },
  tag: {
    control: 'select',
    description: typographyDocs.argTypeDescriptions.tag,
    options: [defaultTagOption, ...supportedTypographyTags],
    table: {
      category: 'Component API',
    },
  },
};

const meta: Meta<TypographyStoryArgs> = {
  args: defaultTypographyArgs,
  argTypes: storyArgTypes,
  parameters: {
    controls: {
      include: ['children', 'variant', 'tag'],
      sort: 'none',
    },
  },
  title: 'Primitives/Static/Typography',
};

export default meta;

type Story = StoryObj<TypographyStoryArgs>;

export const Playground: Story = {
  args: defaultTypographyArgs,
  name: 'Playground',
  parameters: {
    controls: {
      include: ['children', 'variant', 'tag'],
      sort: 'none',
    },
    docs: {
      description: {
        story: typographyDocs.storyDescriptions.playground,
      },
    },
  },
  render: (args) => ({
    components: { Typography },
    setup() {
      return {
        args,
        normalizedTag: computed(() => normalizeTag(args.tag)),
      };
    },
    template: `
      <div class="grid gap-4">
        <div
          class="rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4"
        >
          <p class="m-0 text-sm text-[var(--color-text-primary)]">
            Use <code>variant</code>, <code>tag</code>, and text content as the main Typography API.
            Leave <code>tag</code> on the default option to use the selected variant's standard HTML
            element.
          </p>
          <p class="mb-0 mt-3 text-sm text-[var(--color-text-secondary)]">
            Supported passthrough attributes include <code>id</code>, <code>title</code>,
            <code>aria-label</code>, and deliberate <code>data-*</code> attributes on the rendered
            HTML element.
          </p>
        </div>
        <Typography :tag="normalizedTag" :variant="args.variant">
          {{ args.children }}
        </Typography>
      </div>
    `,
  }),
};

export const Variants: Story = {
  args: defaultTypographyArgs,
  name: 'Variants',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: typographyDocs.storyDescriptions.variants,
      },
    },
  },
  tags: ['!dev'],
  render: (args) => ({
    components: { Typography },
    setup() {
      const variants = variantKeys.map((variant) => ({
        defaultTag: typographyVariantConfig[variant].defaultTag,
        variant,
      }));

      return {
        args,
        variants,
      };
    },
    template: `
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="item in variants"
          :key="item.variant"
          class="grid gap-1 rounded-xl border border-[var(--color-border-muted)] p-4"
        >
          <span class="text-sm text-[var(--color-text-secondary)]">
            {{ item.variant }} -> {{ item.defaultTag }}
          </span>
          <Typography :variant="item.variant">
            {{ args.children }}
          </Typography>
        </div>
      </div>
    `,
  }),
};

function normalizeTag(tag: TypographyStoryArgs['tag']): TypographyTag | undefined {
  if (tag === defaultTagOption) {
    return undefined;
  }

  return tag;
}
