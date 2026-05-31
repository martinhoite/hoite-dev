import Link from '@docusaurus/Link';
import { codeBlockDocs, tokens, typographyDocs } from '@hoite-dev/ui';
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

type DocsHeroAction = {
  href: string;
  label: string;
  tone?: 'primary' | 'secondary';
};

type DocsHeroMetric = {
  label: string;
  token: string;
};

type DocsHeroPanel = {
  body: string;
  href?: string;
  label: string;
  linkLabel?: string;
  tone?: 'accent' | 'brand' | 'neutral';
};

type DocsShellGuidanceCard = {
  body: string;
  eyebrow: string;
  title: string;
  token: string;
};

type SourceLink = {
  label: string;
  path: string;
};

type TokenLeaf = {
  $description?: string;
  $extensions?: {
    'com.figma.codeSyntax'?: {
      WEB?: string;
    };
  };
  $type: string;
  $value: unknown;
};

type TokenPreviewKind =
  | 'color'
  | 'layout-container'
  | 'layout-grid-columns'
  | 'layout-gutter'
  | 'motion-duration'
  | 'motion-easing'
  | 'radius'
  | 'size'
  | 'spacing'
  | 'stroke'
  | 'text'
  | 'typography-family'
  | 'typography-letter-spacing'
  | 'typography-line-height'
  | 'typography-paragraph-spacing'
  | 'typography-size'
  | 'typography-weight'
  | 'z-stack';

type TokenReferenceRow = {
  description: string;
  previewKind: TokenPreviewKind;
  rawValue: unknown;
  token: string;
  type: string;
};

type TokenSection = {
  heading: string;
  navLabel: string;
  rows: readonly TokenReferenceRow[];
  slug: string;
};

type ThemedColorReferenceRow = {
  description: string;
  darkValue: string;
  lightValue: string;
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

const docsShellGuidanceCards: readonly DocsShellGuidanceCard[] = [
  {
    body: 'The docs shell should stay inside the same wide desktop frame used in the design system examples instead of stretching edge to edge.',
    eyebrow: 'Frame',
    title: 'Container width anchors the composition',
    token: '--layout-container-max',
  },
  {
    body: 'Horizontal padding should follow the layout gutter tokens so nav, page content, and footer columns align on the same rhythm.',
    eyebrow: 'Gutter',
    title: 'Outer spacing is a layout rule, not ad hoc padding',
    token: '--layout-gutter-desktop',
  },
  {
    body: 'Top-level sections need larger vertical cadence than card internals so the docs feel authored rather than stacked by defaults.',
    eyebrow: 'Rhythm',
    title: 'Section spacing should step up to editorial scale',
    token: '--spacing-64',
  },
  {
    body: 'The shell should move from canvas to surface to raised surface with restrained borders, not heavy custom chrome.',
    eyebrow: 'Surface',
    title: 'Layering comes from the surface tokens',
    token: '--color-bg-surface-raised',
  },
] as const;

function isTokenLeaf(value: unknown): value is TokenLeaf {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.$type !== 'string') {
    return false;
  }

  return '$value' in candidate;
}

function createFallbackCssVariable(path: readonly string[]) {
  return `--${path.join('-')}`;
}

function extractCssVariableName(value: string) {
  const match = value.match(/^var\((--[^)]+)\)$/);

  if (match?.[1]) {
    return match[1];
  }

  return value;
}

function inferTokenPreviewKind(
  section: string,
  path: readonly string[],
  type: string,
): TokenPreviewKind {
  const joinedPath = path.join('.');

  if (section === 'color' || section === 'primitive') {
    return 'color';
  }

  if (section === 'layout') {
    if (joinedPath.includes('columns')) {
      return 'layout-grid-columns';
    }

    if (joinedPath.includes('gutter')) {
      return 'layout-gutter';
    }

    return 'layout-container';
  }

  if (section === 'spacing') {
    return 'spacing';
  }

  if (section === 'radius') {
    return 'radius';
  }

  if (section === 'size') {
    return 'size';
  }

  if (section === 'z-stack') {
    return 'z-stack';
  }

  if (section === 'stroke') {
    return 'stroke';
  }

  if (section === 'motion') {
    if (type === 'number') {
      return 'motion-duration';
    }

    if (joinedPath.includes('easing')) {
      return 'motion-easing';
    }

    return 'text';
  }

  if (section === 'typography') {
    if (joinedPath.includes('family')) {
      return 'typography-family';
    }

    if (joinedPath.includes('letter-spacing')) {
      return 'typography-letter-spacing';
    }

    if (joinedPath.includes('line-height')) {
      return 'typography-line-height';
    }

    if (joinedPath.includes('paragraph-spacing')) {
      return 'typography-paragraph-spacing';
    }

    if (joinedPath.includes('size')) {
      return 'typography-size';
    }

    if (joinedPath.includes('weight')) {
      return 'typography-weight';
    }
  }

  return 'text';
}

