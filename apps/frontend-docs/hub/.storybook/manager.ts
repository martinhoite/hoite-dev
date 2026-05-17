import '@hoite-dev/ui/fonts.css';
import '@hoite-dev/ui/themes.css';
import '@hoite-dev/ui/tokens.css';
import '../../shared/storybook/hoiteThemeManager.css';
import {
  createHoiteStorybookThemeOptions,
  type HoiteStorybookThemeName,
} from '@hoite-dev/frontend-docs-shared/storybook';

import { addons, type State } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { registerStorybookCompositionPreviewFrameWorkaround } from './storybookCompositionPreviewFrameWorkaround.ts';

const contractDocsTag = 'contract-docs';
const hoiteStorybookThemes = {
  dark: create(createHoiteStorybookThemeOptions('dark')),
  light: create(createHoiteStorybookThemeOptions('light')),
} as const;

function readCurrentTheme(): HoiteStorybookThemeName {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    return 'dark';
  }

  return 'light';
}

function isContractDocsStory(state: State) {
  const tags = state.index?.[state.storyId]?.tags ?? [];

  return tags.includes(contractDocsTag);
}

function applyCurrentStorybookTheme(): void {
  addons.setConfig({
    layoutCustomisations: {
      showPanel(state, defaultValue) {
        if (isContractDocsStory(state)) {
          return false;
        }

        return defaultValue;
      },
      showToolbar(state: State, defaultValue: boolean) {
        if (isContractDocsStory(state)) {
          return false;
        }

        return defaultValue;
      },
    },
    theme: hoiteStorybookThemes[readCurrentTheme()],
  });
}

function observeThemeChanges(): void {
  const observer = new MutationObserver((mutations) => {
    const themeChanged = mutations.some((mutation) => {
      return mutation.type === 'attributes' && mutation.attributeName === 'data-theme';
    });

    if (!themeChanged) {
      return;
    }

    applyCurrentStorybookTheme();
  });

  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
    attributes: true,
  });
}

applyCurrentStorybookTheme();
observeThemeChanges();
registerStorybookCompositionPreviewFrameWorkaround();
