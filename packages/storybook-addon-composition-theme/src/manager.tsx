import type { SVGProps } from 'react';
import * as React from 'react';

import { Button, Select } from 'storybook/internal/components';
import { addons, types } from 'storybook/manager-api';

import type { CompositionThemeOption, ResolvedCompositionThemeConfig } from './config.js';
import {
  applyThemeToManagerDocument,
  applyThemeToPreviewIframes,
  COMPOSITION_THEME_CHANNEL_EVENT,
  getConfiguredThemeOptions,
  getWindowCompositionThemeConfig,
  isStorybookPreviewIframe,
  isValidThemeId,
  resolveThemeConfigFromUnknown,
  resolveThemeFromEnvironment,
  STORYBOOK_PREVIEW_WRAPPER_ID,
  writeStoredThemeId,
} from './runtime.js';

const COMPOSITION_THEME_ADDON_ID = '@hoite-dev/storybook-addon-composition-theme';
const COMPOSITION_THEME_TOOL_ID = `${COMPOSITION_THEME_ADDON_ID}/tool`;
const MANAGER_REGISTRATION_WINDOW_FLAG = '__compositionThemeManagerRegistered__';

type ThemeIconProps = SVGProps<SVGSVGElement>;

function SunThemeIcon(props: ThemeIconProps) {
  return (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z' />
      <path d='M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z' />
      <path d='M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z' />
      <path d='M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z' />
      <path d='M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z' />
      <path d='M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z' />
      <path d='M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z' />
      <path d='M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z' />
      <path d='M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z' />
    </svg>
  );
}

function MoonThemeIcon(props: ThemeIconProps) {
  return (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z' />
    </svg>
  );
}

function findThemeOption(
  options: CompositionThemeOption[],
  themeId: string | null,
): CompositionThemeOption | undefined {
  if (themeId === null) {
    return undefined;
  }

  return options.find((option) => option.id === themeId);
}

function emitThemeSelection(themeId: string) {
  addons.getChannel().emit(COMPOSITION_THEME_CHANNEL_EVENT, {
    themeId,
  });
}

function resolveInitialTheme(config: ResolvedCompositionThemeConfig): string | null {
  const resolvedTheme = resolveThemeFromEnvironment(config);

  if (isValidThemeId(config, resolvedTheme)) {
    return resolvedTheme;
  }

  return null;
}

function applyThemeToStorybookDocuments(
  config: ResolvedCompositionThemeConfig,
  themeId: string | null,
): void {
  applyThemeToManagerDocument(config, themeId);
  applyThemeToPreviewIframes(config, themeId);
}

type CompositionThemeToolProps = {
  config: ResolvedCompositionThemeConfig;
};

