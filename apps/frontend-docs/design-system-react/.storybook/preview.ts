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

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
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
