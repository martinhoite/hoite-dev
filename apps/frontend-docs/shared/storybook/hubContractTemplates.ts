type ContractSectionTemplateOptions = {
  body: string;
  className?: string;
  headingClassName?: string;
  headingLevel?: 'h2' | 'h3';
  title: string;
};

type CodeChipListTemplateOptions = {
  itemAlias: string;
  itemsExpression: string;
  keyExpression: string;
  valueExpression?: string;
};

type ContractTableColumn = {
  breakAll?: boolean;
  header: string;
  valueExpression: string;
};

type ContractTableTemplateOptions = {
  columns: readonly ContractTableColumn[];
  rowItemAlias: string;
  rowItemsExpression: string;
  rowKeyExpression: string;
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

function dedent(content: string): string {
  const lines = content.replace(/\r\n/g, '\n').split('\n');

  while (lines.length > 0 && lines[0].trim().length === 0) {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
    lines.pop();
  }

  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    return '';
  }

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^ */);

      if (!match) {
        return 0;
      }

      return match[0].length;
    }),
  );

  return lines.map((line) => line.slice(minIndent)).join('\n');
}

function indent(content: string, spaces: number): string {
  const normalized = dedent(content);

  if (normalized.length === 0) {
    return '';
  }

  const prefix = ' '.repeat(spaces);

  return normalized
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

export function createContractPageTemplate(body: string): string {
  return [
    `<div class="${pageClassName}">`,
    `  <div class="${pageGridClassName}">`,
    indent(body, 4),
    '  </div>',
    '</div>',
  ].join('\n');
}

export function createContractSectionTemplate({
  body,
  className = sectionClassName,
  headingClassName = sectionHeadingClassName,
  headingLevel = 'h2',
  title,
}: ContractSectionTemplateOptions): string {
  return [
    `<section class="${className}">`,
    `  <${headingLevel} class="${headingClassName}">${title}</${headingLevel}>`,
    indent(body, 2),
    '</section>',
  ].join('\n');
}

export function createCodeChipListTemplate({
  itemAlias,
  itemsExpression,
  keyExpression,
  valueExpression,
}: CodeChipListTemplateOptions): string {
  const resolvedValueExpression = valueExpression ?? itemAlias;

  return [
    '<div class="flex flex-wrap gap-2">',
    '  <code',
    `    v-for="${itemAlias} in ${itemsExpression}"`,
    `    :key="${keyExpression}"`,
    `    class="${chipClassName}"`,
    '  >',
    `    {{ ${resolvedValueExpression} }}`,
    '  </code>',
    '</div>',
  ].join('\n');
}

export function createContractTableTemplate({
  columns,
  rowItemAlias,
  rowItemsExpression,
  rowKeyExpression,
}: ContractTableTemplateOptions): string {
  const tableHeader = columns
    .map((column) => {
      return `<th class="${tableHeadCellClassName}">${column.header}</th>`;
    })
    .join('\n');
  const tableCells = columns
    .map((column) => {
      const breakAllClassName = column.breakAll ? ' break-all' : '';

      return [
        `<td class="${tableCellClassName}${breakAllClassName}">`,
        `  <code>{{ ${column.valueExpression} }}</code>`,
        '</td>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<div class="overflow-auto">',
    '  <table class="min-w-full border-collapse">',
    '    <thead>',
    '      <tr>',
    indent(tableHeader, 8),
    '      </tr>',
    '    </thead>',
    '    <tbody>',
    `      <tr v-for="${rowItemAlias} in ${rowItemsExpression}" :key="${rowKeyExpression}">`,
    indent(tableCells, 8),
    '      </tr>',
    '    </tbody>',
    '  </table>',
    '</div>',
  ].join('\n');
}

export function createSubsectionTemplate(title: string, body: string): string {
  return [
    `<section class="${sectionClassName}">`,
    `  <h3 class="${subsectionHeadingClassName}">${title}</h3>`,
    indent(body, 2),
    '</section>',
  ].join('\n');
}
