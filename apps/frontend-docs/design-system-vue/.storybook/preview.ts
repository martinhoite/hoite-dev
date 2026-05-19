import '../src/styles/tailwind.css';
import '@hoite-dev/ui/fonts.css';
import '@hoite-dev/ui/themes.css';
import '@hoite-dev/ui/tokens.css';
import '@hoite-dev/ui/button.css';
import '@hoite-dev/ui/icon-button.css';
import '@hoite-dev/ui/link.css';
import '@hoite-dev/ui/icon.css';
import '@hoite-dev/ui/loading.css';
import '@hoite-dev/ui/typography.css';
import '../../shared/storybook/hoiteThemePreview.css';

import {
  frontendDocsPreviewInitialGlobals,
  frontendDocsPreviewParameters,
  setupFrontendDocsPlaygroundCodePreview,
} from '@hoite-dev/frontend-docs-shared/storybook';
import type { Preview } from '@storybook/vue3-vite';
import { addons } from 'storybook/preview-api';

setupFrontendDocsPlaygroundCodePreview(addons.getChannel());

const preview: Preview = {
  initialGlobals: frontendDocsPreviewInitialGlobals,
  parameters: frontendDocsPreviewParameters,
};

export default preview;
