import { tokens } from '@hoite-dev/ui';

import {
  isRecord,
  parseNumber,
  resolveColorDisplayValue,
  resolveColorSwatchValue,
  resolveCssVar,
  resolveTokenValue,
  toCategoryLabel,
} from './tokenFormat';

export type TokenPreviewKind =
  | 'color'
  | 'layout-container'
  | 'layout-grid-columns'
  | 'layout-gutter'
  | 'motion-duration'
  | 'motion-easing'
  | 'none'
  | 'radius'
  | 'size'
  | 'spacing'
  | 'stroke'
  | 'typography-family'
  | 'typography-letter-spacing'
  | 'typography-line-height'
  | 'typography-paragraph-spacing'
  | 'typography-size'
  | 'typography-weight';

export type CssValueMap = Record<string, string>;

/**
 * Normalized leaf token data. The source token tree can nest arbitrary groups,
 * but the stories render a flat list first and add grouping back later.
 */
export type TokenRow = {
  cssVarName: string;
  description: string | null;
  groupPath: string;
  rawPath: string;
  rawValue: unknown;
  tokenType: string | null;
  value: string;
};

export type TokenCategoryRow = TokenRow & {
  displayName: string;
  previewKind: TokenPreviewKind;
};

export type ColorTokenRow = {
  darkColor: string | null;
  darkValue: string | null;
  description: string | null;
  key: string;
  lightColor: string | null;
  lightValue: string | null;
  name: string;
  sortValue: number;
};

export type TokenGroup = {
  name: string;
  rows: TokenCategoryRow[];
  tokenHeaderLabel: string;
};

export type TokenCategory = {
  groups: TokenGroup[];
  id: string;
  label: string;
  name: string;
};

const tokenSource = tokens as Record<string, unknown>;

/**
 * A token leaf is any object that looks like a design token, even if it only
 * carries metadata. Groups can contain `$` keys too, so callers still recurse
 * into non-leaf objects instead of treating every record as renderable.
 */
function isTokenLeaf(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) {
    return false;
  }

  if ('$value' in value || '$type' in value || '$description' in value) {
    return true;
  }

  return false;
}

/**
 * Converts the nested token export into display rows. `path` tracks the token's
 * location so CSS variable names, duplicate-name suffixes, and group labels can
 * be derived from the same source of truth.
 */
export function flattenTokenTree(tree: unknown, path: readonly string[] = []): TokenRow[] {
  if (!isRecord(tree)) {
    return [];
  }

  if (isTokenLeaf(tree)) {
    const cssVarName = resolveCssVar(path, tree);
    const rawPath = path.join('.');
    // Drop the top-level category and leaf key from section labels. The middle
    // path segments are the human-facing groups shown in the token tables.
    const groupPath = path.length > 2 ? path.slice(1, -1).join(' / ') : 'Base';

    return [
      {
        cssVarName,
        description: typeof tree.$description === 'string' ? tree.$description : null,
        groupPath,
        rawValue: tree.$value,
        rawPath,
        tokenType: typeof tree.$type === 'string' ? tree.$type : null,
        value: resolveTokenValue(tree.$value),
      },
    ];
  }

  const leaves: TokenRow[] = [];

  for (const [key, child] of Object.entries(tree)) {
    // Design-token metadata keys describe the current node; they are not child
    // groups and should not become their own rows.
    if (key.startsWith('$')) {
      continue;
    }

    leaves.push(...flattenTokenTree(child, [...path, key]));
  }

  return leaves;
}

/**
 * Color tokens are special-cased because the docs combine light and dark rows
 * into one comparison table instead of using the generic category renderer.
 */
function isColorToken(token: TokenRow): boolean {
  if (token.tokenType === 'color') {
    return true;
  }

  if (token.cssVarName.startsWith('--color-') || token.cssVarName.startsWith('--primitive-')) {
    return true;
  }

  return false;
}

/**
 * Declarative matcher for the generic token preview components. Color and none
 * are excluded because they are resolved by explicit guard clauses.
 */
type TokenPreviewKindRule = {
  kind: Exclude<TokenPreviewKind, 'color' | 'none'>;
  matches: (token: TokenRow) => boolean;
};

function cssVarIncludes(fragment: string): (token: TokenRow) => boolean {
  return (token) => token.cssVarName.includes(fragment);
}

