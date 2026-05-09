import {
  createCodeChipListTemplate,
  createContractPageTemplate,
  createContractSectionTemplate,
  createContractTableTemplate,
} from '@frontend-docs-shared/storybook/hubContractTemplates';
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
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const rotationKeys = [...supportedIconRotations] as IconRotation[];
const sizeKeys = [...supportedIconSizes] as IconSize[];
const variantKeys = [...supportedIconVariants] as IconVariant[];

const meta: Meta = {
  title: 'Design System/Contracts/Static/Icon',
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
      const iconNames = [...supportedIconNames];
      const sizeRows = sizeKeys.map((size) => ({
        classOutput: iconVariants({ size }),
        size,
        token: `var(--size-icon-${size})`,
      }));
      const rotationRows = rotationKeys.map((rotation) => ({
        classOutput: iconVariants({ rotation }),
        rotation,
      }));
      const variantRows = variantKeys.map((variant) => ({
        classOutput: iconVariants({ variant }),
        token: variant === 'on-fill' ? 'var(--color-icon-on-fill)' : `var(--color-icon-${variant})`,
        variant,
      }));

      return {
        iconNames,
        rotationRows,
        sizeRows,
        variantRows,
      };
    },
    template: createContractPageTemplate(`
${createContractSectionTemplate({
  body: createCodeChipListTemplate({
    itemAlias: 'iconName',
    itemsExpression: 'iconNames',
    keyExpression: 'iconName',
  }),
  title: 'Supported icon names',
})}
${createContractSectionTemplate({
  body: createContractTableTemplate({
    columns: [
      {
        header: 'Size',
        valueExpression: 'item.size',
      },
      {
        header: 'Token',
        valueExpression: 'item.token',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.classOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'sizeRows',
    rowKeyExpression: 'item.size',
  }),
  title: 'Size contract',
})}
${createContractSectionTemplate({
  body: createContractTableTemplate({
    columns: [
      {
        header: 'Rotation',
        valueExpression: 'item.rotation',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.classOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'rotationRows',
    rowKeyExpression: 'item.rotation',
  }),
  title: 'Rotation contract',
})}
${createContractSectionTemplate({
  body: createContractTableTemplate({
    columns: [
      {
        header: 'Variant',
        valueExpression: 'item.variant',
      },
      {
        header: 'Token',
        valueExpression: 'item.token',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.classOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'variantRows',
    rowKeyExpression: 'item.variant',
  }),
  title: 'Variant contract',
})}
${createContractSectionTemplate({
  body: `
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              All current icons are authored as 24 by 24 stroke-based paths. The primitive enforces
              <code> fill="none" </code>, <code>stroke="currentColor"</code>, a stroke width of
              <code> 2 </code>, and round line caps and joins across every icon.
            </p>
  `,
  title: 'SVG rendering contract',
})}
${createContractSectionTemplate({
  body: `
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Icons without <code>label</code> or <code>aria-label</code> are decorative and hidden
              from assistive technology. If both are provided, <code>label</code> wins.
            </p>
  `,
  title: 'Accessibility contract',
})}
${createContractSectionTemplate({
  body: `
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Icon is a small SVG primitive for consistent shape, size, color, and accessibility.
              It does not own click behavior, button semantics, or link semantics.
            </p>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Interactive icon-only behavior belongs to <code>IconButton</code>, where hit target,
              focus treatment, and action semantics can be handled deliberately.
            </p>
  `,
  title: 'Why Icon is static',
})}
    `),
  }),
};
