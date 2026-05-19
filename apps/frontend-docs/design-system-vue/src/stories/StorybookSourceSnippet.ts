import { frontendDocsStoryLayoutClasses } from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type ComponentProps,
  type ComponentType,
  createElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { SyntaxHighlighter } from 'storybook/internal/components';
import { ensure, ThemeProvider, themes } from 'storybook/theming';

type StorybookSourceLanguage = ComponentProps<typeof SyntaxHighlighter>['language'];

type StorybookSourceSnippetProps = {
  code: string;
  copyable?: boolean;
  language?: StorybookSourceLanguage;
  panel?: 'none' | 'story';
};

const sourceSnippetThemeClassName = 'frontend-docs-source-snippet';
const StorybookThemeProvider = ThemeProvider as ComponentType<{
  children?: ReactNode;
  theme: ReturnType<typeof ensure>;
}>;
const sourceSnippetStyles = `
.frontend-docs-source-snippet .docblock-source,
.frontend-docs-source-snippet .docblock-source pre,
.frontend-docs-source-snippet .docblock-source code,
.frontend-docs-source-snippet .docblock-source span {
  font-family: var(--typography-family-code, ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace);
  font-size: 13px;
  line-height: 19px;
}

.frontend-docs-source-snippet .docblock-source button {
  align-items: center;
  display: inline-flex;
  gap: 0.35rem;
}

.frontend-docs-source-snippet .docblock-source button::before {
  background-color: currentColor;
  content: '';
  display: inline-block;
  height: 0.875rem;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M5 1.5h6A1.5 1.5 0 0 1 12.5 3v8A1.5 1.5 0 0 1 11 12.5H5A1.5 1.5 0 0 1 3.5 11V3A1.5 1.5 0 0 1 5 1.5Zm0 1A.5.5 0 0 0 4.5 3v8a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H5Z'/%3E%3Cpath d='M2 4.5h1v7A1.5 1.5 0 0 0 4.5 13H10v1H4.5A2.5 2.5 0 0 1 2 11.5v-7Z'/%3E%3C/svg%3E") center / contain no-repeat;
  width: 0.875rem;
}
`;

function readPreviewTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function joinClassNames(...classNames: Array<string | false | undefined>): string {
  return classNames
    .filter((className) => typeof className === 'string' && className.length > 0)
    .join(' ');
}

export function StorybookSourceSnippet({
  code,
  copyable = true,
  language = 'html',
  panel = 'story',
}: StorybookSourceSnippetProps): ReactElement {
  const [previewTheme, setPreviewTheme] = useState(readPreviewTheme);
  const sourceTheme = previewTheme === 'dark' ? themes.dark : themes.light;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setPreviewTheme(readPreviewTheme());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return createElement(
    'div',
    {
      className: joinClassNames(panel === 'story' && frontendDocsStoryLayoutClasses.snippetPanel),
    },
    createElement(
      StorybookThemeProvider,
      {
        theme: ensure(sourceTheme),
      },
      createElement('div', { className: sourceSnippetThemeClassName }, [
        createElement('style', { key: 'styles' }, sourceSnippetStyles),
        createElement(
          SyntaxHighlighter,
          {
            bordered: true,
            className: 'docblock-source sb-unstyled',
            copyable,
            key: 'source',
            language,
            padded: true,
          },
          code,
        ),
      ]),
    ),
  );
}
