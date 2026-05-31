export type {
  CodeBlockLanguage,
  CodeBlockLanguageAlias,
  CodeBlockNormalizedLanguage,
  CodeBlockPlainTextLanguage,
  CodeBlockProps,
  CodeBlockShikiLanguage,
  CodeBlockTheme,
  CodeBlockThemeMode,
  CodeBlockThemes,
} from './code-block';
export {
  codeBlockShikiThemes,
  codeBlockThemeModes,
  codeBlockVariants,
  createCodeBlockCopyAnnouncement,
  createCodeBlockCopyButtonLabel,
  createCodeBlockVisibleLabel,
  defaultCodeBlockCopiedLabel,
  defaultCodeBlockCopyLabel,
  normalizeCodeBlockLanguage,
  resolveCodeBlockThemes,
  supportedCodeBlockLanguages,
  supportedCodeBlockThemes,
} from './code-block';
export { codeBlockDocs } from './code-block.docs';
export type {
  CodeBlockHighlightResult,
  CodeBlockHighlightStatus,
} from './code-block.highlight';
export { highlightCodeBlock } from './code-block.highlight';
