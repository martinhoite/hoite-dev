import {
  createCodeChipListTemplate,
  createContractPageTemplate,
  createContractSectionTemplate,
  createContractTableTemplate,
  createSubsectionTemplate,
} from '@frontend-docs-shared/storybook/hubContractTemplates';
import {
  circularProgressVariants,
  type LoadingColor,
  type LoadingSize,
  loaderVariants,
  progressVariants,
  supportedLoadingColors,
  supportedLoadingSizes,
} from '@hoite-dev/ui';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const colorKeys = [...supportedLoadingColors] as LoadingColor[];
const sizeKeys = [...supportedLoadingSizes] as LoadingSize[];

const meta: Meta = {
  title: 'Design System/Contracts/Feedback/Loading',
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
      const sizeRows = sizeKeys.map((size) => ({
        circularClassOutput: circularProgressVariants({ size }),
        loaderClassOutput: loaderVariants({ size }),
        progressClassOutput: progressVariants({ size }),
        size,
      }));
      const colorRows = colorKeys.map((color) => ({
        circularClassOutput: circularProgressVariants({ color }),
        color,
        loaderClassOutput: loaderVariants({ color }),
        progressClassOutput: progressVariants({ color }),
      }));

      return {
        colorRows,
        sizeRows,
      };
    },
    template: createContractPageTemplate(`
${createContractSectionTemplate({
  body: createCodeChipListTemplate({
    itemAlias: 'size',
    itemsExpression: 'sizeRows',
    keyExpression: 'size.size',
    valueExpression: 'size.size',
  }),
  title: 'Supported sizes',
})}
${createContractSectionTemplate({
  body: createCodeChipListTemplate({
    itemAlias: 'color',
    itemsExpression: 'colorRows',
    keyExpression: 'color.color',
    valueExpression: 'color.color',
  }),
  title: 'Supported colors',
})}
${createContractSectionTemplate({
  body: `
            <div class="grid gap-4">
${createSubsectionTemplate(
  'Loader',
  createContractTableTemplate({
    columns: [
      {
        header: 'Size',
        valueExpression: 'item.size',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.loaderClassOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'sizeRows',
    rowKeyExpression: "'loader-' + item.size",
  }),
)}
${createSubsectionTemplate(
  'Progress',
  createContractTableTemplate({
    columns: [
      {
        header: 'Size',
        valueExpression: 'item.size',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.progressClassOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'sizeRows',
    rowKeyExpression: "'progress-' + item.size",
  }),
)}
${createSubsectionTemplate(
  'CircularProgress',
  createContractTableTemplate({
    columns: [
      {
        header: 'Size',
        valueExpression: 'item.size',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.circularClassOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'sizeRows',
    rowKeyExpression: "'circular-' + item.size",
  }),
)}
            </div>
  `,
  className: 'grid gap-4',
  title: 'Size contract',
})}
${createContractSectionTemplate({
  body: `
            <div class="grid gap-4">
${createSubsectionTemplate(
  'Loader',
  createContractTableTemplate({
    columns: [
      {
        header: 'Color',
        valueExpression: 'item.color',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.loaderClassOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'colorRows',
    rowKeyExpression: "'loader-' + item.color",
  }),
)}
${createSubsectionTemplate(
  'Progress',
  createContractTableTemplate({
    columns: [
      {
        header: 'Color',
        valueExpression: 'item.color',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.progressClassOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'colorRows',
    rowKeyExpression: "'progress-' + item.color",
  }),
)}
${createSubsectionTemplate(
  'CircularProgress',
  createContractTableTemplate({
    columns: [
      {
        header: 'Color',
        valueExpression: 'item.color',
      },
      {
        breakAll: true,
        header: 'Class output',
        valueExpression: 'item.circularClassOutput',
      },
    ],
    rowItemAlias: 'item',
    rowItemsExpression: 'colorRows',
    rowKeyExpression: "'circular-' + item.color",
  }),
)}
            </div>
  `,
  className: 'grid gap-4',
  title: 'Color contract',
})}
${createContractSectionTemplate({
  body: `
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              <code>Progress</code> supports determinate and indeterminate states. Indeterminate state
              is represented by adding <code>progress--indeterminate</code> to the class output and uses
              a dedicated segment size token for motion and reduced-motion fallback.
            </p>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              <code>CircularProgress</code> is determinate only. If value is omitted, wrappers fall back
              to <code>0</code> and emit a development warning.
            </p>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Fraction value display in <code>CircularProgress</code> adds
              <code> circular-progress__value--fraction </code> to reduce value text size by about 2px.
            </p>
  `,
  title: 'Behavior contract',
})}
${createContractSectionTemplate({
  body: `
            <div class="flex flex-wrap gap-2">
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--size-loading-progress-indeterminate-segment</code>
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--size-loading-progress-reduced-motion-segment</code>
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--motion-duration-extended</code>
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--motion-duration-sustained</code>
            </div>
  `,
  title: 'Key loading tokens',
})}
    `),
  }),
};
