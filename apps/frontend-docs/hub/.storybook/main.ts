import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

import { compositionThemeConfig } from '../../shared/storybook/compositionThemeConfig.ts';
import {
  createFrontendDocsAddons,
  createFrontendDocsStorybookConfig,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'frontend-docs.local.hoite.dev';

function createRef(title: string, url: string | undefined) {
  if (!url) {
    return {
      disable: true as const,
    };
  }

  return {
    title,
    url,
  };
}

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: createFrontendDocsAddons(compositionThemeConfig),
  frameworkName: '@storybook/react-vite',
  host: STORYBOOK_LOCAL_HOST,
  mainFileUrl: import.meta.url,
  refs: () => {
    const reactStorybookUrl = process.env.STORYBOOK_REACT_REF_URL;
    const vueStorybookUrl = process.env.STORYBOOK_VUE_REF_URL;

    return {
      react: createRef('React', reactStorybookUrl),
      vue: createRef('Vue', vueStorybookUrl),
      // Restore when site-nuxt docs return to active maintenance:
      // sitenuxtcomponents: createRef(
      //   'Site Nuxt Components',
      //   process.env.STORYBOOK_SITE_NUXT_COMPONENTS_REF_URL,
      // ),
    };
  },
  stories: frontendDocsStoryGlobs,
  vitePlugins: [tailwindcss()],
});

config.managerHead = (head) => {
  return `${head}
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" href="/favicon.png" />
<script>
(() => {
  const suffix = ' \u22c5 Storybook';
  const replacementSuffix = ' \u22c5 Hoite Dev';

  const applyTitleReplacement = () => {
    if (!document.title.endsWith(suffix)) {
      return;
    }

    document.title = \`\${document.title.slice(0, -suffix.length)}\${replacementSuffix}\`;
  };

  const titleElement = document.querySelector('title');

  if (titleElement) {
    const observer = new MutationObserver(() => {
      applyTitleReplacement();
    });

    observer.observe(titleElement, { childList: true });
  }

  applyTitleReplacement();
})();
</script>
`;
};

config.previewHead = (head) => {
  return `${head}
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" href="/favicon.png" />
`;
};

export default config;
