import {
  createFrontendDocsPlaygroundParameters,
  createVueStoryPreview,
  createVueStorySourcePanel,
  frontendDocsStoryLayoutClasses,
  withStoryPlayground,
  withVueStoryPlaygroundContent,
} from '@hoite-dev/frontend-docs-shared/storybook';
import {
  type CodeBlockTheme,
  codeBlockDocs,
  codeBlockShikiThemes,
  supportedCodeBlockLanguages,
  supportedCodeBlockThemes,
} from '@hoite-dev/ui';
import { CodeBlock, type CodeBlockProps } from '@hoite-dev/ui-vue';
import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, h, type PropType } from 'vue';

const defaultCode = `const token = theme.color.bg.surface;
renderCodeBlock(token);`;

const typeScriptCode = `export function Example() {
  return <CodeBlock language="ts" />;
}`;

const shellCode = 'pnpm --filter @hoite-dev/ui build';

const longUrlCode =
  'https://hoite.dev/reference/components/codeblock?theme=dark&focus=copy-action&overflow=horizontal&source=docs-preview';

type CodeBlockPlaygroundArgs = Omit<CodeBlockProps, 'language'> & {
  darkTheme?: CodeBlockTheme;
  language?: CodeBlockProps['language'];
  lightTheme?: CodeBlockTheme;
};

type NormalizedCodeBlockPlaygroundArgs = Omit<
  CodeBlockPlaygroundArgs,
  'darkTheme' | 'language' | 'lightTheme'
> & {
  darkTheme: CodeBlockTheme;
  language: CodeBlockProps['language'];
  lightTheme: CodeBlockTheme;
};

const defaultCodeBlockPlaygroundArgs: Pick<
  NormalizedCodeBlockPlaygroundArgs,
  'darkTheme' | 'language' | 'lightTheme'
> = {
  darkTheme: codeBlockShikiThemes.dark,
  language: 'ts',
  lightTheme: codeBlockShikiThemes.light,
};

function isSupportedCodeBlockLanguage(
  value: CodeBlockPlaygroundArgs['language'],
): value is CodeBlockProps['language'] {
  return (
    typeof value === 'string' &&
    supportedCodeBlockLanguages.includes(value as (typeof supportedCodeBlockLanguages)[number])
  );
}

function isSupportedCodeBlockTheme(
  value: CodeBlockPlaygroundArgs['lightTheme'],
): value is CodeBlockTheme {
  return typeof value === 'string' && supportedCodeBlockThemes.includes(value as CodeBlockTheme);
}

function normalizeCodeBlockPlaygroundArgs(
  args: CodeBlockPlaygroundArgs,
): NormalizedCodeBlockPlaygroundArgs {
  const darkTheme = isSupportedCodeBlockTheme(args.darkTheme)
    ? args.darkTheme
    : defaultCodeBlockPlaygroundArgs.darkTheme;
  const language = isSupportedCodeBlockLanguage(args.language)
    ? args.language
    : defaultCodeBlockPlaygroundArgs.language;
  const lightTheme = isSupportedCodeBlockTheme(args.lightTheme)
    ? args.lightTheme
    : defaultCodeBlockPlaygroundArgs.lightTheme;

  return {
    ...args,
    darkTheme,
    language,
    lightTheme,
  };
}

function resolvePlaygroundCodeBlockProps({
  code,
  copiedLabel,
  copyLabel,
  darkTheme,
  label,
  language,
  lightTheme,
  showCopy,
}: NormalizedCodeBlockPlaygroundArgs): CodeBlockProps {
  const hasCustomThemes =
    lightTheme !== codeBlockShikiThemes.light || darkTheme !== codeBlockShikiThemes.dark;

  return {
    code,
    copiedLabel,
    copyLabel,
    label,
    language,
    showCopy,
    themes: hasCustomThemes
      ? {
          dark: darkTheme,
          light: lightTheme,
        }
      : undefined,
  };
}

