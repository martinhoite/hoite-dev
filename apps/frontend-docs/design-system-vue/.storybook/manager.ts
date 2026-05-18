import {
  applyFrontendDocsManagerConfig,
  registerFrontendDocsPlaygroundCodeTool,
} from '@hoite-dev/frontend-docs-shared/storybook';
import * as React from 'react';
import { Button } from 'storybook/internal/components';
import { addons, types } from 'storybook/manager-api';

applyFrontendDocsManagerConfig(addons);
registerFrontendDocsPlaygroundCodeTool({
  Button,
  React,
  addons,
  types,
});
