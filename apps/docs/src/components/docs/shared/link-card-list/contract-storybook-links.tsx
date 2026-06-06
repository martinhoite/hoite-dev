import type { StorybookLink } from '../types';
import { StorybookLinkList } from './storybook-link-list';

type ContractStorybookId = 'codeblock' | 'typography';

type ContractStorybookConfig = {
  storyId: string;
};

const contractStorybookConfigs = {
  codeblock: {
    storyId: 'primitives-static-codeblock',
  },
  typography: {
    storyId: 'primitives-static-typography',
  },
} as const satisfies Record<ContractStorybookId, ContractStorybookConfig>;

function createStorybookHref(framework: 'react' | 'vue', storyId: string) {
  return `pathname:///design-system/${framework}/?path=/docs/${storyId}--docs`;
}

function createFrameworkLinks(contract: ContractStorybookId): readonly StorybookLink[] {
  const config = contractStorybookConfigs[contract];

  return [
    {
      href: createStorybookHref('react', config.storyId),
      label: 'React Storybook',
      summary: 'Props, controls, and examples for React.',
    },
    {
      href: createStorybookHref('vue', config.storyId),
      label: 'Vue Storybook',
      summary: 'Props, controls, and examples for Vue.',
    },
  ];
}

export function ContractStorybookLinks({ contract }: { contract: ContractStorybookId }) {
  return <StorybookLinkList links={createFrameworkLinks(contract)} />;
}
