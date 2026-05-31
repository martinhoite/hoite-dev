import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Hoite Dev Docs',
  tagline: 'Design system contracts, package ownership, and frontend docs architecture.',
  favicon: 'favicon.svg',
  url: 'https://docs.hoite.dev',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  future: {
    faster: true,
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  presets: [
    [
      'classic',
      {
        blog: false,
        docs: {
          path: './content',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    image: 'brand/hoite-dev-mark.svg',
    navbar: {
      title: 'Hoite Dev Docs',
      logo: {
        alt: 'Hoite Dev mark',
        src: 'brand/hoite-dev-mark.svg',
      },
      items: [
        {
          label: 'Design System',
          position: 'left',
          to: '/design-system/',
        },
        {
          label: 'Packages',
          position: 'left',
          to: '/packages/ui/',
        },
        {
          label: 'Architecture',
          position: 'left',
          to: '/architecture/frontend-docs/',
        },
        {
          href: 'pathname:///design-system/react/',
          label: 'React Storybook',
          position: 'right',
        },
        {
          href: 'pathname:///design-system/vue/',
          label: 'Vue Storybook',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Design System',
              to: '/design-system/',
            },
            {
              label: 'Tokens',
              to: '/design-system/tokens/',
            },
          ],
        },
        {
          title: 'Storybook',
          items: [
            {
              label: 'React',
              href: 'pathname:///design-system/react/',
            },
            {
              label: 'Vue',
              href: 'pathname:///design-system/vue/',
            },
          ],
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
