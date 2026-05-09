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

function isTokenLeaf(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) {
    return false;
  }

  if ('$value' in value || '$type' in value || '$description' in value) {
    return true;
  }

  return false;
}

export function flattenTokenTree(tree: unknown, path: readonly string[] = []): TokenRow[] {
  if (!isRecord(tree)) {
    return [];
  }

  if (isTokenLeaf(tree)) {
    const cssVarName = resolveCssVar(path, tree);
    const rawPath = path.join('.');
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
    if (key.startsWith('$')) {
      continue;
    }

    leaves.push(...flattenTokenTree(child, [...path, key]));
  }

  return leaves;
}

function isColorToken(token: TokenRow): boolean {
  if (token.tokenType === 'color') {
    return true;
  }

  if (token.cssVarName.startsWith('--color-') || token.cssVarName.startsWith('--primitive-')) {
    return true;
  }

  return false;
}

function resolvePreviewKind(category: string, token: TokenRow): TokenPreviewKind {
  const normalizedGroup = token.groupPath.toLowerCase();

  if (normalizedGroup.includes('loading')) {
    return 'none';
  }

  if (category === 'layout' && normalizedGroup === 'grid-container') {
    return 'none';
  }

  if (isColorToken(token)) {
    return 'color';
  }

  if (token.cssVarName.includes('--motion-duration')) {
    return 'motion-duration';
  }

  if (token.cssVarName.includes('--motion-easing')) {
    return 'motion-easing';
  }

  if (token.cssVarName.includes('--layout-grid-') && token.cssVarName.includes('-columns')) {
    return 'layout-grid-columns';
  }

  if (token.cssVarName.includes('--layout-gutter-')) {
    return 'layout-gutter';
  }

  if (token.cssVarName.includes('--layout-container-')) {
    return 'layout-container';
  }

  if (token.cssVarName.includes('--typography-weight-')) {
    return 'typography-weight';
  }

  if (token.cssVarName.includes('--typography-size-')) {
    return 'typography-size';
  }

  if (token.cssVarName.includes('--typography-letter-spacing-')) {
    return 'typography-letter-spacing';
  }

  if (token.cssVarName.includes('--typography-family-')) {
    return 'typography-family';
  }

  if (token.cssVarName.includes('--typography-line-height-')) {
    return 'typography-line-height';
  }

  if (token.cssVarName.includes('--typography-paragraph-spacing-')) {
    return 'typography-paragraph-spacing';
  }

  if (token.cssVarName.includes('--radius-')) {
    return 'radius';
  }

  if (token.cssVarName.includes('--stroke-')) {
    return 'stroke';
  }

  if (token.cssVarName.includes('--spacing-')) {
    return 'spacing';
  }

  if (token.cssVarName.includes('--size-')) {
    return 'size';
  }

  return 'none';
}

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
