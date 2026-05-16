import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

import { compositionThemeConfig } from '../../shared/storybook/compositionThemeConfig.ts';
import {
  createFrontendDocsAddons,
  createFrontendDocsStorybookConfig,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'design-system-react.local.hoite.dev';

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: createFrontendDocsAddons(compositionThemeConfig),
  frameworkName: '@storybook/react-vite',
  host: STORYBOOK_LOCAL_HOST,
  mainFileUrl: import.meta.url,
  stories: frontendDocsStoryGlobs,
  vitePlugins: [tailwindcss()],
});

export default config;
