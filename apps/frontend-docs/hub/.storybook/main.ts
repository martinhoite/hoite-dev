import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vite';

const STORYBOOK_LOCAL_HOST = 'frontend-docs.local.hoite.dev';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
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
  core: {
    allowedHosts: true,
  },
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
