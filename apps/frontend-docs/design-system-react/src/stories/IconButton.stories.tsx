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
  createIconButtonPlaygroundControls,
  createIconButtonPlaygroundSnippet,
  defaultIconButtonStoryArgs,
  type IconButtonStoryArgs,
  iconButtonStateLabels,
  normalizeIconButtonStoryArgs,
} from '@hoite-dev/frontend-docs-shared/storybook/story-configs';
import {
  iconButtonDocs,
  supportedIconButtonSizes,
  supportedIconButtonVariants,
  supportedIconNames,
} from '@hoite-dev/ui';
import { IconButton } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

const storyArgTypes: Partial<ArgTypes<IconButtonStoryArgs>> = {
  'aria-label': {
    control: 'text',
    description: iconButtonDocs.argTypeDescriptions['aria-label'],
    name: 'aria-label',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  disabled: {
    control: 'boolean',
    description: iconButtonDocs.argTypeDescriptions.disabled,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  icon: {
    control: 'select',
    description: iconButtonDocs.argTypeDescriptions.icon,
    options: supportedIconNames,
    table: {
      category: 'Component API',
    },
  },
  isLoading: {
    control: 'boolean',
    description: iconButtonDocs.argTypeDescriptions.isLoading,
    table: {
      category: 'Component API',
    },
  },
  size: {
    control: 'select',
    description: iconButtonDocs.argTypeDescriptions.size,
    options: supportedIconButtonSizes,
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: iconButtonDocs.argTypeDescriptions.variant,
    options: supportedIconButtonVariants,
    table: {
      category: 'Component API',
    },
  },
};

const meta: Meta<IconButtonStoryArgs> = {
  args: defaultIconButtonStoryArgs,
  argTypes: storyArgTypes,
  component: IconButtonPlaygroundPreview,
  parameters: {
    controls: createIconButtonPlaygroundControls(),
  },
  title: 'Primitives/Action/IconButton',
};

export default meta;

type Story = StoryObj<IconButtonStoryArgs>;

function IconButtonPlaygroundPreview(args: IconButtonStoryArgs): ReactElement {
  const normalizedArgs = normalizeIconButtonStoryArgs(args);
  const snippet = createIconButtonPlaygroundSnippet('react', normalizedArgs);

  return (
    <StoryPlayground>
      <StoryInfoPanel>
        <p className='m-0 text-sm text-[var(--color-text-primary)]'>
          IconButton renders a native <code>button</code> for icon-only actions and requires{' '}
          <code>aria-label</code> or <code>aria-labelledby</code>.
        </p>
      </StoryInfoPanel>
      <StoryPlaygroundContent split>
        <StoryPlaygroundPreview>
          <IconButton
            aria-label={normalizedArgs['aria-label']}
            disabled={normalizedArgs.disabled}
            icon={normalizedArgs.icon}
            isLoading={normalizedArgs.isLoading}
            size={normalizedArgs.size}
            variant={normalizedArgs.variant}
          />
        </StoryPlaygroundPreview>
        <StoryPlaygroundSnippet>
          <StorybookSourceSnippet code={snippet} />
        </StoryPlaygroundSnippet>
      </StoryPlaygroundContent>
    </StoryPlayground>
  );
}

function InteractiveLoadingExample(): ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function runAction(): void {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = undefined;
    }, 2000);
  }

  return (
    <div className='grid gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'>
      <div className='grid gap-1'>
        <h3 className='m-0 text-base font-semibold text-[var(--color-text-primary)]'>
          Interactive loading action
        </h3>
        <p className='m-0 max-w-2xl text-sm text-[var(--color-text-secondary)]'>
          Click the button to emulate a two second action.
        </p>
      </div>
      <IconButton
        aria-label={isLoading ? 'Creating item' : 'Create item'}
        icon='plus'
        isLoading={isLoading}
        onClick={runAction}
      />
    </div>
  );
}

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: createIconButtonPlaygroundControls(),
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => <IconButtonPlaygroundPreview {...normalizeIconButtonStoryArgs(args)} />,
};

export const Variants: Story = {
  name: 'Variants',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.variants,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {supportedIconButtonVariants.map((variant) => (
        <IconButton
          aria-label={`${variant} create action`}
          icon='plus'
          key={variant}
          variant={variant}
        />
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
        story: iconButtonDocs.storyDescriptions.sizes,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      {supportedIconButtonSizes.map((size) => (
        <IconButton aria-label={`${size} create action`} icon='plus' key={size} size={size} />
      ))}
    </div>
  ),
};

export const States: Story = {
  name: 'States',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.states,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      {supportedIconButtonVariants.map((variant) => (
        <div
          className='grid gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'
          key={variant}
        >
          <span className='text-sm font-medium text-[var(--color-text-secondary)]'>{variant}</span>
          <div className='flex flex-wrap gap-3'>
            {iconButtonStateLabels.map((state) => (
              <div className='grid justify-items-center gap-2' key={state}>
                <IconButton
                  aria-label={`${state} create action`}
                  className={
                    state === 'Hover'
                      ? 'frontend-docs-force-hover'
                      : state === 'Focused'
                        ? 'frontend-docs-force-focused'
                        : state === 'Pressed'
                          ? 'frontend-docs-force-pressed'
                          : undefined
                  }
                  disabled={state === 'Disabled'}
                  icon='plus'
                  isLoading={state === 'Loading'}
                  variant={variant}
                />
                <span className='text-xs text-[var(--color-text-secondary)]'>{state}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  name: 'Loading',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: iconButtonDocs.storyDescriptions.loading,
      },
    },
  },
  tags: ['!dev'],
  render: () => <InteractiveLoadingExample />,
};
