import {
  copyFrontendDocsSnippetToClipboard,
  createFrontendDocsComponentSnippet,
  createFrontendDocsHighlightedSnippetHtml,
  createFrontendDocsPlaygroundParameters,
  createVueStoryPreview,
  createVueStorySourcePanel,
  withStoryPlayground,
  withVueStoryPlaygroundContent,
} from '@hoite-dev/frontend-docs-shared/storybook';
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
import { Link } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, type PropType, ref } from 'vue';

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

const LinkPlaygroundPreview = defineComponent({
  components: { Link },
  props: {
    appearance: {
      required: true,
      type: String as () => LinkAppearance,
    },
    children: {
      required: true,
      type: String,
    },
    href: {
      required: true,
      type: String,
    },
    rel: {
      required: true,
      type: Array as PropType<LinkRelToken[]>,
    },
    target: {
      required: false,
      type: String as PropType<LinkTarget>,
    },
  },
  setup(props) {
    const linkArgs = computed(() => ({
      appearance: props.appearance,
      href: props.href,
      rel: resolveLinkStoryRel(props.rel),
      target: resolveLinkStoryTarget(props.target),
    }));
    const snippet = computed(() =>
      createFrontendDocsComponentSnippet({
        children: props.children,
        componentName: 'Link',
        framework: 'vue',
        props: [
          {
            name: 'href',
            value: props.href,
          },
          {
            defaultValue: defaultLinkStoryArgs.appearance,
            name: 'appearance',
            value: props.appearance,
          },
          {
            defaultValue: defaultLinkStoryArgs.target,
            name: 'target',
            value: props.target,
          },
          {
            defaultValue: defaultLinkStoryArgs.rel,
            name: 'rel',
            value: props.rel,
          },
        ],
      }),
    );
    const copyButtonLabel = ref('Copy code');
    const copySnippet = async () => {
      copyButtonLabel.value = 'Copying';
      copyButtonLabel.value = (await copyFrontendDocsSnippetToClipboard(snippet.value))
        ? 'Copied'
        : 'Copy error';
    };
    const highlightedSnippet = computed(() =>
      createFrontendDocsHighlightedSnippetHtml(snippet.value),
    );

    return {
      copyButtonLabel,
      copySnippet,
      highlightedSnippet,
      linkArgs,
    };
  },
  template: withStoryPlayground(`
      <div
        class="rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-subtle)] p-4"
      >
        <p class="m-0 text-sm text-[var(--color-text-primary)]">
          Link renders a native <code>a</code> for navigation. Use <code>target</code> and
          <code>rel</code> as native anchor passthroughs here. When
          <code>target="_blank"</code> is used without an explicit <code>rel</code>, Link
          defaults <code>rel</code> to <code>noopener noreferrer</code>. Pass
          <code>rel</code> explicitly to override that default.
        </p>
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(`
          <Link v-bind="linkArgs">{{ children }}</Link>
        `)}
        ${createVueStorySourcePanel()}
      `)}
  `),
});

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
  render: (args) => ({
    components: { LinkPlaygroundPreview },
    setup() {
      return {
        args: computed(() => normalizeLinkStoryArgs(args)),
      };
    },
    template: '<LinkPlaygroundPreview v-bind="args" />',
  }),
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
  render: () => ({
    components: { Link },
    setup() {
      return {
        appearances: supportedLinkAppearances,
      };
    },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Link
          v-for="appearance in appearances"
          :key="appearance"
          :appearance="appearance"
          :href="'#' + appearance + '-appearance'"
        >
          {{ appearance === 'button' ? 'Button-like link' : 'Text link' }}
        </Link>
      </div>
    `,
  }),
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
  render: () => ({
    components: { Link },
    template: `
      <div class="grid gap-4 md:grid-cols-2">
        <div class="grid content-start gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4">
          <span class="text-sm font-medium text-[var(--color-text-secondary)]">link</span>
          <div class="flex flex-wrap items-start gap-4">
            <Link href="#link-state-default">Default</Link>
            <Link class="frontend-docs-force-hover" href="#link-state-hover">Hover</Link>
            <Link class="frontend-docs-force-focused" href="#link-state-focused">Focused</Link>
            <Link class="frontend-docs-force-visited" href="#link-state-visited">Visited</Link>
          </div>
        </div>
        <div class="grid content-start gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4">
          <span class="text-sm font-medium text-[var(--color-text-secondary)]">button</span>
          <div class="flex flex-wrap items-start gap-3">
            <Link appearance="button" href="#button-link-state-default">Default</Link>
            <Link appearance="button" class="frontend-docs-force-hover" href="#button-link-state-hover">Hover</Link>
            <Link appearance="button" class="frontend-docs-force-focused" href="#button-link-state-focused">Focused</Link>
            <Link appearance="button" class="frontend-docs-force-pressed" href="#button-link-state-pressed">Pressed</Link>
          </div>
        </div>
      </div>
    `,
  }),
};
