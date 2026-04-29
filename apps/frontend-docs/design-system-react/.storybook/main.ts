import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const STORYBOOK_LOCAL_HOST = 'design-system-react.local.hoite.dev';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    allowedHosts: true,
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      server: {
        host: STORYBOOK_LOCAL_HOST,
        allowedHosts: true,
      },
    });
  },
};

export default config;
