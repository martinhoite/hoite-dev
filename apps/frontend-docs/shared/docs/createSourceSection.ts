import { createSourceUrl, type SourceLink } from './sourceLinks';

export function createSourceSection(links: SourceLink[]): string {
  const lines = ['## Source', ''];

  for (const link of links) {
    lines.push(`- [${link.label}](${createSourceUrl(link.path)})  `);
    lines.push(`  \`${link.path}\``);
  }

  return lines.join('\n');
}