/**
 * Ordered from most specific to most general. Some names overlap, for example
 * layout grid tokens may also include size-like values, so first match wins.
 */
const tokenPreviewKindRules: readonly TokenPreviewKindRule[] = [
  {
    kind: 'motion-duration',
    matches: cssVarIncludes('--motion-duration'),
  },
  {
    kind: 'motion-easing',
    matches: cssVarIncludes('--motion-easing'),
  },
  {
    kind: 'layout-grid-columns',
    matches: (token) =>
      token.cssVarName.includes('--layout-grid-') && token.cssVarName.includes('-columns'),
  },
  {
    kind: 'layout-gutter',
    matches: cssVarIncludes('--layout-gutter-'),
  },
  {
    kind: 'layout-container',
    matches: cssVarIncludes('--layout-container-'),
  },
  {
    kind: 'typography-weight',
    matches: cssVarIncludes('--typography-weight-'),
  },
  {
    kind: 'typography-size',
    matches: cssVarIncludes('--typography-size-'),
  },
  {
    kind: 'typography-letter-spacing',
    matches: cssVarIncludes('--typography-letter-spacing-'),
  },
  {
    kind: 'typography-family',
    matches: cssVarIncludes('--typography-family-'),
  },
  {
    kind: 'typography-line-height',
    matches: cssVarIncludes('--typography-line-height-'),
  },
  {
    kind: 'typography-paragraph-spacing',
    matches: cssVarIncludes('--typography-paragraph-spacing-'),
  },
  {
    kind: 'radius',
    matches: cssVarIncludes('--radius-'),
  },
  {
    kind: 'stroke',
    matches: cssVarIncludes('--stroke-'),
  },
  {
    kind: 'spacing',
    matches: cssVarIncludes('--spacing-'),
  },
  {
    kind: 'size',
    matches: cssVarIncludes('--size-'),
  },
];

/**
 * Selects the preview renderer for a token row. Category/group exclusions run
 * before CSS-name matching because a token can technically match a preview kind
 * while still being clearer without a visual preview in the docs.
 */
function resolvePreviewKind(category: string, token: TokenRow): TokenPreviewKind {
  const normalizedGroup = token.groupPath.toLowerCase();

  // Loading tokens include timing and size values, but the loading table reads
  // better as raw API data than as a set of tiny visual previews.
  if (normalizedGroup.includes('loading')) {
    return 'none';
  }

  // Grid container tokens describe named breakpoint containers, not a single
  // visual measure, so a generic layout preview would be misleading.
  if (category === 'layout' && normalizedGroup === 'grid-container') {
    return 'none';
  }

  if (isColorToken(token)) {
    return 'color';
  }

  const matchingRule = tokenPreviewKindRules.find((rule) => rule.matches(token));

  if (matchingRule) {
    return matchingRule.kind;
  }

  return 'none';
}

/**
 * When two source tokens resolve to the same CSS variable, keep the CSS var as
 * the primary label and append the source leaf name so both rows remain
 * distinguishable in the docs table.
 */
function normalizeDuplicateDisplayNames(rows: TokenCategoryRow[]): TokenCategoryRow[] {
  const displayCounts = new Map<string, number>();

  for (const row of rows) {
    const count = displayCounts.get(row.cssVarName) ?? 0;
    displayCounts.set(row.cssVarName, count + 1);
  }

  return rows.map((row) => {
    if ((displayCounts.get(row.cssVarName) ?? 0) <= 1) {
      return row;
    }

    const pathParts = row.rawPath.split('.');
    const suffix = pathParts[pathParts.length - 1] ?? row.rawPath;

    return {
      ...row,
      displayName: `${row.cssVarName} (${suffix})`,
    };
  });
}

/**
 * Sort numeric scales by their resolved runtime value when possible, then fall
 * back to CSS variable names for non-numeric tokens such as font families and
 * easing functions.
 */
function sortRows(rows: TokenCategoryRow[], cssValues: CssValueMap): TokenCategoryRow[] {
  return [...rows].sort((leftRow, rightRow) => {
    const left = parseNumber(cssValues[leftRow.cssVarName] || leftRow.value);
    const right = parseNumber(cssValues[rightRow.cssVarName] || rightRow.value);

    if (left !== null && right !== null && left !== right) {
      return left - right;
    }

    return leftRow.cssVarName.localeCompare(rightRow.cssVarName);
  });
}

