import { createElement, type ReactNode } from 'react';

import type { DocsSection } from './docsTypes';

const sectionClassName = 'grid gap-4';
const listClassName = '!m-0 grid !pl-5';

function renderParagraphs(paragraphs: readonly string[] | undefined): ReactNode[] {
  if (!paragraphs) {
    return [];
  }

  return paragraphs.map((paragraph) => createElement('p', { key: paragraph }, paragraph));
}

function renderItems(items: readonly string[] | undefined): ReactNode | null {
  if (!items) {
    return null;
  }

  return createElement(
    'ul',
    {
      className: listClassName,
      key: 'items',
    },
    items.map((item) => createElement('li', { key: item }, item)),
  );
}

function renderDocsSection(section: DocsSection) {
  const children: ReactNode[] = [
    createElement('h2', { className: 'm-0', key: 'title' }, section.title),
    ...renderParagraphs(section.paragraphs),
  ];
  const items = renderItems(section.items);

  if (items) {
    children.push(items);
  }

  return createElement('section', { className: sectionClassName, key: section.title }, children);
}

export function renderDocsSections(sections: readonly DocsSection[]) {
  return sections.map(renderDocsSection);
}
