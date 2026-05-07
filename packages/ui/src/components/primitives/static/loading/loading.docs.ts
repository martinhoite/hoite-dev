type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

type StoryDescriptions = {
  circularProgressShowcase: string;
  loaderShowcase: string;
  playground: string;
  progressShowcase: string;
};

export const loadingDocs = {
  argTypeDescriptions: {
    ariaLabel:
      'Accessible label used when no visible label is rendered. Keep this set for unlabeled Loader, Progress, or CircularProgress use cases.',
    color: 'Applies the shared semantic loading color contract.',
    component: 'Selects which loading primitive is rendered in loading playground examples.',
    label:
      'Visible label text rendered for Progress and CircularProgress. The label connects to the hidden or visible native progress element.',
    max: 'Maximum determinate value. Invalid values are normalized in shared logic.',
    showValue:
      'When true, CircularProgress renders a visible percentage text for determinate states.',
    size: 'Applies the shared loading size contract.',
    valueDisplay:
      'Controls whether CircularProgress shows determinate text as percent or value/max steps.',
    value: 'Current determinate value. Leave undefined for an indeterminate loading state.',
  },
  description: [
    'Loading groups the shared feedback primitives for indeterminate and determinate progress states in the Hoite Dev design system.',
    'These docs focus on shared size and color variants, normalization behavior, and consistent accessibility expectations across framework wrappers.',
  ],
  sections: [
    {
      items: [
        'Use `Loader` for non-quantified wait states and `Progress` or `CircularProgress` when a numeric completion value is meaningful.',
        'All three primitives share the same `size` and `color` model so loading states stay visually consistent.',
        'Progress primitives normalize invalid `max` and `value` input and clamp out-of-range values before rendering.',
        'Indeterminate states include built-in motion; reduced-motion settings disable those animations.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'Provide a visible `label` for `Progress` and `CircularProgress` when possible. Wrappers connect labels to native progress semantics.',
        'For unlabeled usage, pass `aria-label` or `aria-labelledby` so assistive technologies announce purpose and state.',
        'Progress and CircularProgress keep a native `<progress>` element as the semantic source while custom visuals remain `aria-hidden`.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Use one curated Loading docs entry that shows Loader, Progress, and CircularProgress side by side.',
        'Keep controls focused on meaningful loading behavior while passthrough attributes stay native (`aria-*`, `id`, `data-*`).',
      ],
      title: 'Controls Guidance',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared loading contract',
      path: 'packages/ui/src/components/primitives/static/loading/index.ts',
    },
    {
      label: 'Shared loading normalization',
      path: 'packages/ui/src/components/primitives/static/loading/progress.normalize.ts',
    },
  ],
  storyDescriptions: {
    circularProgressShowcase:
      'Circular progress examples across indeterminate and determinate states, including normalized behavior and visible value output.',
    loaderShowcase:
      'Loader examples across supported size and color variants for non-quantified loading states.',
    playground:
      'The curated Loading docs entry keeps Loader, Progress, and CircularProgress together for quick comparison.',
    progressShowcase:
      'Progress examples across determinate and indeterminate behavior using shared normalization and connected label semantics.',
  } satisfies StoryDescriptions,
  title: 'Loading',
} as const;
