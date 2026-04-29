import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import postcssNested from 'postcss-nested';
import { mergeConfig } from 'vite';

import { siteNuxtAutoImportsPlugin } from './siteNuxtAutoImportsPlugin.ts';

const STORYBOOK_LOCAL_HOST = 'site-nuxt-components.local.hoite.dev';
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE_NUXT_ROOT = path.resolve(CURRENT_DIR, '../../../site-nuxt');

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
      css: {
        postcss: {
          plugins: [postcssNested()],
        },
      },
      plugins: [siteNuxtAutoImportsPlugin(), tailwindcss(), vue()],
      resolve: {
        alias: {
          '@': SITE_NUXT_ROOT,
          '~': SITE_NUXT_ROOT,
          '@site-nuxt': SITE_NUXT_ROOT,
          'site-nuxt-storybook-runtime': path.resolve(
            CURRENT_DIR,
            '../src/siteNuxtStorybookRuntime.ts',
          ),
        },
      },
      server: {
        host: STORYBOOK_LOCAL_HOST,
        allowedHosts: true,
      },
    });
  },
};

export default config;
