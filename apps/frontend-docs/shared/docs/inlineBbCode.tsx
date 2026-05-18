import { createElement, type ReactNode } from 'react';

const inlineBbCodeTagNames = ['code', 'url'] as const;
const inlineBbCodeTagPattern = new RegExp(
  `\\[(${inlineBbCodeTagNames.join('|')})(?:=([^\\]]+))?\\]([\\s\\S]*?)\\[/\\1\\]`,
  'g',
);

type InlineBbCodeTagName = (typeof inlineBbCodeTagNames)[number];

type InlineBbCodeRenderer = (
  content: string,
  attribute: string | undefined,
  key: string,
) => ReactNode;

const inlineBbCodeRenderers = {
  code: (content, _attribute, key) => createElement('code', { key }, content),
  url: (content, attribute, key) => {
    if (!attribute) {
      return content;
    }

    return createElement(
      'a',
      {
        href: attribute,
        key,
        rel: 'noreferrer',
        target: '_blank',
      },
      content,
    );
  },
} satisfies Record<InlineBbCodeTagName, InlineBbCodeRenderer>;

export function renderInlineBbCode(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlineBbCodeTagPattern)) {
    const [rawMatch, tagName, attribute, content] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }

    nodes.push(
      inlineBbCodeRenderers[tagName as InlineBbCodeTagName](
        content,
        attribute,
        `${text}-${matchIndex}`,
      ),
    );
    lastIndex = matchIndex + rawMatch.length;
  }

  if (nodes.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
