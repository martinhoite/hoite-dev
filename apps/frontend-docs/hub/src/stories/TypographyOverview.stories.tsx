import {
  resolveTypographyDefaultTag,
  supportedTypographyTags,
  type TypographyVariant,
  typographyVariantConfig,
  typographyVariants,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CodeChipList, ContractPage, ContractSection, ContractTable } from './contractDocs';

const variantKeys = Object.keys(typographyVariantConfig) as TypographyVariant[];

const meta: Meta = {
  title: 'Design System/Contracts/Static',
};

export default meta;

type Story = StoryObj;

export const Typography: Story = {
  name: 'Typography',
  tags: ['contract-docs'],
  parameters: {
    controls: {
      disable: true,
    },
    docsOnly: true,
  },
  render: () => {
    const supportedTags = [...supportedTypographyTags];
    const variants = variantKeys.map((variant) => {
      return {
        classOutput: typographyVariants({ variant }),
        defaultTag: resolveTypographyDefaultTag(variant),
        variant,
      };
    });

    return (
      <ContractPage>
        <ContractSection title='Supported tags'>
          <CodeChipList getItemKey={(tag) => tag} items={supportedTags} />
        </ContractSection>
        <ContractSection title='Variant contract'>
          <ContractTable
            columns={[
              {
                header: 'Variant',
                render: (item) => item.variant,
              },
              {
                header: 'Default tag',
                render: (item) => item.defaultTag,
              },
              {
                breakAll: true,
                header: 'Class output',
                render: (item) => item.classOutput,
              },
            ]}
            getRowKey={(item) => item.variant}
            rows={variants}
          />
        </ContractSection>
      </ContractPage>
    );
  },
};
