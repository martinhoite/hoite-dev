import type { ComponentType, ReactNode } from 'react';
import type { AddonStore } from 'storybook/manager-api';

import { createHoiteStorybookThemeOptions } from './hoiteStorybookThemeOptions.ts';
import {
  applyFrontendDocsPlaygroundCodeVisibilityToDocument,
  applyFrontendDocsPlaygroundCodeVisibilityToPreviewIframes,
  emitFrontendDocsPlaygroundCodeVisibility,
  type FrontendDocsPlaygroundCodeVisibility,
  frontendDocsPlaygroundCodeStorageKey,
  readFrontendDocsPlaygroundCodeVisibility,
  writeFrontendDocsPlaygroundCodeVisibility,
} from './playgroundCodeRuntime.ts';

export const frontendDocsHiddenToolbarItems = {
  remount: {
    hidden: true,
  },
  'storybook/a11y/panel': {
    hidden: true,
  },
  'storybook/measure-addon/tool': {
    hidden: true,
  },
  'storybook/outline': {
    hidden: true,
  },
} as const;

export const frontendDocsManagerConfig = {
  toolbar: frontendDocsHiddenToolbarItems,
  panelPosition: 'right',
} as const;

type StorybookManagerConfig = Parameters<AddonStore['setConfig']>[0];
type StorybookManagerState = Parameters<
  NonNullable<NonNullable<StorybookManagerConfig['layoutCustomisations']>['showPanel']>
>[0];
type StorybookManagerApi = Pick<AddonStore, 'setConfig'>;
type StorybookToolbarApi = Pick<AddonStore, 'add' | 'getChannel' | 'register' | 'setConfig'>;

type FrontendDocsPlaygroundCodeToolOptions = {
  Button: ComponentType<FrontendDocsPlaygroundCodeButtonProps>;
  React: Pick<typeof import('react'), 'createElement' | 'useEffect' | 'useState'>;
  addons: StorybookToolbarApi;
  types: {
    TOOL: unknown;
  };
};

type FrontendDocsPlaygroundCodeButtonProps = {
  'aria-pressed'?: boolean;
  ariaLabel: string;
  children?: ReactNode;
  id: string;
  onClick: () => void;
  tooltip: string;
  variant: 'ghost';
};

const frontendDocsPlaygroundCodeAddonId = '@hoite-dev/frontend-docs/playground-code';
const frontendDocsPlaygroundCodeButtonId = 'frontend-docs-playground-code-tool';
const frontendDocsPlaygroundCodeToolId = `${frontendDocsPlaygroundCodeAddonId}/tool`;
const frontendDocsPlaygroundCodeWindowFlag = '__frontendDocsPlaygroundCodeToolRegistered__';
const frontendDocsPlaygroundCodeTitle = 'Snippets: Show code snippets in playgrounds for easy copy';
const storybookPreviewWrapperId = 'storybook-preview-wrapper';
const contractDocsTag = 'contract-docs';

type StorybookThemeFactory = (
  options: ReturnType<typeof createHoiteStorybookThemeOptions>,
) => NonNullable<StorybookManagerConfig['theme']>;

function readCurrentTheme() {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    return 'dark';
  }

  return 'light';
}

function isContractDocsStory(state: StorybookManagerState) {
  const storyId = state.storyId;

  if (!storyId) {
    return false;
  }

  const tags = state.index?.[storyId]?.tags ?? [];

  return tags.includes(contractDocsTag);
}

function createCodeIcon(React: Pick<typeof import('react'), 'createElement'>): ReactNode {
  return React.createElement(
    'svg',
    {
      'aria-hidden': true,
      focusable: false,
      height: 14,
      style: {
        display: 'inline-block',
        marginRight: 6,
        verticalAlign: 'text-bottom',
      },
      viewBox: '0 0 16 16',
      width: 14,
    },
    React.createElement('path', {
      d: 'M6.2 4.2 2.4 8l3.8 3.8-.9.9L.6 8l4.7-4.7.9.9Zm3.6 7.6L13.6 8 9.8 4.2l.9-.9L15.4 8l-4.7 4.7-.9-.9Z',
      fill: 'currentColor',
    }),
  );
}

function resolveNextPlaygroundCodeVisibility(
  visibility: FrontendDocsPlaygroundCodeVisibility,
): FrontendDocsPlaygroundCodeVisibility {
  if (visibility === 'show') {
    return 'hide';
  }

  return 'show';
}

function applyPlaygroundCodeVisibility(visibility: FrontendDocsPlaygroundCodeVisibility): void {
  applyFrontendDocsPlaygroundCodeVisibilityToDocument(visibility);
  applyFrontendDocsPlaygroundCodeVisibilityToPreviewIframes(visibility);
}

export function applyFrontendDocsManagerConfig(addons: StorybookManagerApi): void {
  addons.setConfig(frontendDocsManagerConfig);
}

