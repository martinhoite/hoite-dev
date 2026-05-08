import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vite';

import {
  createFrontendDocsViteOptions,
  frontendDocsCoreConfig,
  frontendDocsDefaultAddons,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'frontend-docs.local.hoite.dev';
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DOCS_SHARED_ROOT = path.resolve(CURRENT_DIR, '../../shared');

const config: StorybookConfig = {
  addons: [
    ...frontendDocsDefaultAddons,
    {
      name: 'storybook-design-token/preset',
      options: {
        designTokenGlob: '../../../packages/ui/dist/{tokens,themes}.css',
      },
    },
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: frontendDocsCoreConfig,
  refs: () => {
    const reactStorybookUrl = process.env.STORYBOOK_REACT_REF_URL;
    const vueStorybookUrl = process.env.STORYBOOK_VUE_REF_URL;
    const siteNuxtComponentsStorybookUrl = process.env.STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL;

    return {
      react: reactStorybookUrl
        ? {
            title: 'React',
            url: reactStorybookUrl,
          }
        : {
            disable: true,
          },
      vue: vueStorybookUrl
        ? {
            title: 'Vue',
            url: vueStorybookUrl,
          }
        : {
            disable: true,
          },
      sitenuxtcomponents: siteNuxtComponentsStorybookUrl
        ? {
            title: 'Site Nuxt Components',
            url: siteNuxtComponentsStorybookUrl,
          }
        : {
            disable: true,
          },
    };
  },
  stories: frontendDocsStoryGlobs,
  async viteFinal(config) {
    return mergeConfig(
      config,
      createFrontendDocsViteOptions({
        aliases: {
          '@frontend-docs-shared': FRONTEND_DOCS_SHARED_ROOT,
        },
        host: STORYBOOK_LOCAL_HOST,
        plugins: [tailwindcss(), vue()],
      }),
    );
  },
};

export default config;
