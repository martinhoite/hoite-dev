import type {
  CompositionThemeConfig,
  CompositionThemeOption,
  ResolvedCompositionThemeConfig,
} from './config.js';
import { defineCompositionThemeConfig } from './config.js';

export const COMPOSITION_THEME_CONFIG_WINDOW_KEY = '__COMPOSITION_THEME_CONFIG__';
export const COMPOSITION_THEME_CHANNEL_EVENT = 'composition-theme/theme-selected';
export const STORYBOOK_PREVIEW_WRAPPER_ID = 'storybook-preview-wrapper';
export const STORYBOOK_PREVIEW_IFRAME_ID = 'storybook-preview-iframe';
export const STORYBOOK_REF_IFRAME_ID_PREFIX = 'storybook-ref-';

function safeWindow(): Window | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window;
}

function safeDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

export function getConfiguredThemeOptions(
  config: ResolvedCompositionThemeConfig,
): CompositionThemeOption[] {
  if (config.kind === 'light-dark') {
    return [config.lightTheme, config.darkTheme];
  }

  return [...config.themes];
}

export function getConfiguredThemeIds(config: ResolvedCompositionThemeConfig): string[] {
  return getConfiguredThemeOptions(config).map((theme) => theme.id);
}

export function isValidThemeId(
  config: ResolvedCompositionThemeConfig,
  value: unknown,
): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  return getConfiguredThemeIds(config).includes(value);
}

function prefersDarkColorScheme(win: Window): boolean {
  if (typeof win.matchMedia !== 'function') {
    return false;
  }

  return win.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function readStoredThemeId(storageKey: string): string | null {
  const win = safeWindow();

  if (win === null) {
    return null;
  }

  try {
    return win.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function writeStoredThemeId(storageKey: string, themeId: string): boolean {
  const win = safeWindow();

  if (win === null) {
    return false;
  }

  try {
    win.localStorage.setItem(storageKey, themeId);

    return true;
  } catch {
    return false;
  }
}

export function resolveFallbackThemeId(
  config: ResolvedCompositionThemeConfig,
  darkModePreferred: boolean,
): string | null {
  if (config.kind === 'light-dark') {
    if (darkModePreferred) {
      return config.darkTheme.id;
    }

    return config.lightTheme.id;
  }

  if ('defaultTheme' in config && config.defaultTheme !== undefined) {
    return config.defaultTheme;
  }

  if ('systemFallback' in config && config.systemFallback !== undefined) {
    if (darkModePreferred) {
      return config.systemFallback.dark;
    }

    return config.systemFallback.light;
  }

  return null;
}

export function resolveThemeFromEnvironment(config: ResolvedCompositionThemeConfig): string | null {
  const storedThemeId = readStoredThemeId(config.storageKey);

  if (isValidThemeId(config, storedThemeId)) {
    return storedThemeId;
  }

  const win = safeWindow();
  const darkModePreferred = win !== null ? prefersDarkColorScheme(win) : false;
  const fallbackThemeId = resolveFallbackThemeId(config, darkModePreferred);

  if (isValidThemeId(config, fallbackThemeId)) {
    return fallbackThemeId;
  }

  return null;
}

export function applyThemeToDocument(
  config: ResolvedCompositionThemeConfig,
  themeId: string | null,
  targetDocument?: Document,
) {
  const doc = targetDocument ?? safeDocument();

  if (doc === null) {
    return;
  }

  const root = doc.documentElement;

  if (!root) {
    return;
  }

  if (themeId === null || !isValidThemeId(config, themeId)) {
    root.removeAttribute(config.attributeName);
    return;
  }

  root.setAttribute(config.attributeName, themeId);
}

export function applyThemeToManagerDocument(
  config: ResolvedCompositionThemeConfig,
  themeId: string | null,
) {
  applyThemeToDocument(config, themeId);
}

export function applyThemeToActivePreviewIframe(
  config: ResolvedCompositionThemeConfig,
  themeId: string | null,
): boolean {
  return applyThemeToPreviewIframes(config, themeId) > 0;
}

export function isStorybookPreviewIframe(
  element: EventTarget | null,
): element is HTMLIFrameElement {
  if (!(element instanceof HTMLIFrameElement)) {
    return false;
  }

  if (element.id === STORYBOOK_PREVIEW_IFRAME_ID) {
    return true;
  }

  return element.id.startsWith(STORYBOOK_REF_IFRAME_ID_PREFIX);
}

export function getStorybookPreviewIframes(targetDocument?: Document): HTMLIFrameElement[] {
  const doc = targetDocument ?? safeDocument();

  if (doc === null) {
    return [];
  }

  const previewWrapper = doc.getElementById(STORYBOOK_PREVIEW_WRAPPER_ID);
  const searchRoot = previewWrapper ?? doc;

  return Array.from(
    searchRoot.querySelectorAll<HTMLIFrameElement>(
      `#${STORYBOOK_PREVIEW_IFRAME_ID}, iframe[id^="${STORYBOOK_REF_IFRAME_ID_PREFIX}"]`,
    ),
  );
}

function applyThemeToIframeDocument(
  config: ResolvedCompositionThemeConfig,
  themeId: string | null,
  iframe: HTMLIFrameElement,
): boolean {
  try {
    const previewDocument = iframe.contentDocument;

    if (previewDocument === null) {
      return false;
    }

    applyThemeToDocument(config, themeId, previewDocument);

    return true;
  } catch {
    return false;
  }
}

export function applyThemeToPreviewIframes(
  config: ResolvedCompositionThemeConfig,
  themeId: string | null,
): number {
  return getStorybookPreviewIframes().reduce((appliedCount, iframe) => {
    if (applyThemeToIframeDocument(config, themeId, iframe)) {
      return appliedCount + 1;
    }

    return appliedCount;
  }, 0);
}

export function resolveThemeConfigFromUnknown(
  value: unknown,
): ResolvedCompositionThemeConfig | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  try {
    return defineCompositionThemeConfig(value as CompositionThemeConfig);
  } catch {
    return null;
  }
}

export function getWindowCompositionThemeConfig(): ResolvedCompositionThemeConfig | null {
  const win = safeWindow();

  if (win === null) {
    return null;
  }

  const record = win as Window & {
    [COMPOSITION_THEME_CONFIG_WINDOW_KEY]?: unknown;
  };
  const rawConfig = record[COMPOSITION_THEME_CONFIG_WINDOW_KEY];

  return resolveThemeConfigFromUnknown(rawConfig);
}
