import { codeBlockDocs, typographyDocs } from '@hoite-dev/ui';
import { DocSectionHeading } from './section-headings';
import type { SourceLink } from './types';

const REPO_BASE_URL = 'https://github.com/martinhoite/hoite-dev/blob/master/';

function createSourceUrl(path: string) {
  return `${REPO_BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function SourceLinksList({
  heading = 'Source',
  links,
}: {
  heading?: string;
  links: readonly SourceLink[];
}) {
  return (
    <section className='docs-surface docs-surface--stackable'>
      <DocSectionHeading>{heading}</DocSectionHeading>
      <ul className='source-link-list'>
        {links.map((link) => {
          return (
            <li className='source-link-item' key={link.path}>
              <a
                className='source-link-anchor'
                href={createSourceUrl(link.path)}
                rel='noreferrer'
                target='_blank'
              >
                <span className='source-link-label'>{link.label}</span>
                <code className='source-link-path'>{link.path}</code>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
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
