import { frontendDocsStoryLayoutClasses } from './storyLayoutClasses.ts';

export function withStoryStack(content: string): string {
  return `
    <div class="${frontendDocsStoryLayoutClasses.stack}">
${content}
    </div>
  `;
}

export function withStoryPlayground(content: string): string {
  return `
    <div class="${frontendDocsStoryLayoutClasses.playground}">
${content}
    </div>
  `;
}

export function createVueStoryPreview(content: string, className = ''): string {
  return `
      <div class="${frontendDocsStoryLayoutClasses.playgroundPreview} ${className}">
${content}
      </div>
  `;
}

export function withVueStoryPlaygroundContent(content: string): string {
  return `
      <div
        class="${frontendDocsStoryLayoutClasses.playgroundContent} ${frontendDocsStoryLayoutClasses.playgroundContentSplit}"
      >
${content}
      </div>
  `;
}

export function createVueStorySourcePanel(
  highlightedSnippetExpression = 'highlightedSnippet',
): string {
  return `
      <div class="${frontendDocsStoryLayoutClasses.snippetPanel}">
        <div class="${frontendDocsStoryLayoutClasses.snippetBody}">
          <pre class="${frontendDocsStoryLayoutClasses.snippetPre}"><code class="${frontendDocsStoryLayoutClasses.snippetCode}" v-html="${highlightedSnippetExpression}"></code></pre>
          <button class="${frontendDocsStoryLayoutClasses.snippetCopyButton}" type="button" @click="copySnippet">
            <svg aria-hidden="true" class="size-3.5" viewBox="0 0 16 16">
              <path fill="currentColor" d="M5 1.5h6A1.5 1.5 0 0 1 12.5 3v8A1.5 1.5 0 0 1 11 12.5H5A1.5 1.5 0 0 1 3.5 11V3A1.5 1.5 0 0 1 5 1.5Zm0 1A.5.5 0 0 0 4.5 3v8a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H5Z" />
              <path fill="currentColor" d="M2 4.5h1v7A1.5 1.5 0 0 0 4.5 13H10v1H4.5A2.5 2.5 0 0 1 2 11.5v-7Z" />
            </svg>
            {{ copyButtonLabel }}
          </button>
        </div>
      </div>
  `;
}
