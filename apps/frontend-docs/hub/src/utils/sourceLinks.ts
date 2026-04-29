const REPO_BASE_URL = 'https://github.com/martinhoite/hoite-dev/blob/main/';

type SourceLink = {
  label: string;
  path: string;
};

function createSourceUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');

  return `${REPO_BASE_URL}${normalizedPath}`;
}

export function createSourceSection(links: SourceLink[]): string {
  const lines = ['## Source', ''];

  for (const link of links) {
    lines.push(`- [${link.label}](${createSourceUrl(link.path)})  `);
    lines.push(`  \`${link.path}\``);
  }

  return lines.join('\n');
}