const storyArgTypes: Partial<ArgTypes<CodeBlockPlaygroundArgs>> = {
  code: {
    control: 'text',
    description: codeBlockDocs.argTypeDescriptions.code,
    table: {
      category: 'Component API',
    },
  },
  copiedLabel: {
    control: 'text',
    description: codeBlockDocs.argTypeDescriptions.copiedLabel,
    table: {
      category: 'Component API',
    },
  },
  copyLabel: {
    control: 'text',
    description: codeBlockDocs.argTypeDescriptions.copyLabel,
    table: {
      category: 'Component API',
    },
  },
  darkTheme: {
    control: 'select',
    description:
      'Playground dark-mode Shiki theme override. Defaults to the shared `dark-plus` theme.',
    options: supportedCodeBlockThemes,
    table: {
      category: 'Playground theme controls',
    },
  },
  label: {
    control: 'text',
    description: codeBlockDocs.argTypeDescriptions.label,
    table: {
      category: 'Component API',
    },
  },
  lightTheme: {
    control: 'select',
    description:
      'Playground light-mode Shiki theme override. Defaults to the shared `light-plus` theme.',
    options: supportedCodeBlockThemes,
    table: {
      category: 'Playground theme controls',
    },
  },
  language: {
    control: 'select',
    description: codeBlockDocs.argTypeDescriptions.language,
    options: supportedCodeBlockLanguages,
    table: {
      category: 'Component API',
    },
  },
  showCopy: {
    control: 'boolean',
    description: codeBlockDocs.argTypeDescriptions.showCopy,
    table: {
      category: 'Component API',
    },
  },
  themes: {
    control: false,
    description: codeBlockDocs.argTypeDescriptions.themes,
    table: {
      category: 'Component API',
    },
  },
};

const meta: Meta<CodeBlockPlaygroundArgs> = {
  args: {
    code: defaultCode,
    darkTheme: defaultCodeBlockPlaygroundArgs.darkTheme,
    language: defaultCodeBlockPlaygroundArgs.language,
    lightTheme: defaultCodeBlockPlaygroundArgs.lightTheme,
    showCopy: true,
  },
  argTypes: storyArgTypes,
  component: CodeBlock,
  parameters: {
    controls: {
      include: [
        'code',
        'language',
        'label',
        'showCopy',
        'copyLabel',
        'copiedLabel',
        'lightTheme',
        'darkTheme',
      ],
      sort: 'none',
    },
  },
  title: 'Primitives/Static/CodeBlock',
};

export default meta;

type Story = StoryObj<CodeBlockPlaygroundArgs>;