function flattenTokenGroup({
  path = [],
  section,
  value,
}: {
  path?: string[];
  section: string;
  value: unknown;
}): TokenReferenceRow[] {
  if (isTokenLeaf(value)) {
    const webSyntax = value.$extensions?.['com.figma.codeSyntax']?.WEB;
    const token = webSyntax ? extractCssVariableName(webSyntax) : createFallbackCssVariable(path);

    return [
      {
        description: value.$description ?? '',
        previewKind: inferTokenPreviewKind(section, path, value.$type),
        rawValue: value.$value,
        token,
        type: value.$type,
      },
    ];
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const rows: TokenReferenceRow[] = [];

  for (const [key, childValue] of Object.entries(value)) {
    if (key === '$extensions') {
      continue;
    }

    rows.push(
      ...flattenTokenGroup({
        path: [...path, key],
        section,
        value: childValue,
      }),
    );
  }

  return rows;
}

function formatTokenValue(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'object' && value !== null) {
    const candidate = value as {
      hex?: string;
    };

    if (typeof candidate.hex === 'string') {
      return candidate.hex;
    }
  }

  return String(value);
}

function parseTokenNumber(value: string) {
  const match = /-?\d*\.?\d+/.exec(value);

  if (!match?.[0]) {
    return null;
  }

  return Number(match[0]);
}

function parseLengthPx(value: string) {
  const trimmed = value.trim();
  const match = /^(-?\d*\.?\d+)\s*(px|rem|%)?$/i.exec(trimmed);

  if (!match) {
    return parseTokenNumber(trimmed);
  }

  const numeric = Number(match[1]);
  const unit = (match[2] ?? '').toLowerCase();

  if (unit === 'rem') {
    return numeric * 16;
  }

  return numeric;
}

function parseDurationMs(value: string) {
  const trimmed = value.trim();
  const match = /^(-?\d*\.?\d+)\s*(ms|s)?$/i.exec(trimmed);

  if (!match) {
    return parseTokenNumber(trimmed);
  }

  const numeric = Number(match[1]);
  const unit = (match[2] ?? '').toLowerCase();

  if (unit === 's') {
    return numeric * 1000;
  }

  return numeric;
}

function createThemedColorRows(): ThemedColorReferenceRow[] {
  const lightRows = flattenTokenGroup({
    path: ['color'],
    section: 'color',
    value: tokens.color.light,
  });
  const darkRowsByToken = new Map(
    flattenTokenGroup({
      path: ['color'],
      section: 'color',
      value: tokens.color.dark,
    }).map((row) => [row.token, row]),
  );

  return lightRows.map((row) => {
    const darkRow = darkRowsByToken.get(row.token);

    return {
      description: row.description,
      darkValue: formatTokenValue(darkRow?.rawValue ?? ''),
      lightValue: formatTokenValue(row.rawValue),
      token: row.token,
    };
  });
}

const semanticColorRows = createThemedColorRows();

const primitiveColorRows = flattenTokenGroup({
  path: ['primitive'],
  section: 'primitive',
  value: tokens.primitive,
});

