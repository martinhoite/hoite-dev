import {
  compositionThemeConfig,
  createFrontendDocsAddons,
  createFrontendDocsStorybookConfig,
  frontendDocsStoryGlobs,
  withHoitePreviewHead,
} from '@hoite-dev/frontend-docs-shared/storybook';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const STORYBOOK_LOCAL_HOST = 'design-system-react.local.hoite.dev';

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: createFrontendDocsAddons(compositionThemeConfig),
  frameworkName: '@storybook/react-vite',
  host: STORYBOOK_LOCAL_HOST,
  stories: frontendDocsStoryGlobs,
  vitePlugins: [tailwindcss()],
});

config.previewHead = (head) => {
  return withHoitePreviewHead(head);
};

export default config;
