import { createElement } from 'react';

import { createSourceUrl, type SourceLink } from './sourceLinks';

const sourceListClassName = 'grid gap-3';
const sourceItemsClassName = '!m-0 grid gap-1 !pl-5';

export function SourceLinksList({ links }: { links: readonly SourceLink[] }) {
  return createElement('section', { className: sourceListClassName }, [
    createElement('h2', { className: 'm-0', key: 'heading' }, 'Source'),
    createElement(
      'ul',
      {
        className: sourceItemsClassName,
        key: 'list',
      },
      links.map((link) =>
        createElement('li', { key: link.path }, [
          createElement(
            'a',
            {
              href: createSourceUrl(link.path),
              key: 'link',
              rel: 'noreferrer',
              target: '_blank',
            },
            link.label,
          ),
          ' ',
          createElement('code', { key: 'path' }, link.path),
        ]),
      ),
    ),
  ]);
}
