import { createElement, type ReactNode } from 'react';

import { DesignSystemPageIntro } from './DesignSystemPageIntro';
import type { ComponentDocs } from './docsTypes';
import { renderDocsSections } from './renderDocsSections';
import { SourceLinksList } from './SourceLinksList';
import type { SourceLink } from './sourceLinks';

const pageClassName = 'py-6 md:py-8';
const contentClassName = 'mx-auto grid w-full min-w-0 max-w-5xl gap-8';
const sectionClassName = 'grid min-w-0 gap-4';
const controlsContentClassName =
  'min-w-0 [&>div]:overflow-x-auto [&_code]:whitespace-normal [&_code]:[overflow-wrap:anywhere]';

type DocsSectionBlockProps = {
  children?: ReactNode;
  title: string;
};

function DocsSectionBlock({ children, title }: DocsSectionBlockProps) {
  return createElement(
    'section',
    { className: sectionClassName },
    createElement('h2', { className: 'm-0' }, title),
    children,
  );
}

export function DesignSystemDocsPage({
  controls,
  docs,
  examples,
  sourceLinks,
}: {
  controls: ReactNode;
  docs: ComponentDocs;
  examples: ReactNode;
  sourceLinks: readonly SourceLink[];
}) {
  return createElement('div', { className: pageClassName }, [
    createElement('div', { className: contentClassName, key: 'content' }, [
      createElement(DesignSystemPageIntro, {
        description: docs.description,
        key: 'intro',
        title: docs.title,
      }),
      createElement(SourceLinksList, {
        key: 'source-links',
        links: sourceLinks,
      }),
      ...renderDocsSections(docs.sections),
      createElement(
        DocsSectionBlock,
        {
          key: 'examples',
          title: 'Examples',
        },
        examples,
      ),
      createElement(
        DocsSectionBlock,
        {
          key: 'controls',
          title: 'Controls',
        },
        createElement('div', { className: controlsContentClassName }, controls),
      ),
    ]),
  ]);
}
