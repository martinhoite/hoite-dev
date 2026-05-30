import type { CodeBlockLanguage } from '@hoite-dev/ui';
import { CodeBlock } from '@hoite-dev/ui-react';
import type { ReactElement } from 'react';

import { frontendDocsStoryLayoutClasses } from './storyLayoutClasses.ts';

type StorybookSourceSnippetProps = {
  code: string;
  copyable?: boolean;
  language?: CodeBlockLanguage;
  panel?: 'none' | 'story';
};

function joinClassNames(...classNames: Array<string | false | undefined>): string {
  return classNames
    .filter((className) => typeof className === 'string' && className.length > 0)
    .join(' ');
}

export function StorybookSourceSnippet({
  code,
  copyable = true,
  language = 'tsx',
  panel = 'story',
}: StorybookSourceSnippetProps): ReactElement {
  return (
    <div
      className={joinClassNames(
        'sb-unstyled',
        panel === 'story' && frontendDocsStoryLayoutClasses.snippetContainer,
        panel === 'story' && frontendDocsStoryLayoutClasses.snippetPanel,
      )}
    >
      <CodeBlock code={code} language={language} showCopy={copyable} />
    </div>
  );
}
