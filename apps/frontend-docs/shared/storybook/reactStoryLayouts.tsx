import { createElement, type ReactNode } from 'react';

import { frontendDocsStoryLayoutClasses } from './storyLayoutClasses.ts';

type StoryStackProps = {
  children: ReactNode;
  className?: string;
};

type StoryInfoPanelProps = {
  children: ReactNode;
  className?: string;
};

type StoryPlaygroundSnippetProps = {
  children: ReactNode;
};

type StoryPlaygroundContentProps = StoryStackProps & {
  split?: boolean;
};

function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames
    .filter((className) => className !== undefined && className.length > 0)
    .join(' ');
}

export function StoryStack({ children, className }: StoryStackProps) {
  return createElement(
    'div',
    { className: joinClassNames(frontendDocsStoryLayoutClasses.stack, className) },
    children,
  );
}

export function StoryInfoPanel({ children, className }: StoryInfoPanelProps) {
  return createElement(
    'div',
    { className: joinClassNames(frontendDocsStoryLayoutClasses.infoPanel, className) },
    children,
  );
}

export function StoryPlayground({ children, className }: StoryStackProps) {
  return createElement(
    'div',
    { className: joinClassNames(frontendDocsStoryLayoutClasses.playground, className) },
    children,
  );
}

export function StoryPlaygroundContent({
  children,
  className,
  split = false,
}: StoryPlaygroundContentProps) {
  return createElement(
    'div',
    {
      className: joinClassNames(
        frontendDocsStoryLayoutClasses.playgroundContent,
        split ? frontendDocsStoryLayoutClasses.playgroundContentSplit : undefined,
        className,
      ),
    },
    children,
  );
}

export function StoryPlaygroundPreview({ children, className }: StoryStackProps) {
  return createElement(
    'div',
    { className: joinClassNames(frontendDocsStoryLayoutClasses.playgroundPreview, className) },
    children,
  );
}

export function StoryPlaygroundSnippet({ children }: StoryPlaygroundSnippetProps) {
  return createElement('div', { className: frontendDocsStoryLayoutClasses.snippetPanel }, children);
}
