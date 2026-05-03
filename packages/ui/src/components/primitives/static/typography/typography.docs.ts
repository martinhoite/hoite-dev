type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export const typographyDocs = {
  argTypeDescriptions: {
    children:
      'The written content shown by the Typography component. Developers may pass richer content when needed, but it is rendered inside the selected Typography tag.',
    tag: 'Controls the HTML tag used for the rendered text. Leave this set to the default option to use the selected variant tag mapping.',
    variant:
      'Controls the visual text style, such as heading, body text, label text, or caption text.',
  },
  description: [
    'Typography defines the shared text-style contract across the Hoite Dev design system.',
    'These docs focus on supported variants, default tag mappings, and the shared contract that framework implementations follow.',
  ],
  sections: [
    {
      items: [
        'Use `variant`, `tag`, and text content as the main component API.',
        'Leave `tag` on the default option to use the selected variant tag mapping.',
        'Developers may pass richer content when needed, but it is rendered inside the chosen Typography tag.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'Default tag mappings are intentional and should usually be preserved to keep document structure and semantics predictable.',
        'Override `tag` deliberately when the surrounding document outline or inline semantics require it.',
        'Supported passthrough attributes stay narrow: `id`, `title`, `aria-label`, and deliberate `data-*` attributes on the rendered HTML element.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Storybook controls focus on `children`, `variant`, and `tag` because they cover the meaningful visible API.',
        'Non-visual passthrough attributes are documented here instead of exposed as noisy controls.',
      ],
      title: 'Controls Guidance',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared styling contract',
      path: 'packages/ui/src/components/primitives/static/typography/typography.ts',
    },
  ],
  storyDescriptions: {
    playground: [
      'Typography exposes `variant`, `tag`, and `children` as its primary component API.',
      '',
      'The rendered HTML element also supports deliberate passthrough attributes when needed:',
      '',
      '- `id`',
      '- `title`',
      '- `aria-label`',
      '- `data-*` attributes',
    ].join('\n'),
    variants:
      'Curated overview of every supported typography variant and its default HTML tag mapping in the framework implementation.',
  },
  title: 'Typography',
} as const;
