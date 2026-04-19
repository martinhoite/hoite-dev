import { supportedTypographyVariants, type TypographyVariant } from '@hoite-dev/ui';
import { Typography } from '@hoite-dev/ui-vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const variantKeys = Object.keys(supportedTypographyVariants) as TypographyVariant[];

type TypographyStoryArgs = {
  as?: keyof HTMLElementTagNameMap;
  text: string;
  variant: TypographyVariant;
};

const meta: Meta<TypographyStoryArgs> = {
  args: {
    text: 'Typography sample',
    variant: 'heading-large',
  },
  argTypes: {
    as: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: variantKeys,
    },
    text: {
      control: 'text',
    },
  },
  tags: ['autodocs'],
  title: 'Components/Typography',
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
        :as="args.as"
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

export const AllCombinations: Story = {
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
      <div style="display:grid; gap:1rem;">
        <div
          v-for="item in variants"
          :key="item.variant"
          style="display:grid; gap:0.25rem;"
        >
          <span style="color:var(--color-text-secondary); font-family:var(--typography-family-body); font-size:var(--typography-size-14);">
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

export const AsOverride: Story = {
  args: {
    as: 'div',
    text: 'Body medium rendered as div',
    variant: 'body-medium',
  },
  render: renderTypographyStory,
};
