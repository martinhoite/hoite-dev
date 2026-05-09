import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

import {
  createFrontendDocsStorybookConfig,
  frontendDocsDefaultAddons,
  frontendDocsStoryGlobs,
} from '../../shared/storybook/config.ts';

const STORYBOOK_LOCAL_HOST = 'frontend-docs.local.hoite.dev';

const config = createFrontendDocsStorybookConfig<StorybookConfig>({
  addons: [...frontendDocsDefaultAddons, '@storybook/addon-themes'],
  frameworkName: '@storybook/react-vite',
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
