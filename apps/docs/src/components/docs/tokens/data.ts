import { tokens } from '@hoite-dev/ui';
import type {
  DocsShellGuidanceCard,
  ThemedColorReferenceRow,
  TokenLeaf,
  TokenPreviewKind,
  TokenReferenceRow,
  TokenSection,
} from './types';

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

export function formatTokenValue(value: unknown) {
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

export const docsShellGuidanceCards: readonly DocsShellGuidanceCard[] = [
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

export const semanticColorRows = createThemedColorRows();

export const primitiveColorRows = flattenTokenGroup({
  path: ['primitive'],
  section: 'primitive',
  value: tokens.primitive,
});

export const tokenReferenceSections: readonly TokenSection[] = [
  {
    navLabel: 'Layout',
    rows: flattenTokenGroup({
      path: ['layout'],
      section: 'layout',
      value: tokens.layout,
    }),
    slug: 'layout',
  },
  {
    navLabel: 'Spacing',
    rows: flattenTokenGroup({
      path: ['spacing'],
      section: 'spacing',
      value: tokens.spacing,
    }),
    slug: 'spacing',
  },
  {
    navLabel: 'Radius',
    rows: flattenTokenGroup({
      path: ['radius'],
      section: 'radius',
      value: tokens.radius,
    }),
    slug: 'radius',
  },
  {
    navLabel: 'Size',
    rows: flattenTokenGroup({
      path: ['size'],
      section: 'size',
      value: tokens.size,
    }),
    slug: 'size',
  },
  {
    navLabel: 'Z-stack',
    rows: flattenTokenGroup({
      path: ['z-stack'],
      section: 'z-stack',
      value: tokens.zStack,
    }),
    slug: 'z-stack',
  },
  {
    navLabel: 'Stroke',
    rows: flattenTokenGroup({
      path: ['stroke'],
      section: 'stroke',
      value: tokens.stroke,
    }),
    slug: 'stroke',
  },
  {
    navLabel: 'Motion',
    rows: flattenTokenGroup({
      path: ['motion'],
      section: 'motion',
      value: tokens.motion,
    }),
    slug: 'motion',
  },
  {
    navLabel: 'Typography',
    rows: flattenTokenGroup({
      path: ['typography'],
      section: 'typography',
      value: tokens.typography,
    }),
    slug: 'typography',
  },
] as const;

export const tokenReferenceNavItems = [
  {
    navLabel: 'Color',
    slug: 'color',
  },
  ...tokenReferenceSections.map((section) => ({
    navLabel: section.navLabel,
    slug: section.slug,
  })),
] as const;

export const resolvedReferenceTokens = [
  ...new Set(
    tokenReferenceSections.flatMap((section) => {
      return section.rows.map((row) => row.token);
    }),
  ),
  ...primitiveColorRows.map((row) => row.token),
  ...docsShellGuidanceCards.map((card) => card.token),
] as const;

export function getTokenSection(slug: string) {
  return tokenReferenceSections.find((section) => section.slug === slug);
}
