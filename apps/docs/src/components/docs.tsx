import Link from '@docusaurus/Link';
import { codeBlockDocs, typographyDocs } from '@hoite-dev/ui';
import { hoiteThemeColorValues } from '@hoite-dev/ui/theme-color-values';
import { type ReactNode, useEffect, useState } from 'react';

type RouteCard = {
  body: string;
  href: string;
  label: string;
};

type StorybookLink = {
  href: string;
  label: string;
  summary: string;
};

type SourceLink = {
  label: string;
  path: string;
};

type ThemeColorKey = keyof typeof hoiteThemeColorValues.light;

type ThemeColorReferenceRow = {
  description: string;
  key: ThemeColorKey;
  token: string;
};

type ScaleReferenceRow = {
  description: string;
  previewKind: 'spacing' | 'typography-line-height' | 'typography-size' | 'typography-weight';
  token: string;
};

const REPO_BASE_URL = 'https://github.com/martinhoite/hoite-dev/blob/master/';
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

const themeColorReferenceRows: readonly ThemeColorReferenceRow[] = [
  {
    description: 'Canvas and app-shell background.',
    key: 'colorBgCanvas',
    token: '--color-bg-canvas',
  },
  {
    description: 'Raised surfaces such as cards, drawers, and panels.',
    key: 'colorBgSurface',
    token: '--color-bg-surface',
  },
  {
    description: 'Primary reading color for body copy and headings.',
    key: 'colorTextPrimary',
    token: '--color-text-primary',
  },
  {
    description: 'Secondary reading color for supporting copy and meta text.',
    key: 'colorTextSecondary',
    token: '--color-text-secondary',
  },
  {
    description: 'Default border color for cards, fields, and separators.',
    key: 'colorBorderDefault',
    token: '--color-border-default',
  },
  {
    description: 'Focus ring and high-visibility interactive outline.',
    key: 'colorBorderFocus',
    token: '--color-border-focus',
  },
] as const;

const spacingReferenceRows: readonly ScaleReferenceRow[] = [
  {
    description: 'Compact gap for inline controls, dense chips, and tight button groups.',
    previewKind: 'spacing',
    token: '--spacing-8',
  },
  {
    description: 'Default small gap for stacked controls and card internals.',
    previewKind: 'spacing',
    token: '--spacing-16',
  },
  {
    description: 'Medium vertical rhythm for sections and grouped content.',
    previewKind: 'spacing',
    token: '--spacing-24',
  },
  {
    description: 'Large section spacing for page structure and hero layouts.',
    previewKind: 'spacing',
    token: '--spacing-32',
  },
] as const;

const typographyReferenceRows: readonly ScaleReferenceRow[] = [
  {
    description: 'Baseline body copy size.',
    previewKind: 'typography-size',
    token: '--typography-size-16',
  },
  {
    description: 'Display-size heading step used in prominent page titles.',
    previewKind: 'typography-size',
    token: '--typography-size-30',
  },
  {
    description: 'Standard multi-line reading rhythm for body content.',
    previewKind: 'typography-line-height',
    token: '--typography-line-height-24',
  },
  {
    description: 'Semibold emphasis weight for labels and compact headings.',
    previewKind: 'typography-weight',
    token: '--typography-weight-semibold',
  },
] as const;

const resolvedScaleTokens = [
  ...spacingReferenceRows.map((row) => row.token),
  ...typographyReferenceRows.map((row) => row.token),
] as const;

function createSourceUrl(path: string) {
  return `${REPO_BASE_URL}${path.replace(/^\/+/, '')}`;
}

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

function useResolvedCssValues(tokens: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = window.getComputedStyle(root);
    const nextValues = Object.fromEntries(
      tokens.map((token) => [token, computedStyle.getPropertyValue(token).trim()]),
    );

    setValues(nextValues);
  }, [tokens]);

  return values;
}

function DocSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className='docs-section-heading'>{children}</h2>;
}

function ColorSwatch({ value }: { value: string }) {
  return <span className='token-swatch' style={{ backgroundColor: value }} title={value} />;
}

function TokenCode({ children }: { children: ReactNode }) {
  return <code className='token-code'>{children}</code>;
}

function TokenPreview({ row }: { row: ScaleReferenceRow }) {
  if (row.previewKind === 'spacing') {
    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__spacing'
          style={{ height: `var(${row.token})`, width: `var(${row.token})` }}
        />
      </span>
    );
  }

  if (row.previewKind === 'typography-size') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-size' style={{ fontSize: `var(${row.token})` }}>
          Aa
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-line-height') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-lines' style={{ lineHeight: `var(${row.token})` }}>
          <span>Ag</span>
          <span>Ag</span>
        </span>
      </span>
    );
  }

  return (
    <span className='token-preview token-preview--text'>
      <span className='token-preview__type-weight' style={{ fontWeight: `var(${row.token})` }}>
        Aa
      </span>
    </span>
  );
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

