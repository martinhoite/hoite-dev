import type { ReactNode } from 'react';
import React from 'react';

void React;

import { TokenPreview } from './TokenPreview';
import { formatDurationDisplayValue } from './tokenFormat';
import type { ColorTokenRow, CssValueMap, TokenCategoryRow } from './tokenModel';

type ColorTokenTableProps = {
  rows: readonly ColorTokenRow[];
};

type TokenCategoryTableProps = {
  cssValues: CssValueMap;
  prefersReducedMotion: boolean;
  rows: readonly TokenCategoryRow[];
  tokenHeaderLabel: string;
};

function CodeValue({ value }: { value: string }) {
  return (
    <code className='inline-block rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-text-primary)]'>
      {value}
    </code>
  );
}

function TokenName({ value }: { value: string }) {
  return <CodeValue value={value} />;
}

function TableCell({ children, label }: { children: ReactNode; label: string }) {
  return <td data-label={label}>{children}</td>;
}

function MissingState() {
  return <span className='italic text-[var(--color-text-muted)]'>Missing</span>;
}

function ColorSwatch({ value }: { value: string | null }) {
  if (!value) {
    return <MissingState />;
  }

  return (
    <span
      className='inline-block h-5 w-11 rounded-[var(--radius-xs)] border border-[var(--color-border-default)]'
      style={{ backgroundColor: value }}
      title={value}
    />
  );
}

export function ColorTokenTable({ rows }: ColorTokenTableProps) {
  return (
    <table className='hoite-token-doc__table'>
      <thead>
        <tr>
          <th>Token</th>
          <th>Light value</th>
          <th>Light swatch</th>
          <th>Dark value</th>
          <th>Dark swatch</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          return (
            <tr key={row.key}>
              <TableCell label='Token'>
                <TokenName value={row.name} />
              </TableCell>
              <TableCell label='Light value'>
                {row.lightValue ? <CodeValue value={row.lightValue} /> : <MissingState />}
              </TableCell>
              <TableCell label='Light swatch'>
                <ColorSwatch value={row.lightColor} />
              </TableCell>
              <TableCell label='Dark value'>
                {row.darkValue ? <CodeValue value={row.darkValue} /> : <MissingState />}
              </TableCell>
              <TableCell label='Dark swatch'>
                <ColorSwatch value={row.darkColor} />
              </TableCell>
              <TableCell label='Description'>{row.description ?? '-'}</TableCell>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function TokenCategoryTable({
  cssValues,
  prefersReducedMotion,
  rows,
  tokenHeaderLabel,
}: TokenCategoryTableProps) {
  const showPreview = rows.some((row) => row.previewKind !== 'none');

  return (
    <table className='hoite-token-doc__table'>
      <thead>
        <tr>
          <th>{tokenHeaderLabel}</th>
          <th>Value</th>
          {showPreview ? <th>Preview</th> : null}
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const resolvedCssValue = cssValues[row.cssVarName] || row.value;
          const displayValue = formatDurationDisplayValue(
            resolvedCssValue,
            row.previewKind === 'motion-duration',
          );

          return (
            <tr key={`${row.rawPath}-${row.cssVarName}`}>
              <TableCell label='Token'>
                <TokenName value={row.displayName} />
              </TableCell>
              <TableCell label='Value'>
                <CodeValue value={displayValue} />
              </TableCell>
              {showPreview ? (
                <TableCell label='Preview'>
                  <TokenPreview
                    cssValue={resolvedCssValue}
                    prefersReducedMotion={prefersReducedMotion}
                    row={row}
                  />
                </TableCell>
              ) : null}
              <TableCell label='Description'>{row.description ?? '-'}</TableCell>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
