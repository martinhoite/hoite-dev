import {
  supportedTypographyTags,
  supportedTypographyVariants,
  type TypographyTag,
  type TypographyVariant,
} from '@hoite-dev/ui';
import { Typography } from '@hoite-dev/ui-vue';
import { Canvas, Description, ArgTypes as DocsArgTypes, Title } from '@storybook/addon-docs/blocks';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { createElement, Fragment, type ReactElement } from 'react';
import { computed } from 'vue';
import { createSourceSection } from '../../../hub/src/utils/sourceLinks';

const defaultTagOption = 'Default variant tag';
const variantKeys = Object.keys(supportedTypographyVariants) as TypographyVariant[];

type TypographyStoryArgs = {
  children: string;
  tag: TypographyTag | typeof defaultTagOption;
  variant: TypographyVariant;
};

const storyArgTypes: Partial<ArgTypes<TypographyStoryArgs>> = {
  children: {
    control: 'text',
    description:
      'The written content shown by the Typography component. Developers may pass richer content when needed, but it is rendered inside the selected Typography tag.',
    name: 'Text content',
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description:
      'Controls the visual text style, such as heading, body text, label text, or caption text.',
    options: variantKeys,
    table: {
      category: 'Component API',
    },
  },
  tag: {
    control: 'select',
    description:
      'Controls the HTML tag used for the rendered text. Leave this set to the default option to use the selected variant tag mapping.',
    options: [defaultTagOption, ...supportedTypographyTags],
    table: {
      category: 'Component API',
    },
  },
};

const meta: Meta<TypographyStoryArgs> = {
  args: {
    children: 'Typography sample',
    tag: defaultTagOption,
    variant: 'heading-large',
  },
  argTypes: storyArgTypes,
  parameters: {
    controls: {
      include: ['children', 'variant', 'tag'],
      sort: 'none',
    },
    docs: {
      description: {
        component: [
          'Typography defines the shared text-style contract across the design system.',
          '',
          'This overview focuses on the supported variants, their default tag mappings, and the shared contract that framework implementations follow.',
          '',
          createSourceSection([
            {
              label: 'Shared styling contract',
              path: 'packages/ui/src/components/primitives/static/typography/typography.ts',
            },
            {
              label: 'Vue implementation',
              path: 'packages/ui-vue/src/components/primitives/static/Typography/Typography.vue',
            },
            {
              label: 'Vue stories',
              path: 'apps/frontend-docs/design-system-vue/src/stories/Typography.stories.ts',
            },
          ]),
        ].join('\n'),
      },
      page: TypographyDocsPage,
    },
  },
  tags: ['autodocs'],
  title: 'Primitives/Static/Typography',
};

export default meta;

type Story = StoryObj<TypographyStoryArgs>;

export const Playground: Story = {
  args: {
    children: 'Typography sample',
    tag: defaultTagOption,
    variant: 'heading-large',
  },
  parameters: {
    controls: {
      include: ['children', 'variant', 'tag'],
      sort: 'none',
    },
    docs: {
      description: {
        story: [
          'Typography exposes `variant`, `tag`, and `children` as its primary component API.',
          '',
          'The rendered HTML element also supports deliberate passthrough attributes when needed:',
          '',
          '- `id`',
          '- `title`',
          '- `aria-label`',
          '- `data-*` attributes',
        ].join('\n'),
      },
    },
  },
  tags: ['!autodocs'],
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
  args: {
    children: 'Typography sample',
    tag: defaultTagOption,
    variant: 'heading-large',
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
  tags: ['autodocs', '!dev'],
  render: (args) => ({
    components: { Typography },
    setup() {
      const variants = variantKeys.map((variant) => ({
        defaultTag: supportedTypographyVariants[variant].defaultTag,
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

function TypographyDocsPage(): ReactElement {
  return createElement(Fragment, null, [
    createElement(Title, {
      key: 'title',
    }),
    createElement(Description, {
      key: 'description',
    }),
    createElement(Canvas, {
      key: 'variants',
      of: Variants,
    }),
    createElement(DocsArgTypes, {
      key: 'arg-types',
      of: Playground,
    }),
  ]);
}
