import { createElement, type ReactNode } from 'react';

import { DesignSystemPageIntro } from './DesignSystemPageIntro';
import type { ComponentDocs } from './docsTypes';
import { renderDocsSections } from './renderDocsSections';
import { SourceLinksList } from './SourceLinksList';
import type { SourceLink } from './sourceLinks';

const pageClassName = 'px-4 py-6 md:px-6 md:py-8';
const contentClassName = 'mx-auto grid w-full max-w-5xl gap-8';
const sectionClassName = 'grid gap-4';

type DocsSectionBlockProps = {
  children: ReactNode;
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
      createElement(DocsSectionBlock, {
        children: examples,
        key: 'examples',
        title: 'Examples',
      }),
      createElement(DocsSectionBlock, {
        children: controls,
        key: 'controls',
        title: 'Controls',
      }),
    ]),
  ]);
}
