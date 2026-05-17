import '../src/styles/tailwind.css';
import '@hoite-dev/ui/fonts.css';
import '@hoite-dev/ui/themes.css';
import '@hoite-dev/ui/tokens.css';
import '@hoite-dev/ui/icon.css';
import '@hoite-dev/ui/loading.css';
import '@hoite-dev/ui/typography.css';
import '../../shared/storybook/hoiteThemePreview.css';

import { frontendDocsPreviewParameters } from '@hoite-dev/frontend-docs-shared/storybook';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: frontendDocsPreviewParameters,
};

export default preview;
