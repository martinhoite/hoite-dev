import {
  createFrontendDocsComponentSnippet,
  createFrontendDocsPlaygroundParameters,
  StoryInfoPanel,
  StoryPlayground,
  StoryPlaygroundContent,
  StoryPlaygroundPreview,
  StoryPlaygroundSnippet,
} from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type ButtonSize,
  type ButtonVariant,
  buttonDocs,
  type IconName,
  supportedButtonSizes,
  supportedButtonVariants,
  supportedIconNames,
} from '@hoite-dev/ui';
import { Button } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import { StorybookSourceSnippet } from './StorybookSourceSnippet';

const noIconOption = 'None';

type ButtonIconOption = IconName | typeof noIconOption;

type ButtonStoryArgs = {
  children: string;
  disabled: boolean;
  isLoading: boolean;
  leadingIcon: ButtonIconOption;
  loadingLabel: string;
  preventLoadingShrink: boolean;
  size: ButtonSize;
  trailingIcon: ButtonIconOption;
  variant: ButtonVariant;
};

const defaultButtonArgs: ButtonStoryArgs = {
  children: 'Primary action',
  disabled: false,
  isLoading: false,
  leadingIcon: noIconOption,
  loadingLabel: '',
  preventLoadingShrink: false,
  size: 'medium',
  trailingIcon: noIconOption,
  variant: 'primary',
};

const iconOptions = [noIconOption, ...supportedIconNames] as const;

const storyArgTypes: Partial<ArgTypes<ButtonStoryArgs>> = {
  children: {
    control: 'text',
    description: 'Visible button content.',
    name: 'Text content',
    table: {
      category: 'Component API',
    },
  },
  disabled: {
    control: 'boolean',
    description: buttonDocs.argTypeDescriptions.disabled,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  isLoading: {
    control: 'boolean',
    description: buttonDocs.argTypeDescriptions.isLoading,
    table: {
      category: 'Component API',
    },
  },
  leadingIcon: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.leadingIcon,
    options: iconOptions,
    table: {
      category: 'Component API',
    },
  },
  loadingLabel: {
    control: 'text',
    description: buttonDocs.argTypeDescriptions.loadingLabel,
    table: {
      category: 'Component API',
    },
  },
  preventLoadingShrink: {
    control: 'boolean',
    description: buttonDocs.argTypeDescriptions.preventLoadingShrink,
    table: {
      category: 'Component API',
    },
  },
  size: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.size,
    options: supportedButtonSizes,
    table: {
      category: 'Component API',
    },
  },
  trailingIcon: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.trailingIcon,
    options: iconOptions,
    table: {
      category: 'Component API',
    },
  },
  variant: {
    control: 'select',
    description: buttonDocs.argTypeDescriptions.variant,
    options: supportedButtonVariants,
    table: {
      category: 'Component API',
    },
  },
};

