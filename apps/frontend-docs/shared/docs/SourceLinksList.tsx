import { createElement } from 'react';

import { createSourceUrl, type SourceLink } from './sourceLinks';

const sourceListClassName = 'grid gap-3';
const sourceHeadingClassName = 'm-0';
const sourceItemsClassName = '!m-0 grid gap-2 !pl-5';
const sourceItemClassName = 'grid gap-0.5 grid-rows-2';
const sourceLinkClassName = 'content-center';
const sourcePathClassName = 'p-2 !whitespace-normal w-max';

function addSoftBreaks(label: string) {
  return label.replaceAll('/', '/\u200B');
}

export function SourceLinksList({ links }: { links: readonly SourceLink[] }) {
  return createElement('section', { className: sourceListClassName }, [
    createElement('h2', { className: sourceHeadingClassName, key: 'heading' }, 'Source'),
    createElement(
      'ul',
      {
        className: sourceItemsClassName,
        key: 'list',
      },
      links.map((link) =>
        createElement('li', { className: sourceItemClassName, key: link.path }, [
          createElement(
            'a',
            {
              className: sourceLinkClassName,
              href: createSourceUrl(link.path),
              key: 'link',
              rel: 'noreferrer',
              target: '_blank',
            },
            link.label,
          ),
          createElement(
            'code',
            {
              className: sourcePathClassName,
              key: 'path',
            },
            addSoftBreaks(link.path),
          ),
        ]),
      ),
    ),
  ]);
}
