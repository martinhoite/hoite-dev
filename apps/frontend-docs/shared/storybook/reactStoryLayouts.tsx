import { createElement, type ReactNode } from 'react';

const stackBaseClassName = 'grid gap-4';
const infoPanelBaseClassName =
  'rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4';

type StoryStackProps = {
  children: ReactNode;
  className?: string;
};

type StoryInfoPanelProps = {
  children: ReactNode;
  className?: string;
};

function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames
    .filter((className) => className !== undefined && className.length > 0)
    .join(' ');
}

export function StoryStack({ children, className }: StoryStackProps) {
  return createElement(
    'div',
    { className: joinClassNames(stackBaseClassName, className) },
    children,
  );
}

export function StoryInfoPanel({ children, className }: StoryInfoPanelProps) {
  return createElement(
    'div',
    { className: joinClassNames(infoPanelBaseClassName, className) },
    children,
  );
}
