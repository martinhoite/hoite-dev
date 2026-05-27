import {
  createFrontendDocsComponentSnippet,
  createFrontendDocsPlaygroundParameters,
  StoryInfoPanel,
  StoryPlayground,
  StoryPlaygroundContent,
  StoryPlaygroundPreview,
  StoryPlaygroundSnippet,
} from '@hoite-dev/frontend-docs-shared/storybook';
import { StorybookSourceSnippet } from '@hoite-dev/frontend-docs-shared/storybook/source-snippet';
import {
  type LinkAppearance,
  type LinkRel,
  type LinkRelToken,
  type LinkTarget,
  linkDocs,
  supportedLinkAppearances,
  supportedLinkRelTokens,
  supportedLinkTargets,
} from '@hoite-dev/ui';
import { Link } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';

const linkPlaygroundControlNames = ['children', 'href', 'appearance', 'target', 'rel'] as const;

type LinkStoryArgs = {
  appearance: LinkAppearance;
  children: string;
  href: string;
  rel: LinkRelToken[];
  target?: LinkTarget;
};

const defaultLinkStoryArgs: LinkStoryArgs = {
  appearance: 'link',
  children: 'Read the case study',
  href: '#link-playground',
  rel: [],
  target: undefined,
};

const storyArgTypes: Partial<ArgTypes<LinkStoryArgs>> = {
  appearance: {
    control: 'select',
    description: linkDocs.argTypeDescriptions.appearance,
    options: supportedLinkAppearances,
    table: {
      category: 'Component API',
    },
  },
  children: {
    control: 'text',
    description: linkDocs.argTypeDescriptions.children,
    name: 'Text content',
    table: {
      category: 'Component API',
    },
  },
  href: {
    control: 'text',
    description: linkDocs.argTypeDescriptions.href,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  rel: {
    control: 'check',
    description: linkDocs.argTypeDescriptions.rel,
    options: supportedLinkRelTokens,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
  target: {
    control: 'select',
    description: linkDocs.argTypeDescriptions.target,
    options: supportedLinkTargets,
    table: {
      category: 'Native / passthrough attributes',
    },
  },
};

const meta: Meta<LinkStoryArgs> = {
  args: defaultLinkStoryArgs,
  argTypes: storyArgTypes,
  component: LinkPlaygroundPreview,
  parameters: {
    controls: {
      include: [...linkPlaygroundControlNames],
      sort: 'none',
    },
  },
  title: 'Primitives/Action/Link',
};

export default meta;

type Story = StoryObj<LinkStoryArgs>;

function normalizeLinkStoryArgs(args: LinkStoryArgs): LinkStoryArgs {
  const appearance = supportedLinkAppearances.includes(args.appearance)
    ? args.appearance
    : defaultLinkStoryArgs.appearance;
  const rel = Array.isArray(args.rel)
    ? args.rel.filter((token): token is LinkRelToken => supportedLinkRelTokens.includes(token))
    : defaultLinkStoryArgs.rel;
  const target =
    args.target !== undefined && supportedLinkTargets.includes(args.target)
      ? args.target
      : undefined;

  return {
    ...args,
    appearance,
    rel,
    target,
  };
}

function resolveLinkStoryRel(rel: LinkStoryArgs['rel']): LinkRel | undefined {
  return rel.length > 0 ? rel : undefined;
}

function resolveLinkStoryTarget(target: LinkStoryArgs['target']): LinkTarget | undefined {
  return target;
}

function LinkPlaygroundPreview(args: LinkStoryArgs): ReactElement {
  const rel = resolveLinkStoryRel(args.rel);
  const target = resolveLinkStoryTarget(args.target);
  const snippet = createFrontendDocsComponentSnippet({
    children: args.children,
    componentName: 'Link',
    framework: 'react',
    props: [
      {
        name: 'href',
        value: args.href,
      },
      {
        defaultValue: defaultLinkStoryArgs.appearance,
        name: 'appearance',
        value: args.appearance,
      },
      {
        defaultValue: defaultLinkStoryArgs.target,
        name: 'target',
        value: args.target,
      },
      {
        defaultValue: defaultLinkStoryArgs.rel,
        name: 'rel',
        value: args.rel,
      },
    ],
  });

  return (
    <StoryPlayground>
      <StoryInfoPanel>
        <p className='m-0 text-sm text-[var(--color-text-primary)]'>
          Link renders a native <code>a</code> for navigation. Use <code>target</code> and{' '}
          <code>rel</code> as native anchor passthroughs here. When{' '}
          <code>target=&quot;_blank&quot;</code> is used without an explicit <code>rel</code>, Link
          defaults <code>rel</code> to <code>noopener noreferrer</code>. Pass <code>rel</code>{' '}
          explicitly to override that default.
        </p>
      </StoryInfoPanel>
      <StoryPlaygroundContent split>
        <StoryPlaygroundPreview>
          <Link appearance={args.appearance} href={args.href} rel={rel} target={target}>
            {args.children}
          </Link>
        </StoryPlaygroundPreview>
        <StoryPlaygroundSnippet>
          <StorybookSourceSnippet code={snippet} />
        </StoryPlaygroundSnippet>
      </StoryPlaygroundContent>
    </StoryPlayground>
  );
}

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: [...linkPlaygroundControlNames],
      sort: 'none',
    },
    docs: {
      description: {
        story: linkDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => <LinkPlaygroundPreview {...normalizeLinkStoryArgs(args)} />,
};

export const Appearances: Story = {
  name: 'Appearances',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: linkDocs.storyDescriptions.appearances,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      {supportedLinkAppearances.map((appearance) => (
        <Link appearance={appearance} href={`#${appearance}-appearance`} key={appearance}>
          {appearance === 'button' ? 'Button-like link' : 'Text link'}
        </Link>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: 'States',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: linkDocs.storyDescriptions.states,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='grid gap-4 md:grid-cols-2'>
      <div className='grid content-start gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'>
        <span className='text-sm font-medium text-[var(--color-text-secondary)]'>link</span>
        <div className='flex flex-wrap items-start gap-4'>
          <Link href='#link-state-default'>Default</Link>
          <Link className='frontend-docs-force-hover' href='#link-state-hover'>
            Hover
          </Link>
          <Link className='frontend-docs-force-focused' href='#link-state-focused'>
            Focused
          </Link>
          <Link className='frontend-docs-force-visited' href='#link-state-visited'>
            Visited
          </Link>
        </div>
      </div>
      <div className='grid content-start gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4'>
        <span className='text-sm font-medium text-[var(--color-text-secondary)]'>button</span>
        <div className='flex flex-wrap items-start gap-3'>
          <Link appearance='button' href='#button-link-state-default'>
            Default
          </Link>
          <Link
            appearance='button'
            className='frontend-docs-force-hover'
            href='#button-link-state-hover'
          >
            Hover
          </Link>
          <Link
            appearance='button'
            className='frontend-docs-force-focused'
            href='#button-link-state-focused'
          >
            Focused
          </Link>
          <Link
            appearance='button'
            className='frontend-docs-force-pressed'
            href='#button-link-state-pressed'
          >
            Pressed
          </Link>
        </div>
      </div>
    </div>
  ),
};
