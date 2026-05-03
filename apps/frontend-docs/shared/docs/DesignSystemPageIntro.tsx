import { createElement } from 'react';

const introClassName = 'grid gap-4';
const descriptionClassName = 'grid gap-3';

export function DesignSystemPageIntro({
  description,
  title,
}: {
  description: readonly string[];
  title: string;
}) {
  return createElement('header', { className: introClassName }, [
    createElement('h1', { className: 'm-0', key: 'title' }, title),
    createElement(
      'div',
      { className: descriptionClassName, key: 'description' },
      description.map((paragraph) =>
        createElement('p', { className: 'm-0', key: paragraph }, paragraph),
      ),
    ),
  ]);
}
