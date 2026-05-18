import { createElement, type ElementType, Fragment, type ReactNode } from 'react';

import { DesignSystemDocsPage } from './DesignSystemDocsPage';
import { DocsExample } from './DocsExample';
import type { ComponentDocs } from './docsTypes';
import { createFrameworkSourceLinks, type SourceLink } from './sourceLinks';

type StoryReference = {
  name?: string;
  storyName?: string;
};

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
  examples: readonly StoryReference[];
  framework: 'React' | 'Vue';
  implementationPath: string;
  storiesPath: string;
};

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
  examples: readonly StoryReference[],
  sourceState: CanvasSourceState,
): ReactNode {
  return createElement(
    Fragment,
    null,
    examples.map((story, index) =>
      createElement(
        DocsExample,
        {
          key: `example-${index}`,
          story,
        },
        createElement(CanvasBlock, { of: story, sourceState }),
      ),
    ),
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
  storiesPath,
}: FrameworkComponentDocsPageProps) {
  return createElement(DesignSystemDocsPage, {
    controls: renderControls(ArgTypesBlock, controls),
    docs,
    examples: renderExamples(CanvasBlock, examples, canvasSourceState),
    sourceLinks: [
      ...contractSourceLinks,
      ...createFrameworkSourceLinks(framework, implementationPath, storiesPath),
    ],
  });
}