const tokenReferenceSections: readonly TokenSection[] = [
  {
    heading: 'Layout',
    navLabel: 'Layout',
    rows: flattenTokenGroup({
      path: ['layout'],
      section: 'layout',
      value: tokens.layout,
    }),
    slug: 'layout',
  },
  {
    heading: 'Spacing',
    navLabel: 'Spacing',
    rows: flattenTokenGroup({
      path: ['spacing'],
      section: 'spacing',
      value: tokens.spacing,
    }),
    slug: 'spacing',
  },
  {
    heading: 'Radius',
    navLabel: 'Radius',
    rows: flattenTokenGroup({
      path: ['radius'],
      section: 'radius',
      value: tokens.radius,
    }),
    slug: 'radius',
  },
  {
    heading: 'Size',
    navLabel: 'Size',
    rows: flattenTokenGroup({
      path: ['size'],
      section: 'size',
      value: tokens.size,
    }),
    slug: 'size',
  },
  {
    heading: 'Z-stack',
    navLabel: 'Z-stack',
    rows: flattenTokenGroup({
      path: ['z-stack'],
      section: 'z-stack',
      value: tokens.zStack,
    }),
    slug: 'z-stack',
  },
  {
    heading: 'Stroke',
    navLabel: 'Stroke',
    rows: flattenTokenGroup({
      path: ['stroke'],
      section: 'stroke',
      value: tokens.stroke,
    }),
    slug: 'stroke',
  },
  {
    heading: 'Motion',
    navLabel: 'Motion',
    rows: flattenTokenGroup({
      path: ['motion'],
      section: 'motion',
      value: tokens.motion,
    }),
    slug: 'motion',
  },
  {
    heading: 'Typography',
    navLabel: 'Typography',
    rows: flattenTokenGroup({
      path: ['typography'],
      section: 'typography',
      value: tokens.typography,
    }),
    slug: 'typography',
  },
] as const;

const tokenReferenceNavItems = [
  {
    navLabel: 'Color',
    slug: 'color',
  },
  ...tokenReferenceSections.map((section) => ({
    navLabel: section.navLabel,
    slug: section.slug,
  })),
] as const;

const resolvedReferenceTokens = [
  ...new Set(
    tokenReferenceSections.flatMap((section) => {
      return section.rows.map((row) => row.token);
    }),
  ),
  ...primitiveColorRows.map((row) => row.token),
  ...docsShellGuidanceCards.map((card) => card.token),
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
  const tokenKey = JSON.stringify(tokens);

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = window.getComputedStyle(root);
    const stableTokens = JSON.parse(tokenKey) as string[];
    const nextValues = Object.fromEntries(
      stableTokens.map((token) => [token, computedStyle.getPropertyValue(token).trim()]),
    );

    setValues(nextValues);
  }, [tokenKey]);

  return values;
}

function DocSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className='docs-section-heading'>{children}</h2>;
}

function DocSubsectionHeading({ children }: { children: ReactNode }) {
  return <h3 className='docs-section-subheading'>{children}</h3>;
}

export function TokenDisplayHeading({
  children,
  level,
  sticky = true,
}: {
  children: ReactNode;
  level: 'section' | 'subsection';
  sticky?: boolean;
}) {
  const classNames = ['docs-token-display-heading', `docs-token-display-heading--${level}`];

  if (!sticky) {
    classNames.push('docs-token-display-heading--static');
  }

  return (
    <div aria-hidden='true' className={classNames.join(' ')}>
      {children}
    </div>
  );
}

function ColorSwatch({ value }: { value: string }) {
  return <span className='token-swatch' style={{ backgroundColor: value }} title={value} />;
}

function TokenCode({ children, className }: { children: ReactNode; className?: string }) {
  return <code className={`token-code${className ? ` ${className}` : ''}`}>{children}</code>;
}

function MotionSweepPreview({
  animation,
  shouldAnimate,
}: {
  animation: string;
  shouldAnimate: boolean;
}) {
  return (
    <span className='token-preview token-preview--frame token-preview--motion'>
      <span className='token-preview__motion-track'>
        <span
          className='token-preview__motion-sweep'
          style={{
            animation: shouldAnimate ? animation : 'none',
            transform: shouldAnimate ? undefined : 'scaleX(1)',
          }}
        />
      </span>
    </span>
  );
}

