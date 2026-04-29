import {
  supportedTypographyTags,
  supportedTypographyVariants,
  type TypographyTag,
  type TypographyVariant,
} from '@hoite-dev/ui';
import { Typography } from '@hoite-dev/ui-vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { createSourceSection } from '../../../hub/src/utils/sourceLinks';

const tagKeys = [...supportedTypographyTags];
const variantKeys = Object.keys(supportedTypographyVariants) as TypographyVariant[];

type TypographyStoryArgs = {
  'aria-label'?: string;
  'data-testid'?: string;
  id?: string;
  role?: string;
  tag?: TypographyTag;
  text: string;
  title?: string;
  variant: TypographyVariant;
};

const meta: Meta<TypographyStoryArgs> = {
  args: {
    'aria-label': 'Typography sample label',
    'data-testid': 'typography-sample',
    id: 'typography-sample',
    role: 'note',
    text: 'Typography sample',
    title: 'Typography sample title',
    variant: 'heading-large',
  },
  argTypes: {
    'aria-label': {
      control: 'text',
    },
    'data-testid': {
      control: 'text',
    },
    id: {
      control: 'text',
    },
    role: {
      control: 'text',
    },
    tag: {
      control: 'select',
      options: tagKeys,
    },
    variant: {
      control: 'select',
      options: variantKeys,
    },
    text: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
  },
  component: Typography,
  parameters: {
    docs: {
      description: {
        component: createSourceSection([
          {
            label: 'Shared recipe / contract',
            path: 'packages/ui/src/components/typography/typography.ts',
          },
          {
            label: 'Vue implementation',
            path: 'packages/ui-vue/src/components/Typography.vue',
          },
          {
            label: 'Vue stories',
            path: 'apps/frontend-docs/design-system-vue/src/stories/Typography.stories.ts',
          },
        ]),
      },
    },
  },
  tags: ['autodocs'],
  title: 'Typography',
};

export default meta;

type Story = StoryObj<TypographyStoryArgs>;

function renderTypographyStory(args: TypographyStoryArgs) {
  return {
    components: { Typography },
    setup() {
      return {
        args,
      };
    },
    template: `
      <Typography
        :aria-label="args['aria-label']"
        :data-testid="args['data-testid']"
        :id="args.id"
        :role="args.role"
        :tag="args.tag"
        :title="args.title"
        :variant="args.variant"
      >
        {{ args.text }}
      </Typography>
    `,
  };
}

export const Playground: Story = {
  render: renderTypographyStory,
};

export const Variants: Story = {
  args: {
    text: 'Typography sample',
    variant: 'heading-large',
  },
  render: () => ({
    components: { Typography },
    setup() {
      const variants = variantKeys.map((variant) => ({
        defaultTag: supportedTypographyVariants[variant].defaultTag,
        variant,
      }));

      return {
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
            {{ item.variant }}
          </Typography>
        </div>
      </div>
    `,
  }),
};

export const TagOverride: Story = {
  args: {
    'aria-label': 'Body medium rendered as span',
    'data-testid': 'typography-span',
    id: 'typography-span',
    tag: 'span',
    text: 'Body medium rendered as span',
    title: 'Body medium rendered as span',
    variant: 'body-medium',
  },
  render: renderTypographyStory,
};
