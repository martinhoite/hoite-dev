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
import { Icon } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';

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

function IconPlaygroundPreview(iconArgs: IconStoryArgs): ReactElement {
  return (
    <div className='grid gap-4'>
      <div className='rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4'>
        <p className='m-0 text-sm text-[var(--color-text-primary)]'>
          Use <code>name</code>, <code>size</code>, <code>rotation</code>, and <code>variant</code>{' '}
          as the main visual Icon API.
        </p>
        <p className='mb-0 mt-3 text-sm text-[var(--color-text-secondary)]'>
          In app code, meaningful icons should also receive an accessible name with{' '}
          <code>label</code> or <code>aria-label</code>.
        </p>
        <p className='mb-0 mt-3 text-sm text-[var(--color-text-secondary)]'>
          Supported passthrough attributes stay narrow: <code>id</code>, <code>title</code>,{' '}
          <code>role</code>, <code>aria-label</code>, and deliberate <code>data-*</code> attributes
          on the rendered SVG.
        </p>
      </div>
      <div className={getSurfaceClass(iconArgs.variant)}>
        <Icon {...iconArgs} label='Playground icon' />
      </div>
    </div>
  );
}

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
  render: (args) => <IconPlaygroundPreview {...args} />,
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
  render: () => (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {supportedIconNames.map((iconName) => (
        <div
          className='grid justify-items-center gap-3 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'
          key={iconName}
        >
          <Icon label={`${iconName} icon`} name={iconName} />
          <code>{iconName}</code>
        </div>
      ))}
    </div>
  ),
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
  render: () => (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {supportedIconSizes.map((size) => (
        <div
          className='grid justify-items-center gap-3 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'
          key={size}
        >
          <Icon label={`${size} plus icon`} name='plus' size={size} />
          <code>{size}</code>
        </div>
      ))}
    </div>
  ),
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
  render: () => (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {supportedIconRotations.map((rotation) => (
        <div
          className='grid justify-items-center gap-3 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'
          key={rotation}
        >
          <Icon label={`${rotation} degree chevron icon`} name='chevron' rotation={rotation} />
          <code>{rotation}</code>
        </div>
      ))}
    </div>
  ),
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
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      {supportedIconVariants.map((variant) => (
        <div className={getShowcaseSurfaceClass(variant)} key={variant}>
          <div className='grid justify-items-center gap-3 text-center'>
            <Icon label={`${variant} plus icon`} name='plus' variant={variant} />
            <span className='text-sm text-inherit'>{variant}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
