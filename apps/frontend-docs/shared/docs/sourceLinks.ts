export const REPO_BASE_URL = 'https://github.com/martinhoite/hoite-dev/blob/master/';

export type SourceLink = {
  label: string;
  path: string;
};

export function createSourceUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');

  return `${REPO_BASE_URL}${normalizedPath}`;
}

export function createFrameworkSourceLinks(
  framework: 'React' | 'Vue',
  implementationPath: string,
  storiesPath: string,
): SourceLink[] {
  return [
    {
      label: `${framework} implementation`,
      path: implementationPath,
    },
    {
      label: `${framework} stories`,
      path: storiesPath,
    },
  ];
}
