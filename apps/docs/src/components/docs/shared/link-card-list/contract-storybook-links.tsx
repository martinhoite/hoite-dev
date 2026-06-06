import Link from '@docusaurus/Link';
import type { StorybookLink } from '../types';
import styles from './link-card-list.module.css';

type ContractStorybookId =
  | 'button'
  | 'codeblock'
  | 'icon'
  | 'iconbutton'
  | 'link'
  | 'loading'
  | 'typography';

type ContractStorybookConfig = {
  storyId: string;
};

const contractStorybookConfigs = {
  button: {
    storyId: 'primitives-action-button',
  },
  codeblock: {
    storyId: 'primitives-static-codeblock',
  },
  icon: {
    storyId: 'primitives-static-icon',
  },
  iconbutton: {
    storyId: 'primitives-action-iconbutton',
  },
  link: {
    storyId: 'primitives-action-link',
  },
  loading: {
    storyId: 'primitives-feedback-loading',
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
      summary: 'Rendered examples, controls, accessibility checks, and React-specific APIs.',
    },
    {
      href: createStorybookHref('vue', config.storyId),
      label: 'Vue Storybook',
      summary: 'Rendered examples, controls, accessibility checks, and Vue-specific APIs.',
    },
  ];
}

export function ContractStorybookLinks({ contract }: { contract: ContractStorybookId }) {
  return (
    <ul className={styles.frameworkLinkList}>
      {createFrameworkLinks(contract).map((link) => {
        return (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
            <span className={styles.frameworkLinkSummary}> - {link.summary}</span>
          </li>
        );
      })}
    </ul>
  );
}
