import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vite';

const STORYBOOK_LOCAL_HOST = 'storybook.local.hoite.dev';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    {
      name: 'storybook-design-token',
      options: {
        designTokenGlob: '../../packages/ui/dist/{tokens,themes}.css',
      },
    },
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    allowedHosts: [STORYBOOK_LOCAL_HOST],
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vue()],
      server: {
        allowedHosts: [STORYBOOK_LOCAL_HOST],
      },
    });
  },
};

export default config;
