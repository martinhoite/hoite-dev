import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  compositionThemeConfig,
  createFrontendDocsAddons,
  createFrontendDocsStorybookConfig,
  frontendDocsStoryGlobs,
} from '@hoite-dev/frontend-docs-shared/storybook';
import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import postcssNested from 'postcss-nested';
import { siteNuxtAutoImportsPlugin } from './siteNuxtAutoImportsPlugin.ts';

const STORYBOOK_LOCAL_HOST = 'site-nuxt-components.local.hoite.dev';
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE_NUXT_ROOT = path.resolve(CURRENT_DIR, '../../../site-nuxt');

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: createFrontendDocsAddons(compositionThemeConfig),
  frameworkName: '@storybook/vue3-vite',
  host: STORYBOOK_LOCAL_HOST,
  stories: frontendDocsStoryGlobs,
  viteConfigOverride: {
    css: {
      postcss: {
        plugins: [postcssNested()],
      },
    },
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
  },
  vitePlugins: [siteNuxtAutoImportsPlugin(), tailwindcss(), vue()],
});

export default config;
