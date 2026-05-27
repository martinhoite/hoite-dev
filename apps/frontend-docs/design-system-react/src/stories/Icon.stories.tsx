import {
  createFrontendDocsPlaygroundParameters,
  StoryInfoPanel,
  StoryPlayground,
  StoryPlaygroundContent,
  StoryPlaygroundPreview,
  StoryPlaygroundSnippet,
} from '@hoite-dev/frontend-docs-shared/storybook';
import { StorybookSourceSnippet } from '@hoite-dev/frontend-docs-shared/storybook/source-snippet';
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
import { Icon } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';

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

function IconPlaygroundPreview(iconArgs: IconStoryArgs): ReactElement {
  const normalizedArgs = normalizeIconStoryArgs(iconArgs);
  const snippet = createIconPlaygroundSnippet('react', normalizedArgs);

  return (
    <StoryPlayground>
      <StoryInfoPanel>
        <p className='m-0 text-sm text-[var(--color-text-primary)]'>
          Meaningful icons need <code>label</code> or <code>aria-label</code>. Supported
          passthroughs: <code>id</code>, <code>title</code>, <code>role</code>,{' '}
          <code>aria-label</code>, and deliberate <code>data-*</code> attributes.
        </p>
      </StoryInfoPanel>
      <StoryPlaygroundContent split>
        <StoryPlaygroundPreview>
          <div className={getIconPlaygroundSurfaceClass(normalizedArgs.variant)}>
            <Icon {...normalizedArgs} label='Playground icon' />
          </div>
        </StoryPlaygroundPreview>
        <StoryPlaygroundSnippet>
          <StorybookSourceSnippet code={snippet} />
        </StoryPlaygroundSnippet>
      </StoryPlaygroundContent>
    </StoryPlayground>
  );
}

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
  render: (args) => <IconPlaygroundPreview {...normalizeIconStoryArgs(args)} />,
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
        <div className={getIconShowcaseSurfaceClass(variant)} key={variant}>
          <div className='grid justify-items-center gap-3 text-center'>
            <Icon label={`${variant} plus icon`} name='plus' variant={variant} />
            <span className='text-sm text-inherit'>{variant}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
