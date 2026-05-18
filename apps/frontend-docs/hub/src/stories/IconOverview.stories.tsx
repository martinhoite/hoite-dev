import {
  type IconRotation,
  type IconSize,
  type IconVariant,
  iconVariants,
  supportedIconNames,
  supportedIconRotations,
  supportedIconSizes,
  supportedIconVariants,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeChipList, ContractPage, ContractSection, ContractTable } from './contractDocs';

const rotationKeys = [...supportedIconRotations] as IconRotation[];
const sizeKeys = [...supportedIconSizes] as IconSize[];
const variantKeys = [...supportedIconVariants] as IconVariant[];

const meta: Meta = {
  title: 'Design System/Contracts/Static',
};

export default meta;

type Story = StoryObj;

export const Icon: Story = {
  name: 'Icon',
  tags: ['contract-docs'],
  parameters: {
    controls: {
      disable: true,
    },
    docsOnly: true,
  },
  render: () => {
    const iconNames = [...supportedIconNames];
    const sizeRows = sizeKeys.map((size) => {
      return {
        classOutput: iconVariants({ size }),
        size,
        token: `var(--size-icon-${size})`,
      };
    });
    const rotationRows = rotationKeys.map((rotation) => {
      return {
        classOutput: iconVariants({ rotation }),
        rotation,
      };
    });
    const variantRows = variantKeys.map((variant) => {
      const token =
        variant === 'on-fill' ? 'var(--color-icon-on-fill)' : `var(--color-icon-${variant})`;

      return {
        classOutput: iconVariants({ variant }),
        token,
        variant,
      };
    });

    return (
      <ContractPage>
        <ContractSection title='Supported icon names'>
          <CodeChipList getItemKey={(iconName) => iconName} items={iconNames} />
        </ContractSection>
        <ContractSection title='Size contract'>
          <ContractTable
            columns={[
              {
                header: 'Size',
                render: (item) => item.size,
              },
              {
                header: 'Token',
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
        <ContractSection title='Rotation contract'>
          <ContractTable
            columns={[
              {
                header: 'Rotation',
                render: (item) => item.rotation,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.rotation}
            rows={rotationRows}
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
                header: 'Token',
                render: (item) => item.token,
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
        <ContractSection title='SVG rendering contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            All current icons are authored as 24 by 24 stroke-based paths. The primitive enforces
            <code> fill=&quot;none&quot; </code>, <code>stroke=&quot;currentColor&quot;</code>, a
            stroke width of <code> 2 </code>, and round line caps and joins across every icon.
          </p>
        </ContractSection>
        <ContractSection title='Attribution'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Icon SVG path data is derived from{' '}
            <a href='https://github.com/tabler/tabler-icons' rel='noreferrer' target='_blank'>
              Tabler Icons
            </a>
            , which is licensed under the MIT License.
          </p>
        </ContractSection>
        <ContractSection title='Accessibility contract'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Icons without <code>label</code> or <code>aria-label</code> are decorative and hidden
            from assistive technology. If both are provided, <code>label</code> wins.
          </p>
        </ContractSection>
        <ContractSection title='Why Icon is static'>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Icon is a small SVG primitive for consistent shape, size, color, and accessibility. It
            does not own click behavior, button semantics, or link semantics.
          </p>
          <p className='m-0 text-sm text-[var(--color-text-secondary)]'>
            Interactive icon-only behavior belongs to <code>IconButton</code>, where hit target,
            focus treatment, and action semantics can be handled deliberately.
          </p>
        </ContractSection>
      </ContractPage>
    );
  },
};
