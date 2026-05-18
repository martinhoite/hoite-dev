type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

type StoryDescriptions = {
  appearances: string;
  nativeUsage: string;
  playground: string;
  routerStyling: string;
  states: string;
};

export const linkDocs = {
  argTypeDescriptions: {
    appearance:
      'Controls whether the navigation link uses normal text-link styling or button-like navigation styling.',
    children: 'Visible link content.',
    href: 'Native anchor destination. Framework router links should keep using their own routing props.',
  },
  description: [
    'Link defines the native navigation primitive for the Hoite Dev design system.',
    'It renders a styled anchor and exposes the shared link styling helper for framework router links.',
  ],
  sections: [
    {
      items: [
        'Use Link when you want a styled native [code]<a>[/code].',
        'Use [code]appearance="link"[/code] for normal link styling.',
        'Use [code]appearance="button"[/code] for navigation that should look like a button, such as calls to action.',
        'Use Button for actions and Link for navigation.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'For Next.js and Nuxt app routing, keep using the framework link component.',
        'Apply Hoite Dev link styling to router links through [code]linkVariants[/code].',
        'Hoite Dev does not replace framework routing behavior or expose router-specific props.',
      ],
      title: 'Framework Router Split',
    },
    {
      items: [
        'Link renders a native [code]<a>[/code] and should have visible content.',
        'Native anchor attributes, events, framework class passthrough, [code]aria-*[/code], and [code]data-*[/code] remain supported without becoming noisy controls.',
        'Button-like links keep anchor semantics and do not support button-only behavior such as [code]type[/code], [code]disabled[/code], form submission, or loading state.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Storybook controls focus on the component API: [code]href[/code], [code]appearance[/code], and visible content.',
        'Framework router examples document [code]linkVariants[/code] usage without adding Next.js or Nuxt dependencies.',
      ],
      title: 'Controls Guidance',
    },
  ] satisfies readonly DocsSection[],
  sourceLinks: [
    {
      label: 'Shared Link contract',
      path: 'packages/ui/src/components/primitives/action/link/link.ts',
    },
  ],
  storyDescriptions: {
    appearances: 'Normal text-link and button-like navigation appearances rendered as anchors.',
    nativeUsage: 'Native Link usage examples for inline and button-like navigation.',
    playground:
      'Use `href`, `appearance`, and visible content as the main Link API in this playground.',
    routerStyling:
      'Framework router examples keep Next.js and Nuxt routing owned by their frameworks while applying Hoite Dev styling with `linkVariants`.',
    states: 'Forced hover, focus-visible, active, and visited states across Link appearances.',
  } satisfies StoryDescriptions,
  title: 'Link',
} as const;
