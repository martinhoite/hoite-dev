import { TokenCode } from '../shared/presentation';
import { DocSubsectionHeading } from '../shared/section-headings';
import { useResolvedCssValues } from '../shared/use-resolved-css-values';
import { getTokenSection, resolvedReferenceTokens } from './data';
import { TokenPreview } from './token-preview';
import type { ThemedColorReferenceRow, TokenReferenceRow } from './types';

export function TokenReferenceTable({
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

export function ThemedColorReferenceTable({
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
                      <span
                        className='token-swatch'
                        style={{ backgroundColor: row.lightValue }}
                        title={row.lightValue}
                      />
                      <TokenCode className='token-code--wrap'>{row.lightValue}</TokenCode>
                    </span>
                  </td>
                  <td data-label='Dark'>
                    <span className='token-color-cell'>
                      <span
                        className='token-swatch'
                        style={{ backgroundColor: row.darkValue }}
                        title={row.darkValue}
                      />
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

export function TokenSectionTable({
  hidePreviewColumn = false,
  prefersReducedMotion = false,
  slug,
}: {
  hidePreviewColumn?: boolean;
  prefersReducedMotion?: boolean;
  slug: string;
}) {
  const section = getTokenSection(slug);

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