function TokenReferenceTable({
  heading,
  rows,
}: {
  heading: string;
  rows: readonly ScaleReferenceRow[];
}) {
  const resolvedValues = useResolvedCssValues(resolvedScaleTokens);
  const sectionId = `token-${heading.toLowerCase()}`;

  return (
    <section className='docs-surface docs-surface--flush' id={sectionId}>
      <DocSectionHeading>{heading}</DocSectionHeading>
      <div className='token-table-wrap'>
        <table className='token-table'>
          <thead>
            <tr>
              <th>Token</th>
              <th>Resolved value</th>
              <th>Preview</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              return (
                <tr key={row.token}>
                  <td data-label='Token'>
                    <TokenCode>{row.token}</TokenCode>
                  </td>
                  <td data-label='Resolved value'>
                    <TokenCode>{resolvedValues[row.token] || `var(${row.token})`}</TokenCode>
                  </td>
                  <td data-label='Preview'>
                    <TokenPreview row={row} />
                  </td>
                  <td data-label='Use'>{row.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ThemeColorReferenceTable() {
  return (
    <section className='docs-surface docs-surface--flush' id='token-color'>
      <DocSectionHeading>Color</DocSectionHeading>
      <div className='token-table-wrap'>
        <table className='token-table'>
          <thead>
            <tr>
              <th>Token</th>
              <th>Light</th>
              <th>Dark</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            {themeColorReferenceRows.map((row) => {
              const lightValue = hoiteThemeColorValues.light[row.key];
              const darkValue = hoiteThemeColorValues.dark[row.key];

              return (
                <tr key={row.token}>
                  <td data-label='Token'>
                    <TokenCode>{row.token}</TokenCode>
                  </td>
                  <td data-label='Light'>
                    <span className='token-color-cell'>
                      <ColorSwatch value={lightValue} />
                      <TokenCode>{lightValue}</TokenCode>
                    </span>
                  </td>
                  <td data-label='Dark'>
                    <span className='token-color-cell'>
                      <ColorSwatch value={darkValue} />
                      <TokenCode>{darkValue}</TokenCode>
                    </span>
                  </td>
                  <td data-label='Use'>{row.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function RouteCardGrid({ cards }: { cards: readonly RouteCard[] }) {
  return (
    <div className='route-card-grid'>
      {cards.map((card) => {
        return (
          <Link className='route-card' href={card.href} key={card.href}>
            <span className='route-card__label'>{card.label}</span>
            <span className='route-card__body'>{card.body}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function StorybookLinkList({
  heading,
  links,
}: {
  heading: string;
  links: readonly StorybookLink[];
}) {
  return (
    <section className='docs-surface'>
      <DocSectionHeading>{heading}</DocSectionHeading>
      <div className='story-link-list'>
        {links.map((link) => {
          return (
            <Link className='story-link' href={link.href} key={link.href}>
              <span className='story-link__label'>{link.label}</span>
              <span className='story-link__summary'>{link.summary}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SourceLinksList({
  heading = 'Source',
  links,
}: {
  heading?: string;
  links: readonly SourceLink[];
}) {
  return (
    <section className='docs-surface'>
      <DocSectionHeading>{heading}</DocSectionHeading>
      <ul className='source-link-list'>
        {links.map((link) => {
          return (
            <li className='source-link-item' key={link.path}>
              <a
                className='source-link-anchor'
                href={createSourceUrl(link.path)}
                rel='noreferrer'
                target='_blank'
              >
                <span className='source-link-label'>{link.label}</span>
                <code className='source-link-path'>{link.path}</code>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
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
                <Tag className={className}>Shared {sample.variant} contract</Tag>
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

export function TokenReferenceTables() {
  return (
    <div className='docs-stack-lg'>
      <section className='docs-surface'>
        <DocSectionHeading>Browse by category</DocSectionHeading>
        <nav className='token-nav' aria-label='Token categories'>
          <a className='token-nav__link' href='#token-color'>
            Color
          </a>
          <a className='token-nav__link' href='#token-spacing'>
            Spacing
          </a>
          <a className='token-nav__link' href='#token-typography'>
            Typography
          </a>
        </nav>
      </section>
      <ThemeColorReferenceTable />
      <TokenReferenceTable heading='Spacing' rows={spacingReferenceRows} />
      <TokenReferenceTable heading='Typography' rows={typographyReferenceRows} />
    </div>
  );
}

export const typographySourceLinks = [
  ...typographyDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/static/Typography/Typography.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/static/Typography/Typography.vue',
  },
] as const satisfies readonly SourceLink[];

export const codeBlockSourceLinks = [
  ...codeBlockDocs.sourceLinks,
  {
    label: 'React implementation',
    path: 'packages/ui-react/src/components/primitives/static/CodeBlock/CodeBlock.tsx',
  },
  {
    label: 'Vue implementation',
    path: 'packages/ui-vue/src/components/primitives/static/CodeBlock/CodeBlock.vue',
  },
] as const satisfies readonly SourceLink[];