const meta: Meta<ButtonStoryArgs> = {
  args: defaultButtonArgs,
  argTypes: storyArgTypes,
  component: ButtonPlaygroundPreview,
  parameters: {
    controls: {
      include: [
        'children',
        'variant',
        'size',
        'leadingIcon',
        'trailingIcon',
        'isLoading',
        'loadingLabel',
        'preventLoadingShrink',
        'disabled',
      ],
      sort: 'none',
    },
  },
  title: 'Primitives/Action/Button',
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

function normalizeIcon(icon: ButtonIconOption): IconName | undefined {
  if (icon === noIconOption) {
    return undefined;
  }

  if (supportedIconNames.includes(icon)) {
    return icon;
  }

  return undefined;
}

function normalizeButtonArgs(args: ButtonStoryArgs): ButtonStoryArgs {
  const size = supportedButtonSizes.includes(args.size) ? args.size : defaultButtonArgs.size;
  const variant = supportedButtonVariants.includes(args.variant)
    ? args.variant
    : defaultButtonArgs.variant;

  return {
    ...args,
    leadingIcon: normalizeIcon(args.leadingIcon) ?? noIconOption,
    size,
    trailingIcon: normalizeIcon(args.trailingIcon) ?? noIconOption,
    variant,
  };
}

function ButtonPlaygroundPreview(args: ButtonStoryArgs): ReactElement {
  const leadingIcon = normalizeIcon(args.leadingIcon);
  const trailingIcon = normalizeIcon(args.trailingIcon);
  const snippet = createFrontendDocsComponentSnippet({
    children: args.children,
    componentName: 'Button',
    framework: 'react',
    props: [
      {
        defaultValue: defaultButtonArgs.variant,
        name: 'variant',
        value: args.variant,
      },
      {
        defaultValue: defaultButtonArgs.size,
        name: 'size',
        value: args.size,
      },
      {
        name: 'leadingIcon',
        value: leadingIcon,
      },
      {
        name: 'trailingIcon',
        value: trailingIcon,
      },
      {
        defaultValue: false,
        name: 'isLoading',
        value: args.isLoading,
      },
      {
        name: 'loadingLabel',
        value: args.loadingLabel,
      },
      {
        defaultValue: false,
        name: 'preventLoadingShrink',
        value: args.preventLoadingShrink,
      },
      {
        defaultValue: false,
        name: 'disabled',
        value: args.disabled,
      },
    ],
  });

  return (
    <StoryPlayground>
      <StoryInfoPanel>
        <p className='m-0 text-sm text-[var(--color-text-primary)]'>
          Button renders a native <code>button</code>, defaults to{' '}
          <code>type=&quot;button&quot;</code>, and keeps loading state disabled with{' '}
          <code>aria-busy</code>.
        </p>
      </StoryInfoPanel>
      <StoryPlaygroundContent split>
        <StoryPlaygroundPreview>
          <Button
            disabled={args.disabled}
            isLoading={args.isLoading}
            leadingIcon={leadingIcon}
            loadingLabel={args.loadingLabel}
            preventLoadingShrink={args.preventLoadingShrink}
            size={args.size}
            trailingIcon={trailingIcon}
            variant={args.variant}
          >
            {args.children}
          </Button>
        </StoryPlaygroundPreview>
        <StoryPlaygroundSnippet>
          <StorybookSourceSnippet code={snippet} />
        </StoryPlaygroundSnippet>
      </StoryPlaygroundContent>
    </StoryPlayground>
  );
}

function InteractiveLoadingExample(): ReactElement {
  const [loadingAction, setLoadingAction] = useState<'create' | 'save' | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function runAction(action: 'create' | 'save'): void {
    if (loadingAction !== undefined) {
      return;
    }

    setLoadingAction(action);
    timeoutRef.current = setTimeout(() => {
      setLoadingAction(undefined);
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
      <div className='flex flex-wrap gap-4'>
        <Button
          isLoading={loadingAction === 'save'}
          loadingLabel='Saving'
          onClick={() => runAction('save')}
          preventLoadingShrink
        >
          Save
        </Button>
        <Button
          isLoading={loadingAction === 'create'}
          leadingIcon='plus'
          loadingLabel='Creating'
          onClick={() => runAction('create')}
          preventLoadingShrink
          trailingIcon='arrow'
        >
          Create and continue
        </Button>
      </div>
    </div>
  );
}

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: [
        'children',
        'variant',
        'size',
        'leadingIcon',
        'trailingIcon',
        'isLoading',
        'loadingLabel',
        'preventLoadingShrink',
        'disabled',
      ],
      sort: 'none',
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => <ButtonPlaygroundPreview {...normalizeButtonArgs(args)} />,
};

export const Variants: Story = {
  name: 'Variants',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.variants,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {supportedButtonVariants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant === 'primary' ? 'Primary action' : 'Secondary action'}
        </Button>
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
        story: buttonDocs.storyDescriptions.sizes,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      {supportedButtonSizes.map((size) => (
        <Button key={size} size={size}>
          {size} button
        </Button>
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
        story: buttonDocs.storyDescriptions.states,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      {supportedButtonVariants.map((variant) => (
        <div
          className='grid gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'
          key={variant}
        >
          <span className='text-sm font-medium text-[var(--color-text-secondary)]'>{variant}</span>
          <div className='flex flex-wrap gap-3'>
            <Button variant={variant}>Default</Button>
            <Button className='button--force-hover' variant={variant}>
              Hover
            </Button>
            <Button className='button--force-focused' variant={variant}>
              Focused
            </Button>
            <Button className='button--force-pressed' variant={variant}>
              Pressed
            </Button>
            <Button disabled variant={variant}>
              Disabled
            </Button>
            <Button isLoading variant={variant}>
              Loading
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const IconPatterns: Story = {
  name: 'Icon patterns',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: buttonDocs.storyDescriptions.iconPatterns,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Button leadingIcon='plus'>Create</Button>
      <Button trailingIcon='arrow'>Continue</Button>
      <Button leadingIcon='plus' trailingIcon='arrow'>
        Create and continue
      </Button>
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
        story: buttonDocs.storyDescriptions.loading,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='grid gap-6'>
      <div className='flex flex-wrap gap-4'>
        <Button isLoading>Save</Button>
        <Button isLoading loadingLabel='Saving'>
          Save
        </Button>
        <Button isLoading leadingIcon='plus'>
          Create
        </Button>
        <Button isLoading trailingIcon='arrow'>
          Continue
        </Button>
        <Button isLoading leadingIcon='plus' trailingIcon='arrow'>
          Create and continue
        </Button>
      </div>
      <InteractiveLoadingExample />
    </div>
  ),
};
