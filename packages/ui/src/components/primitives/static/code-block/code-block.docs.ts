type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export const codeBlockDocs = {
  argTypeDescriptions: {
    code: 'Raw source string rendered in the code block and copied by the copy action.',
    copiedLabel: 'Visible label shown after a successful copy action.',
    copyLabel: 'Visible label shown for the default copy action.',
    label:
      'Optional visible header label. When omitted, the `language` value becomes the visible header fallback.',
    language:
      'Required Shiki-backed language value. The header is always rendered, and when `label` is omitted the `language` value is used as the visible header text.',
    showCopy: 'Shows the compact copy action in the header and announces successful copies.',
    themes:
      'Optional light and dark Shiki theme overrides. Omitted modes fall back to the shared `light-plus` and `dark-plus` default pair.',
  },
  description: [
    'CodeBlock defines the shared shell, header, copy affordance, and overflow behavior for reusable code samples in the Hoite Dev design system.',
    'Syntax highlighting is powered by Shiki through shared framework-agnostic utilities in `@hoite-dev/ui`, while React and Vue own the runtime rendering and clipboard behavior.',
  ],
  sections: [
    {
      items: [
        'Use [code]code[/code] as the raw source input and [code]language[/code] for Shiki highlighting.',
        'Use [code]label[/code] when the visible header text should read differently from the highlight language, such as [code]TypeScript[/code] with [code]language="ts"[/code].',
        'Use [code]themes[/code] only when a surface needs to override the shared light and dark Shiki defaults.',
        'Set [code]showCopy[/code] to expose the compact header action that copies the raw [code]code[/code] string.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'The copy action changes its visible label after success and announces the copied state through an implementation-level live region.',
        'Code remains selectable, and long lines stay horizontally scrollable instead of wrapping unpredictably.',
        'Supported passthrough attributes stay narrow: [code]id[/code], [code]title[/code], [code]aria-label[/code], [code]aria-labelledby[/code], and deliberate [code]data-*[/code] attributes on the outer shell.',
      ],
      title: 'Accessibility Notes',
    },
    {
      paragraphs: [
        'The shared highlighting utility uses Shiki with `light-plus` and `dark-plus` by default, matching the familiar VS Code standard light and dark pair while still emitting dual-theme CSS variables that follow the existing [code]data-theme[/code] model.',
        'Language values are typed against Shiki bundle unions, and the shared theme export mirrors the full bundled Shiki theme set so docs and playground controls stay aligned with the real runtime options.',
        'If highlighting fails or the language is unsupported, framework components fall back to safely rendered plain code without changing the copy source.',
      ],
      title: 'Highlighting Notes',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared styling contract',
      path: 'packages/ui/src/components/primitives/static/code-block/code-block.ts',
    },
    {
      label: 'Shared highlighting utility',
      path: 'packages/ui/src/components/primitives/static/code-block/code-block.highlight.ts',
    },
  ],
  storyDescriptions: {
    example:
      'Base code block example without the copy action, using a required language value and the shared header treatment.',
    playground:
      'Interactive playground for editing the code, language label, and copy action while previewing the shared CodeBlock shell.',
    longCodeOverflow:
      'Long lines keep horizontal overflow inside the code area instead of wrapping unpredictably.',
    withCopyAction:
      'Copy action is placed in the header, copies the raw `code` string, and keeps the code content selectable.',
  },
  title: 'CodeBlock',
} as const;
