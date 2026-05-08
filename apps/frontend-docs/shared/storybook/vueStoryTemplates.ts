const storyStackClassName = 'grid gap-4';

export function withStoryStack(content: string): string {
  return `
    <div class="${storyStackClassName}">
${content}
    </div>
  `;
}
