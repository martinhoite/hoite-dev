import {
  applyFrontendDocsManagerTheme,
  registerFrontendDocsPlaygroundCodeTool,
} from '@hoite-dev/frontend-docs-shared/storybook';
import '@hoite-dev/ui/fonts.css';
import '@hoite-dev/ui/themes.css';
import '@hoite-dev/ui/tokens.css';
import '../../shared/storybook/hoiteThemeManager.css';
import * as React from 'react';
import { Button } from 'storybook/internal/components';
import { addons, types } from 'storybook/manager-api';
import { create } from 'storybook/theming';

applyFrontendDocsManagerTheme(addons, create);
registerFrontendDocsPlaygroundCodeTool({
  Button,
  React,
  addons,
  types,
});