/**
 * Returns non-color token categories in stable docs order. Primitive tokens are
 * kept first because other token groups often reference them conceptually.
 */
function getNonColorTokenEntries(): [string, unknown][] {
  const entries = Object.entries(tokenSource).filter(([category]) => category !== 'color');

  entries.sort(([left], [right]) => {
    if (left === right) {
      return 0;
    }

    if (left === 'primitive') {
      return -1;
    }

    if (right === 'primitive') {
      return 1;
    }

    return left.localeCompare(right);
  });

  return entries;
}

/**
 * Builds the dedicated color table by joining light and dark theme tokens on
 * CSS variable name. Theme-only tokens are still included with a null value on
 * the missing side.
 */
export function createColorRows(): ColorTokenRow[] {
  const colorTokens = isRecord(tokenSource.color) ? tokenSource.color : {};
  const lightTokens = flattenTokenTree(colorTokens.light, ['color']);
  const darkTokens = flattenTokenTree(colorTokens.dark, ['color']);
  const rowsByKey = new Map<string, ColorTokenRow>();

  for (const token of lightTokens) {
    const key = token.cssVarName || token.rawPath;

    rowsByKey.set(key, {
      darkColor: null,
      darkValue: null,
      description: token.description,
      key,
      lightColor: resolveColorSwatchValue(token.rawValue),
      lightValue: resolveColorDisplayValue(token.rawValue),
      name: token.cssVarName,
      sortValue: parseNumber(token.value) ?? Number.MAX_SAFE_INTEGER,
    });
  }

  for (const token of darkTokens) {
    const key = token.cssVarName || token.rawPath;
    const existing = rowsByKey.get(key);

    if (existing) {
      existing.darkColor = resolveColorSwatchValue(token.rawValue);
      existing.darkValue = resolveColorDisplayValue(token.rawValue);

      if (!existing.description && token.description) {
        existing.description = token.description;
      }

      continue;
    }

    rowsByKey.set(key, {
      darkColor: resolveColorSwatchValue(token.rawValue),
      darkValue: resolveColorDisplayValue(token.rawValue),
      description: token.description,
      key,
      lightColor: null,
      lightValue: null,
      name: token.cssVarName,
      sortValue: parseNumber(token.value) ?? Number.MAX_SAFE_INTEGER,
    });
  }

  const rows = [...rowsByKey.values()];
  rows.sort((left, right) => {
    if (left.sortValue !== right.sortValue) {
      return left.sortValue - right.sortValue;
    }

    return left.name.localeCompare(right.name);
  });

  return rows;
}

/**
 * Builds the generic token category model consumed by the hub stories:
 * flatten each source tree, add preview metadata, group by display section, and
 * sort rows with optional resolved CSS values from the running Storybook frame.
 */
export function createTokenCategories(cssValues: CssValueMap = {}): TokenCategory[] {
  return getNonColorTokenEntries().map(([category, tree]) => {
    const flattened = flattenTokenTree(tree, [category]);
    const grouped = new Map<string, TokenCategoryRow[]>();

    for (const leaf of flattened) {
      const row: TokenCategoryRow = {
        ...leaf,
        displayName: leaf.cssVarName,
        previewKind: resolvePreviewKind(category, leaf),
      };
      const groupRows = grouped.get(leaf.groupPath);

      if (groupRows) {
        groupRows.push(row);
        continue;
      }

      grouped.set(leaf.groupPath, [row]);
    }

    const groups = [...grouped.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([groupName, rows]) => {
        const sortedRows = sortRows(rows, cssValues);

        return {
          name: groupName,
          rows: normalizeDuplicateDisplayNames(sortedRows),
          tokenHeaderLabel: `${groupName} token`,
        };
      });

    return {
      groups,
      id: `token-${category}`,
      label: toCategoryLabel(category),
      name: category,
    };
  });
}

export function getAllTokenVarNames(
  colorRows: readonly ColorTokenRow[],
  categories: readonly TokenCategory[],
): string[] {
  const varNames = new Set<string>();

  for (const row of colorRows) {
    varNames.add(row.name);
  }

  for (const category of categories) {
    for (const group of category.groups) {
      for (const row of group.rows) {
        varNames.add(row.cssVarName);
      }
    }
  }

  return [...varNames];
}
