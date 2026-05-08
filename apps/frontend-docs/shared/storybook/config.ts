import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

type FrontendDocsFrameworkName = '@storybook/react-vite' | '@storybook/vue3-vite';
type FrontendDocsAddon = string | { name: string; options?: unknown };
type ViteConfigLike = Record<string, unknown>;

type FrontendDocsRefEntry =
  | {
      title: string;
      url: string;
    }
  | {
      disable: true;
    };

type FrontendDocsStorybookConfigOptions = {
  addons: readonly FrontendDocsAddon[];
  frameworkName: FrontendDocsFrameworkName;
  host: string;
  mainFileUrl: string;
  refs?: () => Record<string, FrontendDocsRefEntry>;
  stories: readonly string[];
  viteAliases?: Record<string, string>;
  viteConfigOverride?: ViteConfigLike;
  vitePlugins: unknown[];
};

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function mergeViteLikeConfig(base: ViteConfigLike, extension: ViteConfigLike): ViteConfigLike {
  const baseResolve = asRecord(base.resolve);
  const extensionResolve = asRecord(extension.resolve);
  const mergedResolve = {
    ...baseResolve,
    ...extensionResolve,
    alias: {
      ...asRecord(baseResolve.alias),
      ...asRecord(extensionResolve.alias),
    },
  };
  const baseServer = asRecord(base.server);
  const extensionServer = asRecord(extension.server);
  const mergedServer = {
    ...baseServer,
    ...extensionServer,
  };
  const baseCss = asRecord(base.css);
  const extensionCss = asRecord(extension.css);
  const basePostcss = asRecord(baseCss.postcss);
  const extensionPostcss = asRecord(extensionCss.postcss);
  const mergedCss = {
    ...baseCss,
    ...extensionCss,
    postcss: {
      ...basePostcss,
      ...extensionPostcss,
      plugins: [...asArray(basePostcss.plugins), ...asArray(extensionPostcss.plugins)],
    },
  };

  return {
    ...base,
    ...extension,
    css: mergedCss,
    plugins: [...asArray(base.plugins), ...asArray(extension.plugins)],
    resolve: mergedResolve,
    server: mergedServer,
  };
}

export function createFrontendDocsStorybookConfig<TConfig>({
  addons,
  frameworkName,
  host,
  mainFileUrl,
  refs,
  stories,
  viteAliases,
  viteConfigOverride,
  vitePlugins,
}: FrontendDocsStorybookConfigOptions): TConfig {
  return {
    addons: [...addons],
    core: frontendDocsCoreConfig,
    framework: {
      name: frameworkName,
      options: {},
    },
    refs,
    stories,
    async viteFinal(existingViteConfig: ViteConfigLike) {
      const currentDirectory = path.dirname(fileURLToPath(mainFileUrl));
      const frontendDocsSharedRoot = path.resolve(currentDirectory, '../../shared');
      const aliasMap: Record<string, string> = {
        '@frontend-docs-shared': frontendDocsSharedRoot,
      };

      if (viteAliases) {
        Object.assign(aliasMap, viteAliases);
      }

      const baseViteConfig = createFrontendDocsViteOptions({
        aliases: aliasMap,
        host,
        plugins: [...vitePlugins],
      });
      const mergedViteConfig = mergeViteLikeConfig(existingViteConfig, baseViteConfig);

      if (viteConfigOverride) {
        return mergeViteLikeConfig(mergedViteConfig, viteConfigOverride);
      }

      return mergedViteConfig;
    },
  } as TConfig;
}
