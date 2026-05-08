export const frontendDocsCoreConfig = {
  allowedHosts: true,
} as const;

export const frontendDocsDefaultAddons = [
  '@storybook/addon-docs',
  '@storybook/addon-a11y',
] as const;

export const frontendDocsStoryGlobs = ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'];

type FrontendDocsViteOptions = {
  host: string;
  aliases?: Record<string, string>;
  plugins: unknown[];
};

export function createFrontendDocsViteOptions({ aliases, host, plugins }: FrontendDocsViteOptions) {
  return {
    plugins,
    resolve:
      aliases === undefined
        ? undefined
        : {
            alias: aliases,
          },
    server: {
      host,
      allowedHosts: true,
    },
  };
}
