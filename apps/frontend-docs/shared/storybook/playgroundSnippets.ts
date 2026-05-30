type FrontendDocsSnippetFramework = 'react' | 'vue';

type FrontendDocsSnippetPropValue =
  | boolean
  | number
  | readonly string[]
  | string
  | null
  | undefined;

export type FrontendDocsSnippetProp = {
  defaultValue?: FrontendDocsSnippetPropValue;
  name: string;
  value: FrontendDocsSnippetPropValue;
};

export type FrontendDocsComponentSnippetOptions = {
  children?: string;
  componentName: string;
  framework: FrontendDocsSnippetFramework;
  props?: readonly FrontendDocsSnippetProp[];
};

function escapeAttributeValue(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeTextContent(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;');
}

function shouldRenderProp(prop: FrontendDocsSnippetProp): boolean {
  if (prop.value === undefined || prop.value === null || prop.value === '') {
    return false;
  }

  if (Array.isArray(prop.value)) {
    return prop.value.length > 0;
  }

  return prop.value !== prop.defaultValue;
}

function formatArrayLiteral(values: readonly string[]): string {
  return `[${values.map((value) => `'${value}'`).join(', ')}]`;
}

function formatReactProp({ name, value }: FrontendDocsSnippetProp): string {
  if (typeof value === 'boolean') {
    return value ? name : `${name}={false}`;
  }

  if (Array.isArray(value)) {
    return `${name}={${formatArrayLiteral(value)}}`;
  }

  if (typeof value === 'number') {
    return `${name}={${value}}`;
  }

  return `${name}="${escapeAttributeValue(String(value))}"`;
}

function formatVueProp({ name, value }: FrontendDocsSnippetProp): string {
  if (typeof value === 'boolean') {
    return value ? name : `:${name}="false"`;
  }

  if (Array.isArray(value)) {
    return `:${name}="${formatArrayLiteral(value)}"`;
  }

  if (typeof value === 'number') {
    return `:${name}="${value}"`;
  }

  return `${name}="${escapeAttributeValue(String(value))}"`;
}

function formatProp(
  framework: FrontendDocsSnippetFramework,
  prop: FrontendDocsSnippetProp,
): string {
  if (framework === 'vue') {
    return formatVueProp(prop);
  }

  return formatReactProp(prop);
}

function formatOpeningTag({
  componentName,
  framework,
  props = [],
}: FrontendDocsComponentSnippetOptions): string {
  const renderedProps = props.filter(shouldRenderProp).map((prop) => formatProp(framework, prop));

  if (renderedProps.length === 0) {
    return `<${componentName}`;
  }

  if (renderedProps.length === 1) {
    return `<${componentName} ${renderedProps[0]}`;
  }

  return [`<${componentName}`, ...renderedProps.map((prop) => `  ${prop}`)].join('\n');
}

function formatChildren(children: string): string {
  return escapeTextContent(children)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

export function createFrontendDocsComponentSnippet(
  options: FrontendDocsComponentSnippetOptions,
): string {
  const openingTag = formatOpeningTag(options);
  const hasMultilineOpeningTag = openingTag.includes('\n');

  if (options.children === undefined || options.children.length === 0) {
    return `${openingTag}${hasMultilineOpeningTag ? '\n' : ' '}/>`;
  }

  return [`${openingTag}>`, formatChildren(options.children), `</${options.componentName}>`].join(
    '\n',
  );
}
