import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Design System',
      link: {
        type: 'doc',
        id: 'design-system/index',
      },
      items: [
        'design-system/tokens/index',
        {
          type: 'category',
          label: 'Contracts',
          link: {
            type: 'doc',
            id: 'design-system/components/index',
          },
          items: [
            {
              type: 'category',
              label: 'Static',
              items: [
                'design-system/components/typography/index',
                'design-system/components/code-block/index',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Packages',
      link: {
        type: 'doc',
        id: 'packages/index',
      },
      items: [
        'packages/ui/index',
        'packages/ui-react/index',
        'packages/ui-vue/index',
        'packages/umbraco-client/index',
        'packages/biome-config/index',
        'packages/brand-assets/index',
        'packages/diagnostics/index',
        'packages/storybook-addon-composition-theme/index',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/frontend-docs/index'],
    },
  ],
};

export default sidebars;
