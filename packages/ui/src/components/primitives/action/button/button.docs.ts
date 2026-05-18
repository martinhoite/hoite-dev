type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

type StoryDescriptions = {
  iconPatterns: string;
  loading: string;
  playground: string;
  sizes: string;
  states: string;
  variants: string;
};

export const buttonDocs = {
  argTypeDescriptions: {
    disabled:
      'Uses native disabled button behavior. Loading buttons are also disabled to prevent duplicate actions.',
    isLoading:
      'Shows a decorative Loader inside the button, sets aria-busy, and disables the native button.',
    leadingIcon: 'Renders an existing Icon primitive before the visible button content.',
    loadingLabel:
      'Visible replacement text shown while loading. Omit it to keep the normal visible content during loading.',
    preventLoadingShrink:
      'Prevents the button from shrinking while loading by using its last non-loading width as a minimum width. The button can still grow if loading content is wider.',
    size: 'Controls the token-backed padding, radius, and label typography.',
    trailingIcon: 'Renders an existing Icon primitive after the visible button content.',
    variant: 'Controls the semantic Button visual treatment.',
  },
  description: [
    'Button defines the native action primitive for the Hoite Dev design system.',
    'These docs focus on visual variants, sizes, icon patterns, loading behavior, and native button accessibility across framework implementations.',
  ],
  sections: [
    {
      items: [
        'Use Button for native button actions, not navigation.',
        'Use [code]variant[/code] and [code]size[/code] as the main visual API.',
        'Use [code]leadingIcon[/code] and [code]trailingIcon[/code] when an action benefits from a small supporting icon.',
        'Use IconButton for icon-only actions.',
        'Use [code]isLoading[/code] when an action takes long enough that users benefit from visible pending feedback. For very quick interactions, a loading state can feel heavier than the action itself.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'Button renders a native [code]<button>[/code] and defaults to [code]type="button"[/code].',
        'Button should have visible label content. Icon-only actions belong to IconButton.',
        'Loading buttons set [code]aria-busy="true"[/code] and keep or replace visible label text instead of relying on hidden labels.',
        'The Loader rendered inside Button is decorative and hidden from assistive technology.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Storybook controls focus on the component API: [code]variant[/code], [code]size[/code], [code]leadingIcon[/code], [code]trailingIcon[/code], [code]isLoading[/code], [code]loadingLabel[/code], [code]preventLoadingShrink[/code], and [code]disabled[/code].',
        'Native button attributes, events, framework class passthrough, [code]aria-*[/code], and [code]data-*[/code] remain supported without becoming noisy controls.',
      ],
      title: 'Controls Guidance',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared Button contract',
      path: 'packages/ui/src/components/primitives/action/button/button.ts',
    },
  ],
  storyDescriptions: {
    iconPatterns:
      'Leading, trailing, and leading-and-trailing examples using the existing Icon primitive inside labeled native buttons.',
    loading:
      'Loading examples show decorative Loader placement, visible loading labels, disabled native button behavior, and a two second interaction cycle.',
    playground:
      'Use `variant`, `size`, icon props, loading props, and native disabled state as the main Button API in this playground.',
    sizes:
      'Token-backed Button sizes shown with the same action label to isolate padding, radius, and type differences.',
    states:
      'Forced hover, focus-visible, pressed, disabled, and loading state examples across Button treatments.',
    variants: 'Primary and secondary Button treatments shown across light and dark theme surfaces.',
  } satisfies StoryDescriptions,
  title: 'Button',
} as const;