function CompositionThemeTool({ config }: CompositionThemeToolProps) {
  const themeOptions = React.useMemo(() => {
    return getConfiguredThemeOptions(config);
  }, [config]);
  const [themeId, setThemeId] = React.useState<string | null>(() => {
    return resolveInitialTheme(config);
  });
  const selectedThemeOption = findThemeOption(themeOptions, themeId);

  React.useEffect(() => {
    applyThemeToStorybookDocuments(config, themeId);
  }, [config, themeId]);

  React.useEffect(() => {
    let scheduledFrameId: number | null = null;

    const applyCurrentTheme = () => {
      applyThemeToStorybookDocuments(config, themeId);
    };

    const scheduleThemeApplication = () => {
      if (scheduledFrameId !== null) {
        return;
      }

      scheduledFrameId = window.requestAnimationFrame(() => {
        scheduledFrameId = null;
        applyCurrentTheme();
      });
    };

    const handleFrameLoad = (event: Event) => {
      if (!isStorybookPreviewIframe(event.target)) {
        return;
      }

      scheduleThemeApplication();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      scheduleThemeApplication();
    };

    const observer = new MutationObserver(() => {
      scheduleThemeApplication();
    });

    const previewWrapper = document.getElementById(STORYBOOK_PREVIEW_WRAPPER_ID);

    if (previewWrapper) {
      observer.observe(previewWrapper, {
        attributeFilter: ['data-is-loaded', 'data-is-storybook', 'src'],
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener('focus', scheduleThemeApplication);
    window.addEventListener('pageshow', scheduleThemeApplication);
    window.addEventListener('load', handleFrameLoad, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    scheduleThemeApplication();

    return () => {
      if (scheduledFrameId !== null) {
        window.cancelAnimationFrame(scheduledFrameId);
      }

      observer.disconnect();
      window.removeEventListener('focus', scheduleThemeApplication);
      window.removeEventListener('pageshow', scheduleThemeApplication);
      window.removeEventListener('load', handleFrameLoad, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [config, themeId]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== config.storageKey) {
        return;
      }

      const resolvedTheme = resolveInitialTheme(config);
      setThemeId(resolvedTheme);
      applyThemeToStorybookDocuments(config, resolvedTheme);
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [config]);

  const setExplicitTheme = (nextThemeId: string) => {
    if (!isValidThemeId(config, nextThemeId)) {
      return;
    }

    writeStoredThemeId(config.storageKey, nextThemeId);
    applyThemeToStorybookDocuments(config, nextThemeId);
    emitThemeSelection(nextThemeId);
    setThemeId(nextThemeId);
  };

  if (config.kind === 'light-dark' && config.toolbar.control === 'toggle') {
    const currentThemeId = isValidThemeId(config, themeId) ? themeId : null;
    const currentLabel = selectedThemeOption?.label ?? config.darkTheme.label;
    let nextThemeId = config.darkTheme.id;

    if (currentThemeId === config.darkTheme.id) {
      nextThemeId = config.lightTheme.id;
    }

    const icon = currentThemeId === config.lightTheme.id ? <SunThemeIcon /> : <MoonThemeIcon />;

    return (
      <Button
        ariaLabel={`${config.toolbar.label}: ${currentLabel}`}
        key={COMPOSITION_THEME_TOOL_ID}
        onClick={() => {
          setExplicitTheme(nextThemeId);
        }}
        tooltip={`${config.toolbar.label}: ${currentLabel}`}
        variant='ghost'
      >
        {icon}
        {`${config.toolbar.label}: ${currentLabel}`}
      </Button>
    );
  }

  if (config.kind === 'custom' && config.toolbar.control === 'dropdown') {
    const resolvedThemeId = selectedThemeOption?.id ?? themeOptions[0]?.id;
    const currentLabel = selectedThemeOption?.label ?? config.toolbar.label;

    return (
      <Select
        ariaLabel={`${config.toolbar.label}: ${currentLabel}`}
        defaultOptions={resolvedThemeId}
        key={COMPOSITION_THEME_TOOL_ID}
        onSelect={(value) => {
          if (typeof value === 'string') {
            setExplicitTheme(value);
          }
        }}
        options={themeOptions.map((option) => {
          return {
            title: option.label,
            value: option.id,
          };
        })}
      >
        {config.toolbar.label}
      </Select>
    );
  }

  if (config.kind === 'light-dark') {
    const lightThemeSelected = themeId === config.lightTheme.id;
    const darkThemeSelected = themeId === config.darkTheme.id;

    return (
      <div style={{ alignItems: 'center', display: 'flex', gap: 4 }}>
        <Button
          aria-pressed={lightThemeSelected}
          ariaLabel={config.lightTheme.title ?? config.lightTheme.label}
          key={`${COMPOSITION_THEME_TOOL_ID}/light`}
          onClick={() => {
            setExplicitTheme(config.lightTheme.id);
          }}
          tooltip={config.lightTheme.title ?? config.lightTheme.label}
          variant='ghost'
        >
          <SunThemeIcon />
          {config.lightTheme.label}
        </Button>
        <Button
          aria-pressed={darkThemeSelected}
          ariaLabel={config.darkTheme.title ?? config.darkTheme.label}
          key={`${COMPOSITION_THEME_TOOL_ID}/dark`}
          onClick={() => {
            setExplicitTheme(config.darkTheme.id);
          }}
          tooltip={config.darkTheme.title ?? config.darkTheme.label}
          variant='ghost'
        >
          <MoonThemeIcon />
          {config.darkTheme.label}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 4 }}>
      {themeOptions.map((option) => {
        const selected = themeId === option.id;

        return (
          <Button
            aria-pressed={selected}
            ariaLabel={option.title ?? option.label}
            key={`${COMPOSITION_THEME_TOOL_ID}/${option.id}`}
            onClick={() => {
              setExplicitTheme(option.id);
            }}
            tooltip={option.title ?? option.label}
            variant='ghost'
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

function registerManagerTool(config: ResolvedCompositionThemeConfig) {
  addons.register(COMPOSITION_THEME_ADDON_ID, () => {
    addons.add(COMPOSITION_THEME_TOOL_ID, {
      match: ({ tabId, viewMode }) => {
        if (tabId) {
          return false;
        }

        return viewMode === 'story' || viewMode === 'docs';
      },
      render: () => <CompositionThemeTool config={config} />,
      title: config.toolbar.label,
      type: types.TOOL,
    });
  });
}

export function registerCompositionThemeTool(config: unknown) {
  const windowRecord = window as Window & {
    [MANAGER_REGISTRATION_WINDOW_FLAG]?: boolean;
  };

  if (windowRecord[MANAGER_REGISTRATION_WINDOW_FLAG]) {
    return;
  }

  const resolvedConfig = resolveThemeConfigFromUnknown(config);

  if (resolvedConfig === null) {
    return;
  }

  registerManagerTool(resolvedConfig);
  windowRecord[MANAGER_REGISTRATION_WINDOW_FLAG] = true;
}

const windowConfig = getWindowCompositionThemeConfig();

if (windowConfig !== null) {
  registerCompositionThemeTool(windowConfig);
}
