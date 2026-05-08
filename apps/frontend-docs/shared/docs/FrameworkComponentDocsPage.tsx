import { createElement, type ElementType, Fragment, type ReactNode } from 'react';

import { DesignSystemDocsPage } from './DesignSystemDocsPage';
import { DocsExample } from './DocsExample';
import type { ComponentDocs } from './docsTypes';
import { createFrameworkSourceLinks, type SourceLink } from './sourceLinks';

type StoryReference = {
  name?: string;
  storyName?: string;
};

type ControlSection = {
  story: StoryReference;
  title?: string;
};

type FrameworkComponentDocsPageProps = {
  argTypesBlock: ElementType<{ of: unknown }>;
  canvasBlock: ElementType<{ of: unknown }>;
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
  CanvasBlock: ElementType<{ of: unknown }>,
  examples: readonly StoryReference[],
): ReactNode {
  return createElement(
    Fragment,
    null,
    examples.map((story, index) =>
      createElement(DocsExample, {
        key: `example-${index}`,
        children: createElement(CanvasBlock, { of: story }),
        story,
      }),
    ),
  );
}

export function FrameworkComponentDocsPage({
  argTypesBlock: ArgTypesBlock,
  canvasBlock: CanvasBlock,
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
    examples: renderExamples(CanvasBlock, examples),
    sourceLinks: [
      ...contractSourceLinks,
      ...createFrameworkSourceLinks(framework, implementationPath, storiesPath),
    ],
  });
}
