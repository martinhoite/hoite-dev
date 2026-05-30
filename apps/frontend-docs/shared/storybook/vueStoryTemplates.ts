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
  codeExpression = 'snippet',
  languageExpression = "'html'",
  labelExpression = 'undefined',
): string {
  return `
      <div class="${frontendDocsStoryLayoutClasses.snippetPanel}">
        <CodeBlock
          :code="${codeExpression}"
          :label="${labelExpression}"
          :language="${languageExpression}"
          showCopy
        />
      </div>
  `;
}
