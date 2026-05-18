import { addons } from 'storybook/preview-api';

import type { ResolvedCompositionThemeConfig } from './config.js';
import {
  applyThemeToDocument,
  COMPOSITION_THEME_CHANNEL_EVENT,
  getWindowCompositionThemeConfig,
  isValidThemeId,
  resolveThemeConfigFromUnknown,
  resolveThemeFromEnvironment,
} from './runtime.js';

const PREVIEW_REGISTRATION_WINDOW_FLAG = '__compositionThemePreviewRegistered__';

function applyResolvedTheme(config: ResolvedCompositionThemeConfig) {
  const resolvedTheme = resolveThemeFromEnvironment(config);
  applyThemeToDocument(config, resolvedTheme);
}

export function setupCompositionThemePreview(config: unknown) {
  const resolvedConfig = resolveThemeConfigFromUnknown(config);

  if (resolvedConfig === null) {
    return;
  }

  const windowRecord = window as Window & {
    [PREVIEW_REGISTRATION_WINDOW_FLAG]?: boolean;
  };

  if (windowRecord[PREVIEW_REGISTRATION_WINDOW_FLAG]) {
    applyResolvedTheme(resolvedConfig);
    return;
  }

  windowRecord[PREVIEW_REGISTRATION_WINDOW_FLAG] = true;
  applyResolvedTheme(resolvedConfig);

  window.addEventListener('storage', (event) => {
    if (event.key !== resolvedConfig.storageKey) {
      return;
    }

    applyResolvedTheme(resolvedConfig);
  });

  addons.getChannel().on(COMPOSITION_THEME_CHANNEL_EVENT, (event: unknown) => {
    if (typeof event !== 'object' || event === null || Array.isArray(event)) {
      return;
    }

    const themeId = (event as { themeId?: unknown }).themeId;

    if (!isValidThemeId(resolvedConfig, themeId)) {
      return;
    }

    applyThemeToDocument(resolvedConfig, themeId);
  });
}

const windowConfig = getWindowCompositionThemeConfig();

if (windowConfig !== null) {
  setupCompositionThemePreview(windowConfig);
}

const preview = {};

export default preview;
