import { codeToHtml } from 'shiki';

import {
  type CodeBlockLanguage,
  type CodeBlockThemes,
  normalizeCodeBlockLanguage,
  resolveCodeBlockThemes,
} from './code-block';

export type CodeBlockHighlightStatus = 'highlighted' | 'plain';

export type CodeBlockHighlightResult = {
  html: string | null;
  language: string;
  status: CodeBlockHighlightStatus;
};

export async function highlightCodeBlock(
  code: string,
  language: CodeBlockLanguage | string,
  themes?: Partial<CodeBlockThemes>,
): Promise<CodeBlockHighlightResult> {
  const normalizedLanguage = normalizeCodeBlockLanguage(language);
  const resolvedThemes = resolveCodeBlockThemes(themes);

  try {
    const html = await codeToHtml(code, {
      defaultColor: false,
      lang: normalizedLanguage,
      themes: resolvedThemes,
    });

    return {
      html,
      language: normalizedLanguage,
      status: 'highlighted',
    };
  } catch {
    return {
      html: null,
      language: normalizedLanguage,
      status: 'plain',
    };
  }
}
