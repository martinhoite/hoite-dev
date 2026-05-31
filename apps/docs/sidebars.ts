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
        'design-system/components/index',
        'design-system/components/typography/index',
        'design-system/components/code-block/index',
      ],
    },
    {
      type: 'category',
      label: 'Packages',
      items: ['packages/ui/index'],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/frontend-docs/index'],
    },
  ],
};

export default sidebars;
