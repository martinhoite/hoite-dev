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
  title: 'Primitives/Feedback/Loading Contract',
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
    template: `
      <div class="mx-auto max-w-5xl py-6">
        <div class="grid gap-6">
          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Supported sizes</h2>
            <div class="flex flex-wrap gap-2">
              <code
                v-for="size in sizeRows"
                :key="size.size"
                class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1"
              >
                {{ size.size }}
              </code>
            </div>
          </section>

          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Supported colors</h2>
            <div class="flex flex-wrap gap-2">
              <code
                v-for="color in colorRows"
                :key="color.color"
                class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1"
              >
                {{ color.color }}
              </code>
            </div>
          </section>

          <section class="grid gap-4">
            <h2 class="m-0 text-base font-semibold">Size contract</h2>
            <div class="grid gap-4">
              <section class="grid gap-2">
                <h3 class="m-0 text-sm font-semibold">Loader</h3>
                <div class="overflow-auto">
                  <table class="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Size</th>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in sizeRows" :key="\`loader-\${item.size}\`">
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                          <code>{{ item.size }}</code>
                        </td>
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                          <code>{{ item.loaderClassOutput }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section class="grid gap-2">
                <h3 class="m-0 text-sm font-semibold">Progress</h3>
                <div class="overflow-auto">
                  <table class="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Size</th>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in sizeRows" :key="\`progress-\${item.size}\`">
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                          <code>{{ item.size }}</code>
                        </td>
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                          <code>{{ item.progressClassOutput }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section class="grid gap-2">
                <h3 class="m-0 text-sm font-semibold">CircularProgress</h3>
                <div class="overflow-auto">
                  <table class="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Size</th>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in sizeRows" :key="\`circular-\${item.size}\`">
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                          <code>{{ item.size }}</code>
                        </td>
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                          <code>{{ item.circularClassOutput }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </section>

          <section class="grid gap-4">
            <h2 class="m-0 text-base font-semibold">Color contract</h2>
            <div class="grid gap-4">
              <section class="grid gap-2">
                <h3 class="m-0 text-sm font-semibold">Loader</h3>
                <div class="overflow-auto">
                  <table class="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Color</th>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in colorRows" :key="\`loader-\${item.color}\`">
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                          <code>{{ item.color }}</code>
                        </td>
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                          <code>{{ item.loaderClassOutput }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section class="grid gap-2">
                <h3 class="m-0 text-sm font-semibold">Progress</h3>
                <div class="overflow-auto">
                  <table class="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Color</th>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in colorRows" :key="\`progress-\${item.color}\`">
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                          <code>{{ item.color }}</code>
                        </td>
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                          <code>{{ item.progressClassOutput }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section class="grid gap-2">
                <h3 class="m-0 text-sm font-semibold">CircularProgress</h3>
                <div class="overflow-auto">
                  <table class="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Color</th>
                        <th class="border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold">Class output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in colorRows" :key="\`circular-\${item.color}\`">
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top">
                          <code>{{ item.color }}</code>
                        </td>
                        <td class="border-b border-[var(--color-border-muted)] p-2 align-top break-all">
                          <code>{{ item.circularClassOutput }}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </section>

          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Behavior contract</h2>
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
          </section>

          <section class="grid gap-2">
            <h2 class="m-0 text-base font-semibold">Key loading tokens</h2>
            <div class="flex flex-wrap gap-2">
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--size-loading-progress-indeterminate-segment</code>
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--size-loading-progress-reduced-motion-segment</code>
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--motion-duration-extended</code>
              <code class="rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1">--motion-duration-sustained</code>
            </div>
          </section>
        </div>
      </div>
    `,
  }),
};
