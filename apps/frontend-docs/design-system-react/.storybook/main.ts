import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

import {
  createFrontendDocsViteOptions,
  frontendDocsCoreConfig,
  frontendDocsDefaultAddons,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'design-system-react.local.hoite.dev';
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DOCS_SHARED_ROOT = path.resolve(CURRENT_DIR, '../../shared');

const config: StorybookConfig = {
  addons: [...frontendDocsDefaultAddons],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: frontendDocsCoreConfig,
  stories: frontendDocsStoryGlobs,
  async viteFinal(config) {
    return mergeConfig(
      config,
      createFrontendDocsViteOptions({
        aliases: {
          '@frontend-docs-shared': FRONTEND_DOCS_SHARED_ROOT,
        },
        host: STORYBOOK_LOCAL_HOST,
        plugins: [tailwindcss()],
      }),
    );
  },
};

export default config;
