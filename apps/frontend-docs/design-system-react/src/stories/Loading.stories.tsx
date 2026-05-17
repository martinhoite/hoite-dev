import { StoryInfoPanel, StoryStack } from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type LoadingColor,
  type LoadingSize,
  loadingDocs,
  supportedLoadingColors,
  supportedLoadingSizes,
} from '@hoite-dev/ui';
import { CircularProgress, Loader, Progress } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';

type CircularValueDisplay = 'fraction' | 'percent';

type LoadingStoryArgs = {
  ariaLabel: string;
  color: LoadingColor;
  indeterminate: boolean;
  labelClassName: string;
  label: string;
  max: number;
  showValue: boolean;
  size: LoadingSize;
  valueClassName: string;
  valueLabel: string;
  value: number;
  valueDisplay: CircularValueDisplay;
};

const storyArgTypes: Partial<ArgTypes<LoadingStoryArgs>> = {
  size: {
    control: 'select',
    description: loadingDocs.argTypeDescriptions.size,
    options: supportedLoadingSizes,
    table: {
      category: 'Component API',
    },
  },
  color: {
    control: 'select',
    description: loadingDocs.argTypeDescriptions.color,
    options: supportedLoadingColors,
    table: {
      category: 'Component API',
    },
  },
  label: {
    control: 'text',
    description: loadingDocs.argTypeDescriptions.label,
    table: {
      category: 'Component API',
    },
  },
  labelClassName: {
    control: 'text',
    description: 'Optional className applied to the CircularProgress label element.',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  ariaLabel: {
    control: 'text',
    description: loadingDocs.argTypeDescriptions.ariaLabel,
    name: 'aria-label',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  max: {
    control: 'number',
    description: loadingDocs.argTypeDescriptions.max,
    table: {
      category: 'Component API',
    },
  },
  value: {
    control: 'number',
    description: loadingDocs.argTypeDescriptions.value,
    table: {
      category: 'Component API',
    },
  },
  valueLabel: {
    control: 'text',
    description: 'Optional custom value text shown inside CircularProgress.',
    table: {
      category: 'Component API',
    },
  },
  valueClassName: {
    control: 'text',
    description: 'Optional className applied to the CircularProgress value element.',
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  indeterminate: {
    control: 'boolean',
    description: 'When true, renders the indeterminate loading state.',
    table: {
      category: 'Component API',
    },
  },
  showValue: {
    control: 'boolean',
    description: loadingDocs.argTypeDescriptions.showValue,
    table: {
      category: 'Component API',
    },
  },
  valueDisplay: {
    control: 'inline-radio',
    description: loadingDocs.argTypeDescriptions.valueDisplay,
    options: ['percent', 'fraction'] satisfies CircularValueDisplay[],
    table: {
      category: 'Component API',
    },
  },
};

const meta: Meta<LoadingStoryArgs> = {
  args: {
    ariaLabel: 'Loading content',
    color: 'primary',
    indeterminate: false,
    labelClassName: '',
    label: 'Loading content',
    max: 100,
    showValue: true,
    size: 'medium',
    valueClassName: '',
    valueLabel: '',
    value: 42,
    valueDisplay: 'percent',
  },
  argTypes: storyArgTypes,
  parameters: {
    controls: {
      sort: 'none',
    },
  },
  title: 'Primitives/Feedback/Loading',
};

export default meta;

type Story = StoryObj<LoadingStoryArgs>;

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function getSurfaceClass(color: LoadingColor): string {
  if (color === 'on-fill') {
    return 'rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]';
  }

  return 'rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5';
}

export const LoaderPlayground: Story = {
  name: 'Loader Playground',
  parameters: {
    controls: {
      include: ['size', 'color', 'ariaLabel'],
      sort: 'none',
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.playground,
      },
    },
  },
  render: (args) => {
    const ariaLabel = hasText(args.ariaLabel) ? args.ariaLabel : undefined;

    return (
      <StoryStack>
        <StoryInfoPanel className='text-sm text-[var(--color-text-secondary)]'>
          Loader uses `aria-label` or `aria-labelledby` when it is not decorative.
        </StoryInfoPanel>
        <div className={getSurfaceClass(args.color)}>
          <Loader aria-label={ariaLabel} color={args.color} size={args.size} />
        </div>
      </StoryStack>
    );
  },
};

export const ProgressPlayground: Story = {
  name: 'Progress Playground',
  parameters: {
    controls: {
      include: ['size', 'color', 'label', 'ariaLabel', 'value', 'max', 'indeterminate'],
      sort: 'none',
    },
  },
  render: (args) => {
    const ariaLabel = hasText(args.ariaLabel) ? args.ariaLabel : undefined;
    const label = hasText(args.label) ? args.label : undefined;
    const value = args.indeterminate ? undefined : args.value;

    return (
      <StoryStack>
        <StoryInfoPanel className='text-sm text-[var(--color-text-secondary)]'>
          Progress uses native <code>&lt;progress&gt;</code> semantics with shared numeric
          normalization.
        </StoryInfoPanel>
        <div className={getSurfaceClass(args.color)}>
          <Progress
            aria-label={ariaLabel}
            color={args.color}
            label={label}
            max={args.max}
            size={args.size}
            value={value}
          />
        </div>
      </StoryStack>
    );
  },
};

export const CircularProgressPlayground: Story = {
  name: 'CircularProgress Playground',
  parameters: {
    controls: {
      include: [
        'size',
        'color',
        'label',
        'labelClassName',
        'ariaLabel',
        'value',
        'max',
        'showValue',
        'valueLabel',
        'valueClassName',
        'valueDisplay',
      ],
      sort: 'none',
    },
  },
  render: (args) => {
    const ariaLabel = hasText(args.ariaLabel) ? args.ariaLabel : undefined;
    const label = hasText(args.label) ? args.label : undefined;
    const valueLabel = hasText(args.valueLabel) ? args.valueLabel : undefined;
    return (
      <StoryStack>
        <StoryInfoPanel className='text-sm text-[var(--color-text-secondary)]'>
          CircularProgress supports centered value text as percentage or step fraction.
        </StoryInfoPanel>
        <div className={getSurfaceClass(args.color)}>
          <CircularProgress
            aria-label={ariaLabel}
            color={args.color}
            label={label}
            labelClassName={args.labelClassName || undefined}
            max={args.max}
            showValue={args.showValue}
            size={args.size}
            value={args.value}
            valueClassName={args.valueClassName || undefined}
            valueDisplay={args.valueDisplay}
            valueLabel={valueLabel}
          />
        </div>
      </StoryStack>
    );
  },
};

export const LoaderExamples: Story = {
  name: 'Loader',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.loaderShowcase,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='grid gap-4 md:grid-cols-3'>
      {supportedLoadingColors.map((color) => (
        <div className={getSurfaceClass(color)} key={color}>
          <div className='grid gap-4'>
            {supportedLoadingSizes.map((size) => (
              <div className='flex items-center justify-between' key={`${color}-${size}`}>
                <code>{size}</code>
                <Loader aria-label={`${color} ${size} loader`} color={color} size={size} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ProgressExamples: Story = {
  name: 'Progress',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.progressShowcase,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <StoryStack>
      <div className='rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5'>
        <Progress color='primary' label='Deploying assets' max={100} size='large' value={76} />
      </div>
      <div className='rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5'>
        <Progress aria-label='Syncing content' color='secondary' size='medium' />
      </div>
      <div className='rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]'>
        <Progress color='on-fill' label='Publishing release' max={120} size='small' value={34} />
      </div>
    </StoryStack>
  ),
};

export const CircularProgressExamples: Story = {
  name: 'CircularProgress',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: loadingDocs.storyDescriptions.circularProgressShowcase,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='grid gap-4 sm:grid-cols-2'>
      <div className='rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-5'>
        <CircularProgress
          color='primary'
          label='Generating report'
          max={100}
          size='large'
          value={58}
        />
      </div>
      <div className='rounded-xl bg-[var(--color-bg-brand)] p-5 text-[var(--color-text-on-fill)]'>
        <CircularProgress
          color='on-fill'
          label='Warming cache'
          max={10}
          size='small'
          value={4}
          valueDisplay='fraction'
        />
      </div>
    </div>
  ),
};
