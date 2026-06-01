import { codeBlockDocs } from '@hoite-dev/ui';
import { DocSectionHeading } from './section-headings';

const supportedTypographyTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;

const typographySamples = [
  { defaultTag: 'h1', variant: 'display-large' },
  { defaultTag: 'h2', variant: 'heading-large' },
  { defaultTag: 'h3', variant: 'heading-medium' },
  { defaultTag: 'p', variant: 'body-large' },
  { defaultTag: 'p', variant: 'body-medium' },
  { defaultTag: 'span', variant: 'label-medium' },
  { defaultTag: 'span', variant: 'caption-small' },
] as const;

function createCodeBlockVisibleLabel({ label, language }: { label?: string; language: string }) {
  const normalizedLabel = label?.trim();

  if (normalizedLabel) {
    return normalizedLabel;
  }

  const normalizedLanguage = language.trim();

  if (normalizedLanguage) {
    return normalizedLanguage;
  }

  return 'Text';
}

function CodeBlockShell({
  code,
  copyState,
  label,
}: {
  code: string;
  copyState: {
    ariaLabel: string;
    isCopied?: boolean;
    label: string;
  };
  label: string;
}) {
  const copiedClassName = copyState.isCopied ? ' code-block__copy--copied' : '';

  return (
    <div className='code-block code-block--with-header'>
      <div className='code-block__header'>
        <p className='code-block__label'>{label}</p>
        <button
          aria-label={copyState.ariaLabel}
          className={`code-block__copy${copiedClassName}`}
          disabled
          type='button'
        >
          <span className='code-block__copy-labels'>
            <span className='code-block__copy-label'>{copyState.label}</span>
          </span>
        </button>
      </div>
      <div className='code-block__body'>
        <pre className='code-block__fallback'>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function CodeBlockSample({
  code,
  copied,
  language,
  label,
}: {
  code: string;
  copied?: boolean;
  language: string;
  label?: string;
}) {
  const visibleLabel = createCodeBlockVisibleLabel({
    label,
    language,
  });

  return (
    <CodeBlockShell
      code={code}
      copyState={{
        ariaLabel: copied ? `Copied ${visibleLabel} code` : `Copy ${visibleLabel} code`,
        isCopied: copied,
        label: copied ? 'Copied' : 'Copy code',
      }}
      label={visibleLabel}
    />
  );
}

export function TypographyContractSamples() {
  return (
    <div className='docs-stack-lg'>
      <section className='docs-surface'>
        <DocSectionHeading>Supported tags</DocSectionHeading>
        <div className='token-chip-list'>
          {supportedTypographyTags.map((tag) => {
            return (
              <code className='token-chip' key={tag}>
                {tag}
              </code>
            );
          })}
        </div>
      </section>
      <section className='docs-surface'>
        <DocSectionHeading>Visual samples</DocSectionHeading>
        <p className='docs-surface__intro'>
          Representative samples of the shared text contract exposed by <code>@hoite-dev/ui</code>.
        </p>
        <div className='typography-sample-grid'>
          {typographySamples.map((sample) => {
            const Tag = sample.defaultTag;
            const className = `typography typography--${sample.variant}`;

            return (
              <article className='typography-sample-card' key={sample.variant}>
                <div className='typography-sample-card__meta'>
                  <code>{sample.variant}</code>
                  <span>{Tag}</span>
                </div>
                <Tag className={className}>The quick brown fox jumps over the lazy dog.</Tag>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function CodeBlockContractSamples() {
  return (
    <div className='docs-stack-lg'>
      <section className='docs-surface'>
        <DocSectionHeading>Reference samples</DocSectionHeading>
        <p className='docs-surface__intro'>
          {codeBlockDocs.description[0]} The examples below focus on the shared shell, overflow
          behavior, and copy affordance.
        </p>
        <div className='docs-stack-md'>
          <CodeBlockSample
            code={`export function renderHeading(variant: string) {\n  return typographyVariants({ variant });\n}`}
            language='ts'
            label='TypeScript'
          />
          <CodeBlockSample
            code='https://docs.hoite.dev/design-system/react/?path=/docs/primitives-static-codeblock--docs&viewMode=docs&panel=right&source=long-line-overflow-reference'
            copied
            language='url'
            label='Long URL'
          />
        </div>
      </section>
    </div>
  );
}
