type DocsSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

type StoryDescriptions = {
  appearances: string;
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
    rel: 'Optional rel tokens. When target="_blank" and rel is omitted, Link defaults rel to noopener noreferrer. Pass rel explicitly, including an empty array, to override that default.',
    target:
      'Optional native anchor target. target="_blank" defaults rel to noopener noreferrer when rel is not explicitly provided.',
  },
  description: [
    'Link defines the native navigation primitive for the Hoite Dev design system.',
    'It renders a styled anchor, keeps native anchor semantics, and exposes the shared link styling helper for framework router links.',
  ],
  sections: [
    {
      items: [
        'Use Link when you want a styled native [code]<a>[/code].',
        'Link does not replace framework-specific link components, which often provide additional routing behavior. If you only need the Hoite Dev styling, use the framework example below.',
        'Use [code]appearance="link"[/code] for normal link styling.',
        'Use [code]appearance="button"[/code] for navigation that should look like a button, such as calls to action.',
      ],
      title: 'Usage Notes',
    },
    {
      items: [
        'Link renders a native [code]<a>[/code].',
        'Use the typed [code]target[/code] and [code]rel[/code] props when you need native anchor passthrough behavior.',
        'Allowed [code]rel[/code] tokens are [code]noopener[/code], [code]noreferrer[/code], [code]nofollow[/code], [code]ugc[/code], and [code]sponsored[/code].',
        '[code]target="_blank"[/code] defaults [code]rel[/code] to [code]noopener noreferrer[/code] when [code]rel[/code] is omitted. This protects links that open a new tab against a common security footgun developers often forget.',
        'Pass [code]rel[/code] explicitly when you need different behavior. Pass an empty [code]rel[/code] array to opt out entirely, or pass one or more allowed tokens to override the default.',
        'Other native anchor attributes, events, framework class passthrough, [code]aria-*[/code], and [code]data-*[/code] remain supported.',
      ],
      title: 'Native Anchor Contract',
    },
    {
      items: [
        'Link should have visible content.',
        'Button-like links keep anchor semantics and do not support button-only behavior such as [code]type[/code], [code]disabled[/code], form submission, or loading state.',
      ],
      title: 'Accessibility Notes',
    },
    {
      items: [
        'Storybook controls focus on the main Link contract: [code]href[/code], [code]appearance[/code], visible content, [code]target[/code], and [code]rel[/code].',
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
    playground:
      'Use `href`, `appearance`, visible content, typed `target`, and typed `rel` as the main Link API in this playground.',
    routerStyling:
      'Framework router examples keep Next.js and Nuxt routing owned by their frameworks while applying Hoite Dev styling with `linkVariants`.',
    states: 'Forced hover, focus-visible, active, and visited states across Link appearances.',
  } satisfies StoryDescriptions,
  title: 'Link',
} as const;
