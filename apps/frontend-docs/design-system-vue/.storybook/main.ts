import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vite';

const STORYBOOK_LOCAL_HOST = 'design-system-vue.local.hoite.dev';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    allowedHosts: true,
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss(), vue()],
      server: {
        host: STORYBOOK_LOCAL_HOST,
        allowedHosts: true,
      },
    });
  },
};

export default config;
