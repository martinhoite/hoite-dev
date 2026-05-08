import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

import {
  createFrontendDocsStorybookConfig,
  frontendDocsDefaultAddons,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'design-system-vue.local.hoite.dev';

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: frontendDocsDefaultAddons,
  frameworkName: '@storybook/vue3-vite',
  host: STORYBOOK_LOCAL_HOST,
  mainFileUrl: import.meta.url,
  stories: frontendDocsStoryGlobs,
  vitePlugins: [tailwindcss(), vue()],
});

export default config;
