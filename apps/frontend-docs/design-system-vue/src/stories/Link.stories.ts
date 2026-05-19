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
import { type LinkAppearance, linkDocs, supportedLinkAppearances } from '@hoite-dev/ui';
import { HoiteLink } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, ref } from 'vue';

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

function normalizeLinkArgs(args: LinkStoryArgs): LinkStoryArgs {
  const appearance = supportedLinkAppearances.includes(args.appearance)
    ? args.appearance
    : defaultLinkArgs.appearance;

  return {
    ...args,
    appearance,
  };
}

const LinkPlaygroundPreview = defineComponent({
  components: { HoiteLink },
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
  },
  setup(props) {
    const linkArgs = computed(() => ({
      appearance: props.appearance,
      href: props.href,
    }));
    const snippet = computed(() =>
      createFrontendDocsComponentSnippet({
        children: props.children,
        componentName: 'HoiteLink',
        framework: 'vue',
        props: [
          {
            name: 'href',
            value: props.href,
          },
          {
            defaultValue: defaultLinkArgs.appearance,
            name: 'appearance',
            value: props.appearance,
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
          HoiteLink renders a native <code>a</code> for navigation. Keep framework routing in
          NuxtLink and apply Hoite Dev styling with <code>linkVariants</code>.
        </p>
      </div>
      ${withVueStoryPlaygroundContent(`
        ${createVueStoryPreview(`
          <HoiteLink v-bind="linkArgs">{{ children }}</HoiteLink>
        `)}
        ${createVueStorySourcePanel()}
      `)}
  `),
});

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
  render: (args) => ({
    components: { LinkPlaygroundPreview },
    setup() {
      return {
        args: computed(() => normalizeLinkArgs(args)),
      };
    },
    template: '<LinkPlaygroundPreview v-bind="args" />',
  }),
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
  render: () => ({
    components: { HoiteLink },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <HoiteLink href="#native-link-about">About</HoiteLink>
        <HoiteLink href="#native-link-contact" appearance="button">Contact</HoiteLink>
      </div>
    `,
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
    components: { HoiteLink },
    setup() {
      return {
        appearances: supportedLinkAppearances,
      };
    },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <HoiteLink
          v-for="appearance in appearances"
          :key="appearance"
          :appearance="appearance"
          :href="'#' + appearance + '-appearance'"
        >
          {{ appearance === 'button' ? 'Button-like link' : 'Text link' }}
        </HoiteLink>
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
    components: { HoiteLink },
    template: `
      <div class="grid gap-4 md:grid-cols-2">
        <div class="grid content-start gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4">
          <span class="text-sm font-medium text-[var(--color-text-secondary)]">link</span>
          <div class="flex flex-wrap items-start gap-4">
            <HoiteLink href="#link-state-default">Default</HoiteLink>
            <HoiteLink class="frontend-docs-force-hover" href="#link-state-hover">Hover</HoiteLink>
            <HoiteLink class="frontend-docs-force-focused" href="#link-state-focused">Focused</HoiteLink>
            <HoiteLink class="frontend-docs-force-visited" href="#link-state-visited">Visited</HoiteLink>
          </div>
        </div>
        <div class="grid content-start gap-3 rounded-lg border border-[var(--color-border-muted)] bg-[var(--color-bg-surface)] p-4">
          <span class="text-sm font-medium text-[var(--color-text-secondary)]">button</span>
          <div class="flex flex-wrap items-start gap-3">
            <HoiteLink appearance="button" href="#button-link-state-default">Default</HoiteLink>
            <HoiteLink appearance="button" class="frontend-docs-force-hover" href="#button-link-state-hover">Hover</HoiteLink>
            <HoiteLink appearance="button" class="frontend-docs-force-focused" href="#button-link-state-focused">Focused</HoiteLink>
            <HoiteLink appearance="button" class="frontend-docs-force-pressed" href="#button-link-state-pressed">Pressed</HoiteLink>
          </div>
        </div>
      </div>
    `,
  }),
};
