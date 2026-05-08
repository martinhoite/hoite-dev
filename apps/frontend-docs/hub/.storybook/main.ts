import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

import {
  createFrontendDocsStorybookConfig,
  frontendDocsDefaultAddons,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'frontend-docs.local.hoite.dev';

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: [
    ...frontendDocsDefaultAddons,
    {
      name: 'storybook-design-token/preset',
      options: {
        designTokenGlob: '../../../packages/ui/dist/{tokens,themes}.css',
      },
    },
  ],
  frameworkName: '@storybook/vue3-vite',
  host: STORYBOOK_LOCAL_HOST,
  mainFileUrl: import.meta.url,
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
  vitePlugins: [tailwindcss(), vue()],
});

export default config;
