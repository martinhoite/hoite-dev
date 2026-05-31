import {
  compositionThemeConfig,
  createFrontendDocsAddons,
  createFrontendDocsStorybookConfig,
  frontendDocsStoryGlobs,
  withHoiteManagerHead,
  withHoitePreviewHead,
} from '@hoite-dev/frontend-docs-shared/storybook';
import type { StorybookConfig } from '@storybook/vue3-vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

const STORYBOOK_LOCAL_HOST = 'design-system-vue.local.hoite.dev';

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: createFrontendDocsAddons(compositionThemeConfig),
  frameworkName: '@storybook/vue3-vite',
  host: STORYBOOK_LOCAL_HOST,
  stories: frontendDocsStoryGlobs,
  vitePlugins: [tailwindcss(), vue()],
});

config.previewHead = (head) => {
  return withHoitePreviewHead(head);
};

config.managerHead = (head) => {
  return withHoiteManagerHead(head);
};

export default config;
