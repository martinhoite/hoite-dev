import { createElement, type ElementType, Fragment, type ReactNode } from 'react';

import { DesignSystemDocsPage } from './DesignSystemDocsPage';
import { DocsExample } from './DocsExample';
import type { ComponentDocs } from './docsTypes';
import { createFrameworkSourceLinks, type SourceLink } from './sourceLinks';

type StoryReference = {
  name?: string;
  storyName?: string;
};

type SourceExample = {
  code: string;
  description: string;
  language: 'html' | 'tsx';
  title: string;
};

type DocsExampleReference = SourceExample | StoryReference;

type CanvasSourceState = 'hidden' | 'shown' | 'none';

type ControlSection = {
  story: StoryReference;
  title?: string;
};

type FrameworkComponentDocsPageProps = {
  argTypesBlock: ElementType<{ of: unknown }>;
  canvasBlock: ElementType<{ of: unknown; sourceState?: CanvasSourceState }>;
  canvasSourceState?: CanvasSourceState;
  contractSourceLinks: readonly SourceLink[];
  controls: readonly ControlSection[];
  docs: ComponentDocs;
  examples: readonly DocsExampleReference[];
  framework: 'React' | 'Vue';
  implementationPath: string;
  sourceBlock?: ElementType<{
    code: string;
    copyable?: boolean;
    language?: SourceExample['language'];
    panel?: 'none' | 'story';
  }>;
  storiesPath: string;
};

function isSourceExample(example: DocsExampleReference): example is SourceExample {
  return 'code' in example;
}

function renderControls(
  ArgTypesBlock: ElementType<{ of: unknown }>,
  controls: readonly ControlSection[],
): ReactNode {
  const content: ReactNode[] = [];

  for (const [index, control] of controls.entries()) {
    if (control.title) {
      content.push(
        createElement(
          'h3',
          {
            className: 'm-0',
            key: `heading-${index}`,
          },
          control.title,
        ),
      );
    }

    content.push(
      createElement(ArgTypesBlock, {
        key: `arg-types-${index}`,
        of: control.story,
      }),
    );
  }

  return createElement(Fragment, null, content);
}

function renderExamples(
  CanvasBlock: FrameworkComponentDocsPageProps['canvasBlock'],
  examples: readonly DocsExampleReference[],
  sourceState: CanvasSourceState,
  SourceBlock?: FrameworkComponentDocsPageProps['sourceBlock'],
): ReactNode {
  return createElement(
    Fragment,
    null,
    examples.map((example, index) => {
      if (isSourceExample(example)) {
        return createElement(
          DocsExample,
          {
            key: `example-${index}`,
            story: {
              name: example.title,
            },
          },
          createElement(Fragment, null, [
            createElement(
              'p',
              {
                className: 'm-0 text-sm text-[var(--color-text-secondary)]',
                key: 'description',
              },
              example.description,
            ),
            SourceBlock
              ? createElement(SourceBlock, {
                  code: example.code,
                  copyable: false,
                  key: 'source',
                  language: example.language,
                  panel: 'none',
                })
              : null,
          ]),
        );
      }

      return createElement(
        DocsExample,
        {
          key: `example-${index}`,
          story: example,
        },
        createElement(CanvasBlock, { of: example, sourceState }),
      );
    }),
  );
}

export function FrameworkComponentDocsPage({
  argTypesBlock: ArgTypesBlock,
  canvasBlock: CanvasBlock,
  canvasSourceState = 'none',
  contractSourceLinks,
  controls,
  docs,
  examples,
  framework,
  implementationPath,
  sourceBlock: SourceBlock,
  storiesPath,
}: FrameworkComponentDocsPageProps) {
  return createElement(DesignSystemDocsPage, {
    controls: renderControls(ArgTypesBlock, controls),
    docs,
    examples: renderExamples(CanvasBlock, examples, canvasSourceState, SourceBlock),
    sourceLinks: [
      ...contractSourceLinks,
      ...createFrameworkSourceLinks(framework, implementationPath, storiesPath),
    ],
  });
}
