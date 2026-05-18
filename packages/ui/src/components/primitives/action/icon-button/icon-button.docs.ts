type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

type StoryDescriptions = {
  loading: string;
  playground: string;
  sizes: string;
  states: string;
  variants: string;
};

export const iconButtonDocs = {
  argTypeDescriptions: {
    'aria-label':
      'Native accessible name for icon-only actions. Required unless aria-labelledby is supplied.',
    'aria-labelledby':
      'References visible text that names the icon-only action. Required unless aria-label is supplied.',
    disabled:
      'Uses native disabled button behavior. Loading icon buttons are also disabled to prevent duplicate actions.',
    icon: 'Renders an existing Icon primitive as the only visible action content.',
    isLoading:
      'Replaces the icon with a decorative Loader, sets aria-busy, and disables the native button.',
    size: 'Controls the token-backed square size and radius.',
    variant: 'Controls the semantic IconButton visual treatment.',
  },
  description: [
    'IconButton defines the icon-only native action primitive for the Hoite Dev design system.',
    'Use it when the action is already clear from context or needs a compact control, and provide an explicit accessible name.',
  ],
  sections: [
    {
      items: [
        'Use IconButton for icon-only native button actions, not navigation.',
        'Use Button when the action has visible label content.',
        'Use [code]icon[/code], [code]variant[/code], and [code]size[/code] as the main visual API.',
        'Use [code]isLoading[/code] when an icon-only action needs pending feedback. Consumers can update [code]aria-label[/code] while loading when the accessible name should change.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'IconButton renders a native [code]<button>[/code] and defaults to [code]type="button"[/code].',
        'IconButton requires an accessible name through [code]aria-label[/code] or [code]aria-labelledby[/code].',
        'Loading icon buttons set [code]aria-busy="true"[/code] and replace the icon with a decorative Loader.',
        'IconButton does not use [code]loadingLabel[/code] because it does not render visible text.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Storybook controls focus on the component API: [code]icon[/code], [code]variant[/code], [code]size[/code], [code]isLoading[/code], [code]disabled[/code], and the native accessible naming attributes.',
        'Native button attributes, events, framework class passthrough, [code]aria-*[/code], and [code]data-*[/code] remain supported without becoming noisy controls.',
      ],
      title: 'Controls Guidance',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared IconButton contract',
      path: 'packages/ui/src/components/primitives/action/icon-button/icon-button.ts',
    },
  ],
  storyDescriptions: {
    loading:
      'Interactive loading shows the icon swapping to the existing decorative Loader while preserving native disabled and aria-busy behavior.',
    playground:
      'Use `icon`, `variant`, `size`, loading state, native disabled state, and accessible naming attributes as the main IconButton API in this playground.',
    sizes:
      'Token-backed IconButton sizes shown with the same icon to isolate square size and radius.',
    states:
      'Labeled state examples show default, forced hover, forced focus-visible, forced pressed, disabled, and loading across IconButton treatments.',
    variants:
      'Primary and secondary IconButton treatments shown across light and dark theme surfaces.',
  } satisfies StoryDescriptions,
  title: 'IconButton',
} as const;
