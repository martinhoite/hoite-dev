import { COMPOSITION_THEME_CONFIG_WINDOW_KEY, resolveThemeConfigFromUnknown } from './runtime.js';

function serializeForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function createCompositionThemeBootstrapScript(config: unknown): string {
  const resolvedConfig = resolveThemeConfigFromUnknown(config);

  if (resolvedConfig === null) {
    throw new Error('[composition-theme] Unable to create bootstrap script for invalid config.');
  }
  const serializedConfig = serializeForInlineScript(resolvedConfig);
  const serializedWindowKey = serializeForInlineScript(COMPOSITION_THEME_CONFIG_WINDOW_KEY);

  return `(() => {
  try {
    const config = ${serializedConfig};
    const windowKey = ${serializedWindowKey};
    const globalObject = globalThis;

    if (globalObject && typeof globalObject === 'object') {
      globalObject[windowKey] = config;
    }

    const themeOptions = config.kind === 'light-dark'
      ? [config.lightTheme, config.darkTheme]
      : config.themes;
    const validThemeIds = new Set(themeOptions.map((theme) => theme.id));

    const readStoredTheme = () => {
      try {
        return globalThis.localStorage.getItem(config.storageKey);
      } catch {
        return null;
      }
    };

    const prefersDarkMode = () => {
      if (typeof globalThis.matchMedia !== 'function') {
        return false;
      }

      return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const resolveFallbackTheme = (darkModePreferred) => {
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
    };

    const storedTheme = readStoredTheme();
    let resolvedTheme = null;

    if (typeof storedTheme === 'string' && validThemeIds.has(storedTheme)) {
      resolvedTheme = storedTheme;
    } else {
      const fallbackTheme = resolveFallbackTheme(prefersDarkMode());

      if (typeof fallbackTheme === 'string' && validThemeIds.has(fallbackTheme)) {
        resolvedTheme = fallbackTheme;
      }
    }

    const root = document.documentElement;

    if (!root) {
      return;
    }

    if (resolvedTheme === null) {
      root.removeAttribute(config.attributeName);
      return;
    }

    root.setAttribute(config.attributeName, resolvedTheme);
  } catch {
    // Swallow bootstrap errors to avoid blocking Storybook rendering.
  }
})();`;
}
