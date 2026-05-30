import { cva } from 'class-variance-authority';
import type { BundledLanguage, BundledTheme } from 'shiki';
import { bundledThemesInfo } from 'shiki';

export const codeBlockThemeModes = ['light', 'dark'] as const;

export type CodeBlockThemeMode = (typeof codeBlockThemeModes)[number];
export type CodeBlockTheme = BundledTheme;
export type CodeBlockThemes = Readonly<Record<CodeBlockThemeMode, CodeBlockTheme>>;
export type CodeBlockPlainTextLanguage = 'text' | 'plaintext' | 'txt' | 'plain';
export type CodeBlockLanguageAlias = 'terminal' | 'url';
export type CodeBlockShikiLanguage = BundledLanguage | CodeBlockPlainTextLanguage;
export type CodeBlockNormalizedLanguage = BundledLanguage | 'text';
export type CodeBlockLanguage = CodeBlockShikiLanguage | CodeBlockLanguageAlias;

export const supportedCodeBlockLanguages = [
  'plain',
  'plaintext',
  'text',
  'txt',
  'bash',
  'sh',
  'shell',
  'zsh',
  'ts',
  'tsx',
  'typescript',
  'js',
  'jsx',
  'javascript',
  'json',
  'jsonc',
  'html',
  'css',
  'scss',
  'md',
  'mdx',
  'yaml',
  'yml',
  'graphql',
  'sql',
  'vue',
  'xml',
  'diff',
  'url',
  'terminal',
] as const satisfies readonly CodeBlockLanguage[];

export const supportedCodeBlockThemes = Object.freeze(
  bundledThemesInfo.map((theme) => theme.id),
) as readonly CodeBlockTheme[];

export const codeBlockShikiThemes = {
  dark: 'dark-plus',
  light: 'light-plus',
} as const satisfies CodeBlockThemes;

export type CodeBlockProps = {
  code: string;
  language: CodeBlockLanguage;
  label?: string;
  showCopy?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  themes?: Partial<CodeBlockThemes>;
};

export const defaultCodeBlockCopyLabel = 'Copy code';
export const defaultCodeBlockCopiedLabel = 'Copied';

const languageAliasMap = {
  plain: 'text',
  plaintext: 'text',
  shell: 'bash',
  terminal: 'bash',
  txt: 'text',
  url: 'text',
} as const satisfies Record<string, CodeBlockNormalizedLanguage>;

const supportedCodeBlockLanguageMap = {
  plain: 'text',
  plaintext: 'text',
  text: 'text',
  txt: 'text',
  bash: 'bash',
  sh: 'sh',
  shell: 'bash',
  zsh: 'zsh',
  ts: 'ts',
  tsx: 'tsx',
  typescript: 'typescript',
  js: 'js',
  jsx: 'jsx',
  javascript: 'javascript',
  json: 'json',
  jsonc: 'jsonc',
  html: 'html',
  css: 'css',
  scss: 'scss',
  md: 'md',
  mdx: 'mdx',
  yaml: 'yaml',
  yml: 'yaml',
  graphql: 'graphql',
  sql: 'sql',
  vue: 'vue',
  xml: 'xml',
  diff: 'diff',
  url: 'text',
  terminal: 'bash',
} as const satisfies Record<
  (typeof supportedCodeBlockLanguages)[number],
  CodeBlockNormalizedLanguage
>;

export const codeBlockVariants = cva('code-block code-block--with-header');

function trimToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  return trimmedValue;
}

export function normalizeCodeBlockLanguage(
  language: CodeBlockLanguage | string,
): CodeBlockNormalizedLanguage {
  const trimmedLanguage = trimToUndefined(language) ?? 'text';
  const normalizedLanguage = trimmedLanguage.toLowerCase();
  const aliasedLanguage = languageAliasMap[normalizedLanguage as keyof typeof languageAliasMap];
  const resolvedLanguage = aliasedLanguage ?? normalizedLanguage;

  if (resolvedLanguage in supportedCodeBlockLanguageMap) {
    return supportedCodeBlockLanguageMap[
      resolvedLanguage as keyof typeof supportedCodeBlockLanguageMap
    ];
  }

  return 'text';
}

export function resolveCodeBlockThemes(themes?: Partial<CodeBlockThemes>): CodeBlockThemes {
  return {
    dark: themes?.dark ?? codeBlockShikiThemes.dark,
    light: themes?.light ?? codeBlockShikiThemes.light,
  };
}

export function createCodeBlockVisibleLabel({
  label,
  language,
}: Pick<CodeBlockProps, 'label' | 'language'>): string {
  return trimToUndefined(label) ?? trimToUndefined(language) ?? 'Text';
}

function normalizeCodeBlockCopyLabel(value: string | undefined, fallbackValue: string): string {
  return trimToUndefined(value) ?? fallbackValue;
}

export function createCodeBlockCopyButtonLabel({
  copiedLabel,
  copyLabel,
  isCopied,
}: Pick<CodeBlockProps, 'copiedLabel' | 'copyLabel'> & {
  isCopied: boolean;
}): string {
  const resolvedCopiedLabel = normalizeCodeBlockCopyLabel(copiedLabel, defaultCodeBlockCopiedLabel);
  const resolvedCopyLabel = normalizeCodeBlockCopyLabel(copyLabel, defaultCodeBlockCopyLabel);

  if (isCopied) {
    return resolvedCopiedLabel;
  }

  return resolvedCopyLabel;
}

export function createCodeBlockCopyAnnouncement({
  copiedLabel,
  copyLabel,
  visibleLabel,
}: Pick<CodeBlockProps, 'copiedLabel' | 'copyLabel'> & {
  visibleLabel?: string;
}): {
  copiedAnnouncement: string;
  copiedButtonAriaLabel: string;
  copiedButtonLabel: string;
  copyButtonAriaLabel: string;
  copyButtonLabel: string;
} {
  const resolvedCopiedLabel = normalizeCodeBlockCopyLabel(copiedLabel, defaultCodeBlockCopiedLabel);
  const resolvedCopyLabel = normalizeCodeBlockCopyLabel(copyLabel, defaultCodeBlockCopyLabel);
  const normalizedVisibleLabel = trimToUndefined(visibleLabel);
  const descriptor =
    normalizedVisibleLabel === undefined ? 'code' : `${normalizedVisibleLabel} code`;

  return {
    copiedAnnouncement: `${resolvedCopiedLabel} ${descriptor} to clipboard.`,
    copiedButtonAriaLabel: `${resolvedCopiedLabel} ${descriptor}`,
    copiedButtonLabel: resolvedCopiedLabel,
    copyButtonAriaLabel: `${resolvedCopyLabel} ${descriptor}`,
    copyButtonLabel: resolvedCopyLabel,
  };
}