function TokenPreview({
  prefersReducedMotion = false,
  row,
  value,
}: {
  prefersReducedMotion?: boolean;
  row: TokenReferenceRow;
  value: string;
}) {
  if (row.previewKind === 'color') {
    return <ColorSwatch value={formatTokenValue(row.rawValue)} />;
  }

  if (row.previewKind === 'layout-grid-columns') {
    const columns = Math.max(1, Math.min(parseTokenNumber(value) ?? 4, 12));
    const cells: ReactNode[] = [];

    for (let cellNumber = 1; cellNumber <= columns; cellNumber += 1) {
      cells.push(
        <span className='token-preview__layout-grid-cell' key={`${row.token}-${cellNumber}`} />,
      );
    }

    return (
      <span className='token-preview token-preview--frame token-preview--layout-grid'>
        <span
          className='token-preview__layout-grid'
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {cells}
        </span>
      </span>
    );
  }

  if (row.previewKind === 'layout-gutter') {
    const gutterPx = Math.max(parseLengthPx(value) ?? 16, 2);
    const gutterForPreview = Math.min(gutterPx, 48);

    return (
      <span className='token-preview token-preview--frame token-preview--layout-gutter'>
        <span
          className='token-preview__layout-gutter'
          style={{
            paddingLeft: `${gutterForPreview}px`,
            paddingRight: `${gutterForPreview}px`,
          }}
        >
          <span className='token-preview__layout-gutter-content'>Content</span>
        </span>
      </span>
    );
  }

  if (row.previewKind === 'layout-container') {
    const width = Math.min(Math.max(parseLengthPx(value) ?? 640, 240), 1280);
    const widthPct = Math.round((width / 1280) * 100);

    return (
      <span className='token-preview token-preview--frame token-preview--layout-container'>
        <span
          className='token-preview__layout-container'
          style={{ width: `${Math.max(20, Math.min(widthPct, 100))}%` }}
        />
      </span>
    );
  }

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

  if (row.previewKind === 'radius') {
    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__radius'
          style={{ borderRadius: `var(${row.token})` }}
          title={value}
        />
      </span>
    );
  }

  if (row.previewKind === 'size') {
    const resolvedSize = parseLengthPx(value) ?? 16;
    const clampedSize = Math.max(12, Math.min(resolvedSize, 48));

    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__size'
          style={{
            height: `${clampedSize}px`,
            width: `${clampedSize}px`,
          }}
          title={value}
        />
      </span>
    );
  }

  if (row.previewKind === 'stroke') {
    return (
      <span className='token-preview token-preview--frame'>
        <span
          className='token-preview__stroke'
          style={{ borderWidth: `var(${row.token})` }}
          title={value}
        />
      </span>
    );
  }

  if (row.previewKind === 'motion-duration') {
    const durationMs = Math.max(parseDurationMs(value) ?? 0, 0);
    const shouldAnimate = !prefersReducedMotion && durationMs > 0;

    return (
      <MotionSweepPreview
        animation={`hoite-docs-motion-sweep ${durationMs}ms var(--motion-easing-standard) infinite alternate`}
        shouldAnimate={shouldAnimate}
      />
    );
  }

  if (row.previewKind === 'motion-easing') {
    return (
      <MotionSweepPreview
        animation={`hoite-docs-motion-sweep var(--motion-duration-slow, 240ms) ${value} infinite alternate`}
        shouldAnimate={!prefersReducedMotion}
      />
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

  if (row.previewKind === 'typography-family') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-family' style={{ fontFamily: `var(${row.token})` }}>
          The quick brown fox jumps over the lazy dog.
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-letter-spacing') {
    return (
      <span className='token-preview token-preview--text'>
        <span
          className='token-preview__type-letter-spacing'
          style={{ letterSpacing: `var(${row.token})` }}
        >
          ALIGN
        </span>
      </span>
    );
  }

  if (row.previewKind === 'typography-paragraph-spacing') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-paragraph-spacing'>
          <span>Paragraph</span>
          <span
            className='token-preview__type-paragraph-gap'
            style={{ height: `var(${row.token})` }}
          />
          <span>Spacing</span>
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

  if (row.previewKind === 'typography-weight') {
    return (
      <span className='token-preview token-preview--text'>
        <span className='token-preview__type-weight' style={{ fontWeight: `var(${row.token})` }}>
          Aa
        </span>
      </span>
    );
  }

  return (
    <span className='token-preview token-preview--text'>
      <span className='token-preview__text-value'>{value}</span>
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
  hidePreviewColumn = false,
  prefersReducedMotion,
  rows,
}: {
  heading?: string;
  hidePreviewColumn?: boolean;
  prefersReducedMotion?: boolean;
  rows: readonly TokenReferenceRow[];
}) {
  const resolvedValues = useResolvedCssValues(resolvedReferenceTokens);
  const tableClassName = hidePreviewColumn
    ? 'token-table token-table--value token-table--without-preview'
    : 'token-table token-table--value';

  return (
    <section className='docs-surface docs-surface--flush docs-token-section'>
      {heading ? <DocSubsectionHeading>{heading}</DocSubsectionHeading> : null}
      <div className='token-table-wrap'>
        <table className={tableClassName}>
          <colgroup>
            <col className='token-table__col-token' />
            <col className='token-table__col-value' />
            {hidePreviewColumn ? null : <col className='token-table__col-preview' />}
            <col className='token-table__col-description' />
          </colgroup>
          <thead>
            <tr>
              <th>Token</th>
              <th>Resolved value</th>
              {hidePreviewColumn ? null : <th>Preview</th>}
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const resolvedValue = resolvedValues[row.token] || `var(${row.token})`;

              return (
                <tr key={row.token}>
                  <td data-label='Token'>
                    <TokenCode>{row.token}</TokenCode>
                  </td>
                  <td data-label='Resolved value'>
                    <TokenCode className='token-code--wrap'>{resolvedValue}</TokenCode>
                  </td>
                  {hidePreviewColumn ? null : (
                    <td data-label='Preview'>
                      <TokenPreview
                        prefersReducedMotion={prefersReducedMotion}
                        row={row}
                        value={resolvedValue}
                      />
                    </td>
                  )}
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

function ThemedColorReferenceTable({
  heading,
  rows,
}: {
  heading?: string;
  rows: readonly ThemedColorReferenceRow[];
}) {
  return (
    <section className='docs-surface docs-surface--flush docs-token-section'>
      {heading ? <DocSubsectionHeading>{heading}</DocSubsectionHeading> : null}
      <div className='token-table-wrap'>
        <table className='token-table token-table--color'>
          <colgroup>
            <col className='token-table__col-token' />
            <col className='token-table__col-color' />
            <col className='token-table__col-color' />
            <col className='token-table__col-description' />
          </colgroup>
          <thead>
            <tr>
              <th>Token</th>
              <th>Light</th>
              <th>Dark</th>
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
                  <td data-label='Light'>
                    <span className='token-color-cell'>
                      <ColorSwatch value={row.lightValue} />
                      <TokenCode className='token-code--wrap'>{row.lightValue}</TokenCode>
                    </span>
                  </td>
                  <td data-label='Dark'>
                    <span className='token-color-cell'>
                      <ColorSwatch value={row.darkValue} />
                      <TokenCode className='token-code--wrap'>{row.darkValue}</TokenCode>
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

export function DocsPageHero({
  actions,
  eyebrow,
  meta,
  metrics,
  panels,
  summary,
  title,
}: {
  actions: readonly DocsHeroAction[];
  eyebrow: string;
  meta?: string;
  metrics: readonly DocsHeroMetric[];
  panels: readonly DocsHeroPanel[];
  summary: string;
  title: string;
}) {
  const resolvedValues = useResolvedCssValues(metrics.map((metric) => metric.token));

  return (
    <section className='docs-hero-surface'>
      <div className='docs-hero-grid'>
        <div className='docs-hero-copy'>
          <p className='docs-eyebrow'>{eyebrow}</p>
          <div className='docs-hero-metrics'>
            {metrics.map((metric) => {
              const resolvedValue = resolvedValues[metric.token] || `var(${metric.token})`;

              return (
                <span className='docs-hero-metric' key={metric.token}>
                  <span className='docs-hero-metric__label'>{metric.label}</span>
                  <TokenCode>{resolvedValue}</TokenCode>
                </span>
              );
            })}
          </div>
          <h1 className='docs-display-title'>{title}</h1>
          <p className='docs-display-copy'>{summary}</p>
          <div className='docs-action-row'>
            {actions.map((action) => {
              const tone = action.tone ?? 'secondary';

              return (
                <Link className={`docs-cta docs-cta--${tone}`} href={action.href} key={action.href}>
                  {action.label}
                </Link>
              );
            })}
          </div>
          {meta ? <p className='docs-hero-meta'>{meta}</p> : null}
        </div>
        <div className='docs-hero-panel-stack'>
          {panels.map((panel) => {
            const tone = panel.tone ?? 'neutral';

            return (
              <article className={`docs-hero-panel docs-hero-panel--${tone}`} key={panel.label}>
                <p className='docs-hero-panel__label'>{panel.label}</p>
                <p className='docs-hero-panel__body'>{panel.body}</p>
                {panel.href ? (
                  <Link className='docs-inline-link' href={panel.href}>
                    {panel.linkLabel ?? 'Open reference'}
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function DocsShellGuidanceGrid() {
  const resolvedValues = useResolvedCssValues(docsShellGuidanceCards.map((card) => card.token));

  return (
    <section className='docs-surface'>
      <div className='docs-section-copy'>
        <p className='docs-eyebrow'>Token setup</p>
        <DocSectionHeading>How the docs shell should read from the token system</DocSectionHeading>
        <p className='docs-surface__intro'>
          These are the token decisions that should drive the docs frame before any page-specific
          decoration: layout width, gutters, section rhythm, and surface layering.
        </p>
      </div>
      <div className='docs-guidance-grid'>
        {docsShellGuidanceCards.map((card) => {
          const resolvedValue = resolvedValues[card.token] || `var(${card.token})`;

          return (
            <article className='docs-guidance-card' key={card.token}>
              <p className='docs-guidance-card__eyebrow'>{card.eyebrow}</p>
              <h3 className='docs-guidance-card__title'>{card.title}</h3>
              <p className='docs-guidance-card__body'>{card.body}</p>
              <div className='docs-guidance-card__token'>
                <TokenCode>{card.token}</TokenCode>
                <TokenCode>{resolvedValue}</TokenCode>
              </div>
            </article>
          );
        })}
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

function TokenSectionTable({
  hidePreviewColumn = false,
  prefersReducedMotion = false,
  slug,
}: {
  hidePreviewColumn?: boolean;
  prefersReducedMotion?: boolean;
  slug: string;
}) {
  const section = tokenReferenceSections.find((candidate) => candidate.slug === slug);

  if (!section) {
    return null;
  }

  return (
    <TokenReferenceTable
      hidePreviewColumn={hidePreviewColumn}
      prefersReducedMotion={prefersReducedMotion}
      rows={section.rows}
    />
  );
}

export function TokenCategoryNav() {
  return (
    <section className='docs-surface'>
      <nav className='token-nav' aria-label='Token categories'>
        {tokenReferenceNavItems.map((item) => {
          return (
            <a className='token-nav__link' href={`#token-${item.slug}`} key={item.slug}>
              {item.navLabel}
            </a>
          );
        })}
      </nav>
    </section>
  );
}

export function SemanticColorReferenceSection() {
  return <ThemedColorReferenceTable rows={semanticColorRows} />;
}

export function PrimitiveColorReferenceSection() {
  return <TokenReferenceTable rows={primitiveColorRows} />;
}

export function LayoutReferenceSection() {
  return <TokenSectionTable slug='layout' />;
}

export function SpacingReferenceSection() {
  return <TokenSectionTable slug='spacing' />;
}

export function RadiusReferenceSection() {
  return <TokenSectionTable slug='radius' />;
}

export function SizeReferenceSection() {
  return <TokenSectionTable slug='size' />;
}

export function ZStackReferenceSection() {
  return <TokenSectionTable hidePreviewColumn slug='z-stack' />;
}

export function StrokeReferenceSection() {
  return <TokenSectionTable slug='stroke' />;
}

export function MotionReferenceSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  return (
    <div className='docs-stack-md'>
      <label className='token-motion-toggle'>
        <input
          checked={prefersReducedMotion}
          onChange={(event) => {
            setPrefersReducedMotion(event.target.checked);
          }}
          type='checkbox'
        />
        Simulate reduced motion
      </label>
      <TokenSectionTable prefersReducedMotion={prefersReducedMotion} slug='motion' />
    </div>
  );
}

export function TypographyReferenceSection() {
  return <TokenSectionTable slug='typography' />;
}

export function TokenReferenceTables() {
  return (
    <div className='docs-stack-lg'>
      <TokenCategoryNav />
      <SemanticColorReferenceSection />
      <PrimitiveColorReferenceSection />
      <LayoutReferenceSection />
      <SpacingReferenceSection />
      <RadiusReferenceSection />
      <SizeReferenceSection />
      <ZStackReferenceSection />
      <StrokeReferenceSection />
      <MotionReferenceSection />
      <TypographyReferenceSection />
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
