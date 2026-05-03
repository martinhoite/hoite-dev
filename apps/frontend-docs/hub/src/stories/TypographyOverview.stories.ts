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
    template: `
      <div class="mx-auto w-full max-w-5xl px-4 py-6">
        <div class="grid gap-6">
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Supported tags</h2>
            <div class="flex flex-wrap gap-2">
              <code
                v-for="tag in supportedTags"
                :key="tag"
                class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1"
              >
                {{ tag }}
              </code>
            </div>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Variant contract</h2>
            <div class="overflow-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Variant</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Default tag</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in variants" :key="item.variant">
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.variant }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.defaultTag }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                      <code>{{ item.classOutput }}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    `,
  }),
};
