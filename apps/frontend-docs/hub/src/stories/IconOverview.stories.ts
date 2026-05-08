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
  title: 'Primitives/Static/Icon Contract',
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
    template: `
      <div class="mx-auto w-full max-w-5xl px-4 py-6">
        <div class="grid gap-6">
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Supported icon names</h2>
            <div class="flex flex-wrap gap-2">
              <code
                v-for="iconName in iconNames"
                :key="iconName"
                class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1"
              >
                {{ iconName }}
              </code>
            </div>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Size contract</h2>
            <div class="overflow-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Size</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Token</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in sizeRows" :key="item.size">
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.size }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.token }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                      <code>{{ item.classOutput }}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Rotation contract</h2>
            <div class="overflow-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Rotation</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in rotationRows" :key="item.rotation">
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.rotation }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                      <code>{{ item.classOutput }}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Variant contract</h2>
            <div class="overflow-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Variant</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Token</th>
                    <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in variantRows" :key="item.variant">
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.variant }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                      <code>{{ item.token }}</code>
                    </td>
                    <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                      <code>{{ item.classOutput }}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">SVG rendering contract</h2>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              All current icons are authored as 24 by 24 stroke-based paths. The primitive enforces
              <code> fill="none" </code>, <code>stroke="currentColor"</code>, a stroke width of
              <code> 2 </code>, and round line caps and joins across every icon.
            </p>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Accessibility contract</h2>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Icons without <code>label</code> or <code>aria-label</code> are decorative and hidden
              from assistive technology. If both are provided, <code>label</code> wins.
            </p>
          </section>
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Why Icon is static</h2>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Icon is a small SVG primitive for consistent shape, size, color, and accessibility.
              It does not own click behavior, button semantics, or link semantics.
            </p>
            <p class="m-0 text-sm text-[var(--color-text-secondary)]">
              Interactive icon-only behavior belongs to <code>IconButton</code>, where hit target,
              focus treatment, and action semantics can be handled deliberately.
            </p>
          </section>
        </div>
      </div>
    `,
  }),
};
