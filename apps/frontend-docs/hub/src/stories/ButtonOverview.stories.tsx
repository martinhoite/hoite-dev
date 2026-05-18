import {
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
  type IconButtonSize,
  type IconButtonVariant,
  iconButtonVariants,
  supportedButtonSizes,
  supportedButtonVariants,
  supportedIconButtonSizes,
  supportedIconButtonVariants,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeChipList, ContractPage, ContractSection, ContractTable } from './contractDocs';

const sizeKeys = [...supportedButtonSizes] as ButtonSize[];
const variantKeys = [...supportedButtonVariants] as ButtonVariant[];
const iconButtonSizeKeys = [...supportedIconButtonSizes] as IconButtonSize[];
const iconButtonVariantKeys = [...supportedIconButtonVariants] as IconButtonVariant[];

const meta: Meta = {
  title: 'Design System/Contracts/Action',
};

export default meta;

type Story = StoryObj;

export const Button: Story = {
  name: 'Button',
  tags: ['contract-docs'],
  parameters: {
    controls: {
      disable: true,
    },
    docsOnly: true,
  },
  render: () => {
    const sizeRows = sizeKeys.map((size) => {
      const token =
        size === 'small'
          ? 'padding 8/16, radius-sm, typography 12/16'
          : size === 'large'
            ? 'padding 16/24, radius-lg, typography 16/24'
            : 'padding 12/20, radius-md, typography 14/20';

      return {
        classOutput: buttonVariants({ size }),
        size,
        token,
      };
    });
    const variantRows = variantKeys.map((variant) => {
      const tokens =
        variant === 'primary'
          ? 'brand background, on-brand text'
          : 'neutral background, primary text';

      return {
        classOutput: buttonVariants({ variant }),
        tokens,
        variant,
      };
    });

    return (
      <ContractPage>
        <ContractSection title='Supported Button API'>
          <CodeChipList
            getItemKey={(item) => item}
            items={[
              'variant',
              'size',
              'leadingIcon',
              'trailingIcon',
              'isLoading',
              'loadingLabel',
              'preventLoadingShrink',
            ]}
          />
        </ContractSection>
        <ContractSection title='Size contract'>
          <ContractTable
            columns={[
              {
                header: 'Size',
                render: (item) => item.size,
              },
              {
                header: 'Token mapping',
                render: (item) => item.token,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.size}
            rows={sizeRows}
          />
        </ContractSection>
        <ContractSection title='Variant contract'>
          <ContractTable
            columns={[
              {
                header: 'Variant',
                render: (item) => item.variant,
              },
              {
                header: 'Token mapping',
                render: (item) => item.tokens,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.variant}
            rows={variantRows}
          />
        </ContractSection>
        <ContractSection title='Native behavior contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Button renders a native <code>button</code> and defaults to{' '}
            <code>type=&quot;button&quot;</code>. Loading state sets{' '}
            <code>aria-busy=&quot;true&quot;</code> and disables the button to prevent duplicate
            actions.
          </p>
        </ContractSection>
        <ContractSection title='Loading contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Loading uses the existing <code>Loader</code> primitive as decorative content. When a
            visible <code>loadingLabel</code> is supplied, it replaces the normal visible content
            while the button is loading.
          </p>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            <code>preventLoadingShrink</code> uses the last non-loading width as a minimum width
            while loading, which prevents shrinking but still allows the button to grow for wider
            loading content.
          </p>
        </ContractSection>
        <ContractSection title='Accessibility contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Button should have visible label content. Icon-only actions belong to IconButton.
            Loading does not create hidden labels or override author-provided accessible names.
          </p>
        </ContractSection>
      </ContractPage>
    );
  },
};

export const IconButton: Story = {
  name: 'IconButton',
  tags: ['contract-docs'],
  parameters: {
    controls: {
      disable: true,
    },
    docsOnly: true,
  },
  render: () => {
    const sizeRows = iconButtonSizeKeys.map((size) => {
      const token =
        size === 'small'
          ? 'size-control-sm, radius-sm, icon sm'
          : size === 'large'
            ? 'size-control-lg, radius-lg, icon lg'
            : 'size-control-md, radius-md, icon md';

      return {
        classOutput: iconButtonVariants({ size }),
        size,
        token,
      };
    });
    const variantRows = iconButtonVariantKeys.map((variant) => {
      const tokens =
        variant === 'primary'
          ? 'brand background, on-brand icon'
          : 'neutral background, primary icon';

      return {
        classOutput: iconButtonVariants({ variant }),
        tokens,
        variant,
      };
    });

    return (
      <ContractPage>
        <ContractSection title='Supported IconButton API'>
          <CodeChipList
            getItemKey={(item) => item}
            items={['icon', 'variant', 'size', 'isLoading', 'aria-label', 'aria-labelledby']}
          />
        </ContractSection>
        <ContractSection title='Size contract'>
          <ContractTable
            columns={[
              {
                header: 'Size',
                render: (item) => item.size,
              },
              {
                header: 'Token mapping',
                render: (item) => item.token,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.size}
            rows={sizeRows}
          />
        </ContractSection>
        <ContractSection title='Variant contract'>
          <ContractTable
            columns={[
              {
                header: 'Variant',
                render: (item) => item.variant,
              },
              {
                header: 'Token mapping',
                render: (item) => item.tokens,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.variant}
            rows={variantRows}
          />
        </ContractSection>
        <ContractSection title='Native behavior contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            IconButton renders a native <code>button</code> and defaults to{' '}
            <code>type=&quot;button&quot;</code>. Loading state sets{' '}
            <code>aria-busy=&quot;true&quot;</code> and disables the button to prevent duplicate
            actions.
          </p>
        </ContractSection>
        <ContractSection title='Loading contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Loading uses the existing <code>Loader</code> primitive as decorative content and
            replaces the icon while the action is loading.
          </p>
        </ContractSection>
        <ContractSection title='Accessibility contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            IconButton is icon-only and must be named with <code>aria-label</code> or{' '}
            <code>aria-labelledby</code>. It does not provide custom naming aliases.
          </p>
        </ContractSection>
      </ContractPage>
    );
  },
};
