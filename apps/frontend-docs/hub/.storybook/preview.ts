import '../src/styles/tailwind.css';
import '@hoite-dev/ui/fonts.css';
import '@hoite-dev/ui/themes.css';
import '@hoite-dev/ui/tokens.css';
import '@hoite-dev/ui/icon.css';
import '@hoite-dev/ui/loading.css';
import '@hoite-dev/ui/typography.css';
import '../../shared/storybook/hoiteThemePreview.css';

import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';

const STORYBOOK_GLOBALS_UPDATED_EVENT = 'globalsUpdated';

type HoiteTheme = 'light' | 'dark';

const resolveHoiteTheme = (theme: unknown): HoiteTheme => {
  return theme === 'light' ? 'light' : 'dark';
};

const applyHoiteTheme = (theme: unknown) => {
  if (typeof document === 'undefined') {
    return;
  }

  const resolvedTheme = resolveHoiteTheme(theme);

  document.documentElement.setAttribute('data-theme', resolvedTheme);
};

const getThemeFromGlobalsUpdatedEvent = (event: unknown) => {
  if (!event || typeof event !== 'object') {
    return undefined;
  }

  const globals = (event as { globals?: Record<string, unknown> }).globals;

  return globals?.theme;
};

const registerHoiteThemeSync = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const storybookWindow = window as Window & {
    __hoiteThemeSyncRegistered?: boolean;
  };

  if (storybookWindow.__hoiteThemeSyncRegistered) {
    return;
  }

  storybookWindow.__hoiteThemeSyncRegistered = true;

  applyHoiteTheme('dark');

  addons.getChannel().on(STORYBOOK_GLOBALS_UPDATED_EVENT, (event: unknown) => {
    const theme = getThemeFromGlobalsUpdatedEvent(event);

    if (!theme) {
      return;
    }

    applyHoiteTheme(theme);
  });
};

registerHoiteThemeSync();

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
};

export default preview;
