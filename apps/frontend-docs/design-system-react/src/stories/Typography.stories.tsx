import {
  supportedTypographyTags,
  supportedTypographyVariants,
  type TypographyVariant,
} from '@hoite-dev/ui';
import { Typography, type TypographyProps } from '@hoite-dev/ui-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSourceSection } from '../../../hub/src/utils/sourceLinks';

const tagKeys = [...supportedTypographyTags];
const variantKeys = Object.keys(supportedTypographyVariants) as TypographyVariant[];

const meta = {
  args: {
    'aria-label': 'Typography sample label',
    children: 'Typography sample',
    'data-testid': 'typography-sample',
    id: 'typography-sample',
    role: 'note',
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
    children: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: variantKeys,
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
            label: 'React implementation',
            path: 'packages/ui-react/src/components/Typography.tsx',
          },
          {
            label: 'React stories',
            path: 'apps/frontend-docs/design-system-react/src/stories/Typography.stories.tsx',
          },
        ]),
      },
    },
  },
  tags: ['autodocs'],
  title: 'Typography',
} satisfies Meta<TypographyProps>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderTypographyStory(args: TypographyProps) {
  return (
    <Typography
      aria-label={args['aria-label']}
      data-testid={args['data-testid']}
      id={args.id}
      role={args.role}
      tag={args.tag}
      title={args.title}
      variant={args.variant}
    >
      {args.children}
    </Typography>
  );
}

export const Playground: Story = {
  render: renderTypographyStory,
};

export const Variants: Story = {
  args: {
    children: 'Typography sample',
    variant: 'heading-large',
  },
  render: () => {
    const variants = variantKeys.map((variant) => ({
      defaultTag: supportedTypographyVariants[variant].defaultTag,
      variant,
    }));

    return (
      <div className='grid gap-4 md:grid-cols-2'>
        {variants.map((item) => (
          <div
            className='grid gap-1 rounded-xl border border-[var(--color-border-muted)] p-4'
            key={item.variant}
          >
            <span className='text-sm text-[var(--color-text-secondary)]'>
              {item.variant} -&gt; {item.defaultTag}
            </span>
            <Typography variant={item.variant}>{item.variant}</Typography>
          </div>
        ))}
      </div>
    );
  },
};

export const TagOverride: Story = {
  args: {
    'aria-label': 'Body medium rendered as span',
    children: 'Body medium rendered as span',
    'data-testid': 'typography-span',
    id: 'typography-span',
    tag: 'span',
    title: 'Body medium rendered as span',
    variant: 'body-medium',
  },
  render: renderTypographyStory,
};
