import { frontendDocsStoryLayoutClasses } from '@hoite-dev/frontend-docs-shared/storybook';
import { Source } from '@storybook/addon-docs/blocks';
import { type ReactElement, useEffect, useState } from 'react';
import { ensure, ThemeProvider, themes } from 'storybook/theming';

type StorybookSourceSnippetProps = {
  code: string;
};

const sourceSnippetThemeClassName = 'frontend-docs-source-snippet';
const sourceSnippetStyles = `
.frontend-docs-source-snippet .docblock-source,
.frontend-docs-source-snippet .docblock-source pre.prismjs {
  background: var(--color-bg-surface-raised) !important;
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

export function StorybookSourceSnippet({ code }: StorybookSourceSnippetProps): ReactElement {
  const [previewTheme, setPreviewTheme] = useState(readPreviewTheme);
  const isDarkTheme = previewTheme === 'dark';
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

  return (
    <div className={frontendDocsStoryLayoutClasses.snippetPanel}>
      <ThemeProvider theme={ensure(sourceTheme)}>
        <div className={sourceSnippetThemeClassName}>
          <style>{sourceSnippetStyles}</style>
          <Source code={code} copyable dark={isDarkTheme} language='tsx' />
        </div>
      </ThemeProvider>
    </div>
  );
}
