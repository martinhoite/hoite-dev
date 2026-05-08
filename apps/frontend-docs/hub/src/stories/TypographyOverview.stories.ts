import {
  createCodeChipListTemplate,
  createContractPageTemplate,
  createContractSectionTemplate,
  createContractTableTemplate,
} from '@frontend-docs-shared/storybook/hubContractTemplates';
import {
  resolveTypographyDefaultTag,
  supportedTypographyTags,
  type TypographyVariant,
  typographyVariantConfig,
  typographyVariants,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const variantKeys = Object.keys(typographyVariantConfig) as TypographyVariant[];

const meta: Meta = {
  title: 'Primitives/Static/Typography Contract',
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  name: 'Docs',
  parameters: {
    docsOnly: true,
  },
  render: () => ({
    setup() {
      const supportedTags = [...supportedTypographyTags];
      const variants = variantKeys.map((variant) => ({
        classOutput: typographyVariants({ variant }),
        defaultTag: resolveTypographyDefaultTag(variant),
        variant,
      }));

      return {
        supportedTags,
        variants,
      };
    },
    template: createContractPageTemplate(`
${createContractSectionTemplate({
  body: createCodeChipListTemplate({
    itemAlias: 'tag',
    itemsExpression: 'supportedTags',
    keyExpression: 'tag',
  }),
  title: 'Supported tags',
})}
${createContractSectionTemplate({
  body: createContractTableTemplate({
    columns: [
      {
        header: 'Variant',
        valueExpression: 'item.variant',
      },
      {
        header: 'Default tag',
        valueExpression: 'item.defaultTag',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.classOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'variants',
    rowKeyExpression: 'item.variant',
  }),
  title: 'Variant contract',
})}
    `),
  }),
};
