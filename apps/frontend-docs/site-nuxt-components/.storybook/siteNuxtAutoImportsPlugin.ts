import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Plugin } from 'vite';

const SCRIPT_SETUP_OPEN = '<script setup lang="ts">';
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GLOBAL_LOGO_PATH = path.normalize(
  path.resolve(CURRENT_DIR, '../../../site-nuxt/components/global/GlobalLogo.vue'),
);

export function siteNuxtAutoImportsPlugin(): Plugin {
  return {
    name: 'site-nuxt-auto-imports',
    transform(code, id) {
      const normalizedId = path.normalize((id.split('?')[0] ?? id).replace(/\//g, path.sep));

      if (normalizedId !== GLOBAL_LOGO_PATH || !code.includes(SCRIPT_SETUP_OPEN)) {
        return null;
      }

      return code.replace(
        SCRIPT_SETUP_OPEN,
        `${SCRIPT_SETUP_OPEN}
import { computed } from 'vue';
import { getMediaLink, useSite } from 'site-nuxt-storybook-runtime';`,
      );
    },
  };
}
