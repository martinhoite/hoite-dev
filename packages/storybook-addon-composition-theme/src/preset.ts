import { createCompositionThemeBootstrapScript } from './bootstrap.js';
import type { ResolvedCompositionThemeConfig } from './config.js';
import { resolveThemeConfigFromUnknown } from './runtime.js';

const BOOTSTRAP_MARKER = 'data-composition-theme-bootstrap';

type PresetOptions = Record<string, unknown> & {
  compositionThemeConfig?: unknown;
  options?: unknown;
};

function extractTopLevelConfigCandidate(options: PresetOptions): unknown {
  const kind = options.kind;

  if (kind === 'light-dark') {
    return {
      attributeName: options.attributeName,
      darkTheme: options.darkTheme,
      kind,
      lightTheme: options.lightTheme,
      storageKey: options.storageKey,
      toolbar: options.toolbar,
    };
  }

  if (kind === 'custom') {
    return {
      attributeName: options.attributeName,
      defaultTheme: options.defaultTheme,
      kind,
      storageKey: options.storageKey,
      systemFallback: options.systemFallback,
      themes: options.themes,
      toolbar: options.toolbar,
    };
  }

  return null;
}

function tryResolveThemeConfig(options: PresetOptions): ResolvedCompositionThemeConfig | null {
  const directCandidate = options.compositionThemeConfig;
  const nestedCandidate = options.options;
  const fallbackCandidate = extractTopLevelConfigCandidate(options);
  const candidate = directCandidate ?? nestedCandidate ?? fallbackCandidate;

  return resolveThemeConfigFromUnknown(candidate);
}

function withBootstrapScript(
  head: string,
  config: ResolvedCompositionThemeConfig | null,
  target: 'manager' | 'preview',
): string {
  if (config === null) {
    return head;
  }

  if (head.includes(`${BOOTSTRAP_MARKER}="${target}"`)) {
    return head;
  }

  const script = createCompositionThemeBootstrapScript(config);

  return `${head}
<script ${BOOTSTRAP_MARKER}="${target}">
${script}
</script>
`;
}

export function managerHead(head: string = '', options: PresetOptions = {}): string {
  const config = tryResolveThemeConfig(options);

  return withBootstrapScript(head, config, 'manager');
}

export function previewHead(head: string = '', options: PresetOptions = {}): string {
  const config = tryResolveThemeConfig(options);

  return withBootstrapScript(head, config, 'preview');
}
