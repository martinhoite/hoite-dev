type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

type StoryDescriptions = {
  allIcons: string;
  playground: string;
  rotations: string;
  sizes: string;
  variants: string;
};

export const iconDocs = {
  argTypeDescriptions: {
    name: 'Selects which shared icon definition the component renders.',
    rotation:
      'Rotates the rendered icon in fixed increments without changing the underlying asset.',
    size: 'Controls the token-backed icon dimensions.',
    variant: 'Controls which semantic icon color token is applied.',
  },
  description: [
    'Icon defines the shared static SVG contract across the Hoite Dev design system.',
    'These docs focus on supported names, token-backed sizes, visual variants, and the accessibility rules that framework implementations follow.',
  ],
  sections: [
    {
      items: [
        'Use `name`, `size`, `rotation`, and `variant` as the main visual API.',
        'Keep interactive icon-only behavior in `IconButton`; `Icon` stays a static SVG primitive.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'Meaningful icons should receive an accessible name with `label` or `aria-label`.',
        'Icons without `label` or `aria-label` are decorative and hidden from assistive technology.',
        'If both are provided, `label` wins.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Storybook controls focus on the visual API: `name`, `size`, `rotation`, and `variant`.',
        'Narrow passthrough attributes such as `id`, `title`, `role`, `aria-label`, and deliberate `data-*` attributes are supported but not exposed as noisy playground controls.',
      ],
      title: 'Controls Guidance',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared styling contract',
      path: 'packages/ui/src/components/primitives/static/icon/icon.ts',
    },
  ],
  storyDescriptions: {
    allIcons:
      'Supported icon names rendered with their default size and default visual treatment in the implementation showcase.',
    playground: [
      'Use `name`, `size`, `rotation`, and `variant` as the main visual Icon API in this playground.',
      '',
      'For app code, meaningful icons should also receive an accessible name with `label` or `aria-label`.',
      '',
      'The rendered SVG also supports deliberate passthrough attributes when needed:',
      '',
      '- `id`',
      '- `title`',
      '- `role`',
      '- `aria-label`',
      '- `data-*` attributes',
    ].join('\n'),
    rotations:
      'Fixed-angle rotation options shown with the chevron icon so directional changes stay legible.',
    sizes:
      'Token-backed icon size scale shown with the same icon name to isolate dimensional differences.',
    variants:
      'Semantic icon color variants shown against the surface treatment each variant expects.',
  } satisfies StoryDescriptions,
  title: 'Icon',
} as const;
