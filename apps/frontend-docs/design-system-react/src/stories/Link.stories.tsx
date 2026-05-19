import {
  createFrontendDocsComponentSnippet,
  createFrontendDocsPlaygroundParameters,
  StoryInfoPanel,
  StoryPlayground,
  StoryPlaygroundContent,
  StoryPlaygroundPreview,
  StoryPlaygroundSnippet,
} from '@hoite-dev/frontend-docs-shared/storybook';
import { type LinkAppearance, linkDocs, supportedLinkAppearances } from '@hoite-dev/ui';
import { Link } from '@hoite-dev/ui-react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';

import { StorybookSourceSnippet } from './StorybookSourceSnippet';

type LinkStoryArgs = {
  appearance: LinkAppearance;
  children: string;
  href: string;
};

const defaultLinkArgs: LinkStoryArgs = {
  appearance: 'link',
  children: 'Read the case study',
  href: '#link-playground',
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
};

const meta: Meta<LinkStoryArgs> = {
  args: defaultLinkArgs,
  argTypes: storyArgTypes,
  component: LinkPlaygroundPreview,
  parameters: {
    controls: {
      include: ['children', 'href', 'appearance'],
      sort: 'none',
    },
  },
  title: 'Primitives/Action/Link',
};

export default meta;

type Story = StoryObj<LinkStoryArgs>;

function normalizeLinkArgs(args: LinkStoryArgs): LinkStoryArgs {
  const appearance = supportedLinkAppearances.includes(args.appearance)
    ? args.appearance
    : defaultLinkArgs.appearance;

  return {
    ...args,
    appearance,
  };
}

function LinkPlaygroundPreview(args: LinkStoryArgs): ReactElement {
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
        defaultValue: defaultLinkArgs.appearance,
        name: 'appearance',
        value: args.appearance,
      },
    ],
  });

  return (
    <StoryPlayground>
      <StoryInfoPanel>
        <p className='m-0 text-sm text-[var(--color-text-primary)]'>
          Link renders a native <code>a</code> for navigation. Keep framework routing in the
          framework link component and apply Hoite Dev styling with <code>linkVariants</code>.
        </p>
      </StoryInfoPanel>
      <StoryPlaygroundContent split>
        <StoryPlaygroundPreview>
          <Link appearance={args.appearance} href={args.href}>
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
      include: ['children', 'href', 'appearance'],
      sort: 'none',
    },
    docs: {
      description: {
        story: linkDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => <LinkPlaygroundPreview {...normalizeLinkArgs(args)} />,
};

export const NativeUsage: Story = {
  name: 'Native Link',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: linkDocs.storyDescriptions.nativeUsage,
      },
    },
  },
  tags: ['!dev'],
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <Link href='#native-link-about'>About</Link>
      <Link appearance='button' href='#native-link-contact'>
        Contact
      </Link>
    </div>
  ),
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
