type FrontendDocsSnippetFramework = 'react' | 'vue';

type FrontendDocsSnippetPropValue = boolean | number | string | null | undefined;

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

function escapeSnippetHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function createSnippetToken(className: string, value: string): string {
  return `<span class="${className}">${escapeSnippetHtml(value)}</span>`;
}

function shouldRenderProp(prop: FrontendDocsSnippetProp): boolean {
  if (prop.value === undefined || prop.value === null || prop.value === '') {
    return false;
  }

  return prop.value !== prop.defaultValue;
}

function formatReactProp({ name, value }: FrontendDocsSnippetProp): string {
  if (typeof value === 'boolean') {
    return value ? name : `${name}={false}`;
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

export async function copyFrontendDocsSnippetToClipboard(snippet: string): Promise<boolean> {
  if (!globalThis.navigator?.clipboard) {
    return false;
  }

  await globalThis.navigator.clipboard.writeText(snippet);
  return true;
}

export function createFrontendDocsHighlightedSnippetHtml(snippet: string): string {
  const tokenPattern =
    /("[^"\n]*")|(<\/?)([A-Z][A-Za-z0-9.]*)|(\s)(:?[A-Za-z][A-Za-z0-9-]*)(=)|(\{(?:false|true|\d+)\}|(?:false|true|\d+))/g;
  let highlightedSnippet = '';
  let lastIndex = 0;

  for (const match of snippet.matchAll(tokenPattern)) {
    const matchIndex = match.index ?? 0;

    highlightedSnippet += escapeSnippetHtml(snippet.slice(lastIndex, matchIndex));

    if (match[1]) {
      highlightedSnippet += createSnippetToken('frontend-docs-snippet-token-string', match[1]);
    } else if (match[2] && match[3]) {
      highlightedSnippet += `${escapeSnippetHtml(match[2])}${createSnippetToken(
        'frontend-docs-snippet-token-tag',
        match[3],
      )}`;
    } else if (match[4] && match[5] && match[6]) {
      highlightedSnippet += `${escapeSnippetHtml(match[4])}${createSnippetToken(
        'frontend-docs-snippet-token-attribute',
        match[5],
      )}${escapeSnippetHtml(match[6])}`;
    } else if (match[7]) {
      highlightedSnippet += createSnippetToken('frontend-docs-snippet-token-literal', match[7]);
    } else {
      highlightedSnippet += escapeSnippetHtml(match[0]);
    }

    lastIndex = matchIndex + match[0].length;
  }

  highlightedSnippet += escapeSnippetHtml(snippet.slice(lastIndex));
  return highlightedSnippet;
}
