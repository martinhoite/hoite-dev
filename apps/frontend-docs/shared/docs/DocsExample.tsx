import { createElement, type ReactNode } from 'react';

const exampleClassName = 'grid min-w-0 gap-1';
const canvasWrapperClassName =
  'min-w-0 [&>:first-child]:!mt-0 [&_.docs-story]:min-w-0 [&_.sbdocs-preview]:my-0 [&_.sbdocs-preview]:min-w-0 [&_.sbdocs-preview]:overflow-hidden [&_.sbdocs-preview]:rounded-xl';

type StoryHeadingLike = {
  name?: string;
  storyName?: string;
};

export function DocsExample({
  children,
  story,
}: {
  children?: ReactNode;
  story: StoryHeadingLike;
}) {
  const title = story.name ?? story.storyName ?? 'Example';

  return createElement('div', { className: exampleClassName }, [
    createElement('h3', { className: 'm-0', key: 'heading' }, title),
    createElement('div', { className: canvasWrapperClassName, key: 'canvas' }, children),
  ]);
}
