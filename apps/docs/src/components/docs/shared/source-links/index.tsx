import {
  buttonDocs,
  codeBlockDocs,
  iconButtonDocs,
  iconDocs,
  linkDocs,
  loadingDocs,
  typographyDocs,
} from '@hoite-dev/ui';
import type { SourceLink } from '../types';
import styles from './source-links.module.css';

const REPO_BASE_URL = 'https://github.com/martinhoite/hoite-dev/blob/master/';

function createSourceUrl(path: string) {
  return `${REPO_BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function SourceLinksList({ links }: { links: readonly SourceLink[] }) {
  return (
    <ul className={styles.list}>
      {links.map((link) => {
        return (
          <li className={styles.item} key={link.path}>
            <a
              className={styles.path}
              href={createSourceUrl(link.path)}
              rel='noreferrer'
              target='_blank'
            >
              <span className={styles.label}>{link.label}</span>
              <code>{link.path}</code>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const typographySourceLinks = [
  ...typographyDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/static/Typography/Typography.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/static/Typography/Typography.vue',
  },
] as const satisfies readonly SourceLink[];

export const codeBlockSourceLinks = [
  ...codeBlockDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/static/CodeBlock/CodeBlock.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/static/CodeBlock/CodeBlock.vue',
  },
] as const satisfies readonly SourceLink[];

export const iconSourceLinks = [
  ...iconDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/static/Icon/Icon.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/static/Icon/Icon.vue',
  },
] as const satisfies readonly SourceLink[];

export const loadingSourceLinks = [
  ...loadingDocs.sourceLinks,
  {
    label: 'React implementations',
    path: 'packages/ui-react/src/components/primitives/static/Loading',
  },
  {
    label: 'Vue implementations',
    path: 'packages/ui-vue/src/components/primitives/static/Loading',
  },
] as const satisfies readonly SourceLink[];

export const buttonSourceLinks = [
  ...buttonDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/action/Button/Button.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/action/Button/Button.vue',
  },
] as const satisfies readonly SourceLink[];

export const linkSourceLinks = [
  ...linkDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/action/Link/Link.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/action/Link/Link.vue',
  },
] as const satisfies readonly SourceLink[];

export const iconButtonSourceLinks = [
  ...iconButtonDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/action/IconButton/IconButton.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/action/IconButton/IconButton.vue',
  },
] as const satisfies readonly SourceLink[];
