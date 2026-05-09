import type { ReactNode } from 'react';

type ContractSectionProps = {
  bodyClassName?: string;
  children: ReactNode;
  headingLevel?: 'h2' | 'h3';
  title: string;
};

type ContractSubsectionProps = {
  children: ReactNode;
  title: string;
};

type ContractTableColumn<Row> = {
  breakAll?: boolean;
  header: string;
  render: (row: Row) => string;
};

type ContractTableProps<Row> = {
  columns: readonly ContractTableColumn<Row>[];
  getRowKey: (row: Row) => string;
  rows: readonly Row[];
};

type CodeChipListProps<Item> = {
  getItemKey: (item: Item) => string;
  getItemValue?: (item: Item) => string;
  items: readonly Item[];
};

const pageClassName = 'mx-auto max-w-5xl py-6 text-[var(--color-text-primary)]';
const pageGridClassName = 'grid gap-6';
const sectionClassName = 'grid gap-2';
const sectionHeadingClassName = 'm-0 text-base font-semibold text-[var(--color-text-primary)]';
const subsectionHeadingClassName = 'm-0 text-sm font-semibold text-[var(--color-text-primary)]';
const chipClassName = 'rounded-[var(--radius-sm)] bg-[var(--color-surface-secondary)] px-2 py-1';
const tableHeadCellClassName =
  'border-b border-[var(--color-border-default)] p-2 text-left align-top text-sm font-semibold';
const tableCellClassName = 'border-b border-[var(--color-border-muted)] p-2 align-top';

export function ContractPage({ children }: { children: ReactNode }) {
  return (
    <div className={pageClassName}>
      <div className={pageGridClassName}>{children}</div>
    </div>
  );
}

export function ContractSection({
  bodyClassName = sectionClassName,
  children,
  headingLevel = 'h2',
  title,
}: ContractSectionProps) {
  const Heading = headingLevel;

  return (
    <section className={bodyClassName}>
      <Heading className={sectionHeadingClassName}>{title}</Heading>
      {children}
    </section>
  );
}

export function ContractSubsection({ children, title }: ContractSubsectionProps) {
  return (
    <section className={sectionClassName}>
      <h3 className={subsectionHeadingClassName}>{title}</h3>
      {children}
    </section>
  );
}

export function CodeChipList<Item>({ getItemKey, getItemValue, items }: CodeChipListProps<Item>) {
  return (
    <div className='flex flex-wrap gap-2'>
      {items.map((item) => {
        const itemKey = getItemKey(item);
        const itemValue = getItemValue ? getItemValue(item) : itemKey;

        return (
          <code className={chipClassName} key={itemKey}>
            {itemValue}
          </code>
        );
      })}
    </div>
  );
}

export function ContractTable<Row>({ columns, getRowKey, rows }: ContractTableProps<Row>) {
  return (
    <div className='overflow-auto'>
      <table className='min-w-full border-collapse'>
        <thead>
          <tr>
            {columns.map((column) => {
              return (
                <th className={tableHeadCellClassName} key={column.header}>
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = getRowKey(row);

            return (
              <tr key={rowKey}>
                {columns.map((column) => {
                  const breakAllClassName = column.breakAll ? ' break-all' : '';

                  return (
                    <td className={`${tableCellClassName}${breakAllClassName}`} key={column.header}>
                      <code>{column.render(row)}</code>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