function escapeTemplateLiteral(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${');
}

function createVueCodeBlockSnippet({
  darkTheme,
  lightTheme,
  ...args
}: NormalizedCodeBlockPlaygroundArgs): string {
  const normalizedArgs = normalizeCodeBlockPlaygroundArgs({
    darkTheme,
    lightTheme,
    ...args,
  });
  const codeBlockProps = resolvePlaygroundCodeBlockProps(normalizedArgs);
  const lines = ['<CodeBlock', `  :code="\`${escapeTemplateLiteral(codeBlockProps.code)}\`"`];

  if (codeBlockProps.language !== defaultCodeBlockPlaygroundArgs.language) {
    lines.push(`  language="${codeBlockProps.language}"`);
  }

  if (codeBlockProps.label !== undefined && codeBlockProps.label.length > 0) {
    lines.push(`  label="${codeBlockProps.label}"`);
  }

  if (codeBlockProps.showCopy) {
    lines.push('  showCopy');
  }

  if (codeBlockProps.copyLabel !== undefined && codeBlockProps.copyLabel.length > 0) {
    lines.push(`  copyLabel="${codeBlockProps.copyLabel}"`);
  }

  if (codeBlockProps.copiedLabel !== undefined && codeBlockProps.copiedLabel.length > 0) {
    lines.push(`  copiedLabel="${codeBlockProps.copiedLabel}"`);
  }

  if (codeBlockProps.themes !== undefined) {
    lines.push(
      `  :themes="{ light: '${codeBlockProps.themes.light}', dark: '${codeBlockProps.themes.dark}' }"`,
    );
  }

  lines.push('/>');

  return lines.join('\n');
}

const CodeBlockPlaygroundPreview = defineComponent({
  components: { CodeBlock },
  props: {
    code: {
      required: true,
      type: String,
    },
    copiedLabel: {
      required: false,
      type: String,
    },
    copyLabel: {
      required: false,
      type: String,
    },
    label: {
      required: false,
      type: String,
    },
    darkTheme: {
      default: codeBlockShikiThemes.dark,
      required: false,
      type: String as PropType<CodeBlockPlaygroundArgs['darkTheme']>,
    },
    language: {
      required: true,
      type: String as PropType<CodeBlockPlaygroundArgs['language']>,
    },
    lightTheme: {
      default: codeBlockShikiThemes.light,
      required: false,
      type: String as PropType<CodeBlockPlaygroundArgs['lightTheme']>,
    },
    showCopy: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
  setup(props) {
    const normalizedArgs = computed(() => normalizeCodeBlockPlaygroundArgs(props));
    const snippet = computed(() => createVueCodeBlockSnippet(normalizedArgs.value));
    const codeBlockProps = computed(() => resolvePlaygroundCodeBlockProps(normalizedArgs.value));

    return {
      codeBlockProps,
      snippet,
    };
  },
  template: withStoryPlayground(`
    <div class="${frontendDocsStoryLayoutClasses.infoPanel} text-sm text-[var(--color-text-secondary)]">
      CodeBlock always renders a language-led header. Use <code>label</code> only when the
      visible header text should differ from the Shiki language value.
    </div>
    ${withVueStoryPlaygroundContent(`
      ${createVueStoryPreview(`
        <div class="mx-auto w-full max-w-[44rem]">
          <CodeBlock v-bind="codeBlockProps" />
        </div>
      `)}
      ${createVueStorySourcePanel('snippet', "'vue'")}
    `)}
  `),
});

function renderCodeBlock(args: CodeBlockPlaygroundArgs) {
  const normalizedArgs = normalizeCodeBlockPlaygroundArgs(args);
  const codeBlockProps = resolvePlaygroundCodeBlockProps(normalizedArgs);

  return {
    render() {
      return h('div', { class: 'mx-auto w-full max-w-[44rem]' }, [h(CodeBlock, codeBlockProps)]);
    },
  };
}

export const Playground: Story = {
  name: 'Playground',
  parameters: createFrontendDocsPlaygroundParameters({
    controls: {
      include: [
        'code',
        'language',
        'label',
        'showCopy',
        'copyLabel',
        'copiedLabel',
        'lightTheme',
        'darkTheme',
      ],
      sort: 'none',
    },
    docs: {
      description: {
        story: codeBlockDocs.storyDescriptions.playground,
      },
    },
  }),
  render: (args) => ({
    components: { CodeBlockPlaygroundPreview },
    setup() {
      return {
        args: computed(() => normalizeCodeBlockPlaygroundArgs(args)),
      };
    },
    template: '<CodeBlockPlaygroundPreview v-bind="args" />',
  }),
};

export const Example: Story = {
  args: {
    code: typeScriptCode,
    language: 'ts',
    showCopy: false,
  },
  name: 'Without copy',
  parameters: {
    docs: {
      description: {
        story: codeBlockDocs.storyDescriptions.example,
      },
    },
  },
  tags: ['!dev'],
  render: renderCodeBlock,
};

export const WithCopyAction: Story = {
  args: {
    code: shellCode,
    language: 'bash',
    showCopy: true,
  },
  name: 'With copy action',
  parameters: {
    docs: {
      description: {
        story: codeBlockDocs.storyDescriptions.withCopyAction,
      },
    },
  },
  tags: ['!dev'],
  render: renderCodeBlock,
};

export const LongCodeOverflow: Story = {
  args: {
    code: longUrlCode,
    language: 'url',
    showCopy: false,
  },
  name: 'Long code overflow',
  parameters: {
    docs: {
      description: {
        story: codeBlockDocs.storyDescriptions.longCodeOverflow,
      },
    },
  },
  tags: ['!dev'],
  render: renderCodeBlock,
};