export function applyFrontendDocsManagerTheme(
  addons: StorybookManagerApi,
  createTheme: StorybookThemeFactory,
): void {
  const themes = {
    dark: createTheme(createHoiteStorybookThemeOptions('dark')),
    light: createTheme(createHoiteStorybookThemeOptions('light')),
  } as const;

  const applyTheme = () => {
    addons.setConfig({
      ...frontendDocsManagerConfig,
      layoutCustomisations: {
        showPanel(state, defaultValue) {
          if (isContractDocsStory(state)) {
            return false;
          }

          return defaultValue;
        },
        showToolbar(state, defaultValue) {
          if (isContractDocsStory(state)) {
            return true;
          }

          return defaultValue;
        },
      },
      theme: themes[readCurrentTheme()],
    });
  };

  applyTheme();

  const observer = new MutationObserver((mutations) => {
    const themeChanged = mutations.some((mutation) => {
      return mutation.type === 'attributes' && mutation.attributeName === 'data-theme';
    });

    if (!themeChanged) {
      return;
    }

    applyTheme();
  });

  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
    attributes: true,
  });
}

export function registerFrontendDocsPlaygroundCodeTool({
  addons,
  Button,
  React,
  types,
}: FrontendDocsPlaygroundCodeToolOptions): void {
  const windowRecord = window as Window & {
    [frontendDocsPlaygroundCodeWindowFlag]?: boolean;
  };

  if (windowRecord[frontendDocsPlaygroundCodeWindowFlag]) {
    return;
  }

  function PlaygroundCodeTool() {
    const [visibility, setVisibility] = React.useState<FrontendDocsPlaygroundCodeVisibility>(() =>
      readFrontendDocsPlaygroundCodeVisibility(),
    );
    const showCode = visibility === 'show';
    const label = showCode ? 'Snippets: Shown' : 'Snippets: Hidden';

    React.useEffect(() => {
      applyPlaygroundCodeVisibility(visibility);
    }, [visibility]);

    React.useEffect(() => {
      let scheduledFrameId: number | null = null;

      const applyCurrentVisibility = () => {
        applyPlaygroundCodeVisibility(readFrontendDocsPlaygroundCodeVisibility());
      };

      const scheduleVisibilityApplication = () => {
        if (scheduledFrameId !== null) {
          return;
        }

        scheduledFrameId = window.requestAnimationFrame(() => {
          scheduledFrameId = null;
          applyCurrentVisibility();
        });
      };

      const handleStorage = (event: StorageEvent) => {
        if (event.key !== frontendDocsPlaygroundCodeStorageKey) {
          return;
        }

        const nextVisibility = readFrontendDocsPlaygroundCodeVisibility();
        setVisibility(nextVisibility);
        applyPlaygroundCodeVisibility(nextVisibility);
      };

      const previewWrapper = document.getElementById(storybookPreviewWrapperId);
      const observer = new MutationObserver(() => {
        scheduleVisibilityApplication();
      });

      if (previewWrapper) {
        observer.observe(previewWrapper, {
          attributeFilter: ['data-is-loaded', 'data-is-storybook', 'src'],
          attributes: true,
          childList: true,
          subtree: true,
        });
      }

      window.addEventListener('focus', scheduleVisibilityApplication);
      window.addEventListener('pageshow', scheduleVisibilityApplication);
      window.addEventListener('storage', handleStorage);
      window.addEventListener('load', scheduleVisibilityApplication, true);
      scheduleVisibilityApplication();

      return () => {
        if (scheduledFrameId !== null) {
          window.cancelAnimationFrame(scheduledFrameId);
        }

        observer.disconnect();
        window.removeEventListener('focus', scheduleVisibilityApplication);
        window.removeEventListener('pageshow', scheduleVisibilityApplication);
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('load', scheduleVisibilityApplication, true);
      };
    }, []);

    return React.createElement(
      Button,
      {
        'aria-pressed': showCode,
        ariaLabel: frontendDocsPlaygroundCodeTitle,
        id: frontendDocsPlaygroundCodeButtonId,
        onClick: () => {
          const nextVisibility = resolveNextPlaygroundCodeVisibility(visibility);

          writeFrontendDocsPlaygroundCodeVisibility(nextVisibility);
          applyPlaygroundCodeVisibility(nextVisibility);
          emitFrontendDocsPlaygroundCodeVisibility(addons.getChannel(), nextVisibility);
          setVisibility(nextVisibility);
        },
        tooltip: frontendDocsPlaygroundCodeTitle,
        variant: 'ghost',
      } satisfies FrontendDocsPlaygroundCodeButtonProps,
      createCodeIcon(React),
      label,
    );
  }

  addons.register(frontendDocsPlaygroundCodeAddonId, () => {
    addons.add(frontendDocsPlaygroundCodeToolId, {
      match: ({ tabId, viewMode }: { tabId?: string; viewMode?: string }) => {
        if (tabId) {
          return false;
        }

        return viewMode === 'story' || viewMode === 'docs';
      },
      render: PlaygroundCodeTool,
      title: 'Playground snippets',
      type: types.TOOL,
    } as never);
  });

  windowRecord[frontendDocsPlaygroundCodeWindowFlag] = true;
}
