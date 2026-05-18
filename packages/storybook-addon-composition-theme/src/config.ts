export type CompositionThemeOption<ThemeId extends string = string> = {
  id: ThemeId;
  label: string;
  title?: string;
};

type CompositionThemeBaseConfig = {
  storageKey: string;
  attributeName?: string;
};

export type CompositionThemeLightDarkConfig<ThemeId extends string = string> =
  CompositionThemeBaseConfig & {
    kind: 'light-dark';
    lightTheme: CompositionThemeOption<ThemeId>;
    darkTheme: CompositionThemeOption<ThemeId>;
    toolbar?: {
      control?: 'toggle' | 'buttons';
      label?: string;
      title?: string;
    };
  };

export type CompositionThemeCustomConfig<ThemeId extends string = string> =
  CompositionThemeBaseConfig & {
    kind: 'custom';
    themes: CompositionThemeOption<ThemeId>[];
    toolbar?: {
      control?: 'dropdown' | 'buttons';
      label?: string;
      title?: string;
    };
  } & (
      | {
          defaultTheme: ThemeId;
          systemFallback?: never;
        }
      | {
          defaultTheme?: never;
          systemFallback: {
            light: ThemeId;
            dark: ThemeId;
          };
        }
    );

export type CompositionThemeConfig<ThemeId extends string = string> =
  | CompositionThemeLightDarkConfig<ThemeId>
  | CompositionThemeCustomConfig<ThemeId>;

export type ResolvedCompositionThemeLightDarkConfig<ThemeId extends string = string> = Omit<
  CompositionThemeLightDarkConfig<ThemeId>,
  'attributeName' | 'toolbar'
> & {
  attributeName: string;
  toolbar: {
    control: 'toggle' | 'buttons';
    label: string;
    title?: string;
  };
};

export type ResolvedCompositionThemeCustomConfig<ThemeId extends string = string> = Omit<
  CompositionThemeCustomConfig<ThemeId>,
  'attributeName' | 'toolbar'
> & {
  attributeName: string;
  toolbar: {
    control: 'dropdown' | 'buttons';
    label: string;
    title?: string;
  };
};

export type ResolvedCompositionThemeConfig<ThemeId extends string = string> =
  | ResolvedCompositionThemeLightDarkConfig<ThemeId>
  | ResolvedCompositionThemeCustomConfig<ThemeId>;

export const DEFAULT_THEME_ATTRIBUTE_NAME = 'data-theme';
export const DEFAULT_TOOLBAR_LABEL = 'Theme';

function assertValid(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[composition-theme] ${message}`);
  }
}

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  assertValid(typeof value === 'string', `"${fieldName}" must be a string.`);
  assertValid(value.trim().length > 0, `"${fieldName}" cannot be empty.`);
}

function validateThemeOption(option: CompositionThemeOption, fieldName: string) {
  assertNonEmptyString(option.id, `${fieldName}.id`);
  assertNonEmptyString(option.label, `${fieldName}.label`);

  if (option.title !== undefined) {
    assertNonEmptyString(option.title, `${fieldName}.title`);
  }
}

function collectDuplicateThemeIds(ids: string[]): string[] {
  const counts = new Map<string, number>();

  for (const id of ids) {
    const nextCount = (counts.get(id) ?? 0) + 1;
    counts.set(id, nextCount);
  }

  const duplicates: string[] = [];

  for (const [id, count] of counts.entries()) {
    if (count > 1) {
      duplicates.push(id);
    }
  }

  return duplicates;
}

function resolveAttributeName(attributeName: string | undefined): string {
  if (attributeName === undefined) {
    return DEFAULT_THEME_ATTRIBUTE_NAME;
  }

  assertNonEmptyString(attributeName, 'attributeName');

  return attributeName;
}

function resolveToolbarLabel(label: string | undefined): string {
  if (label === undefined) {
    return DEFAULT_TOOLBAR_LABEL;
  }

  assertNonEmptyString(label, 'toolbar.label');

  return label;
}

function resolveToolbarTitle(title: string | undefined): string | undefined {
  if (title === undefined) {
    return undefined;
  }

  assertNonEmptyString(title, 'toolbar.title');

  return title;
}

function ensureLightDarkConfigIsValid(config: CompositionThemeLightDarkConfig) {
  validateThemeOption(config.lightTheme, 'lightTheme');
  validateThemeOption(config.darkTheme, 'darkTheme');
  assertValid(
    config.lightTheme.id !== config.darkTheme.id,
    'lightTheme.id and darkTheme.id must be different.',
  );

  if ('defaultTheme' in (config as Record<string, unknown>)) {
    throw new Error('[composition-theme] "kind: light-dark" cannot use "defaultTheme".');
  }

  if ('systemFallback' in (config as Record<string, unknown>)) {
    throw new Error('[composition-theme] "kind: light-dark" cannot use "systemFallback".');
  }

  const control = config.toolbar?.control as string | undefined;

  if (control !== undefined) {
    assertValid(
      control === 'toggle' || control === 'buttons',
      '"kind: light-dark" toolbar.control must be "toggle" or "buttons".',
    );
  }
}

function ensureCustomConfigIsValid(config: CompositionThemeCustomConfig) {
  assertValid(config.themes.length > 0, '"kind: custom" requires at least one theme.');

  for (const [index, theme] of config.themes.entries()) {
    validateThemeOption(theme, `themes[${index}]`);
  }

  const themeIds = config.themes.map((theme) => theme.id);
  const duplicateIds = collectDuplicateThemeIds(themeIds);

  assertValid(
    duplicateIds.length === 0,
    `"kind: custom" includes duplicate theme ids: ${duplicateIds.join(', ')}.`,
  );

  const control = (config as { toolbar?: { control?: string } }).toolbar?.control;

  if (control !== undefined) {
    assertValid(control !== 'toggle', '"kind: custom" does not support toolbar.control "toggle".');
    assertValid(
      control === 'dropdown' || control === 'buttons',
      '"kind: custom" toolbar.control must be "dropdown" or "buttons".',
    );
  }

  const hasDefaultTheme =
    'defaultTheme' in config &&
    config.defaultTheme !== undefined &&
    config.defaultTheme !== null &&
    String(config.defaultTheme).trim().length > 0;

  const hasSystemFallback = 'systemFallback' in config && config.systemFallback !== undefined;

  assertValid(
    hasDefaultTheme !== hasSystemFallback,
    '"kind: custom" requires exactly one fallback strategy: defaultTheme or systemFallback.',
  );

  if (hasDefaultTheme) {
    assertValid(
      themeIds.includes(config.defaultTheme),
      '"defaultTheme" must match one of the configured theme ids.',
    );
  }

  if (hasSystemFallback) {
    const fallback = config.systemFallback;

    assertValid(
      fallback !== undefined &&
        fallback !== null &&
        fallback.light !== undefined &&
        fallback.dark !== undefined,
      '"systemFallback" requires both light and dark.',
    );

    assertValid(
      themeIds.includes(fallback.light),
      '"systemFallback.light" must match one of the configured theme ids.',
    );
    assertValid(
      themeIds.includes(fallback.dark),
      '"systemFallback.dark" must match one of the configured theme ids.',
    );
  }
}

export function defineCompositionThemeConfig<ThemeId extends string>(
  config: CompositionThemeConfig<ThemeId>,
): ResolvedCompositionThemeConfig<ThemeId> {
  assertNonEmptyString(config.storageKey, 'storageKey');

  if (config.kind === 'light-dark') {
    ensureLightDarkConfigIsValid(config);

    const resolvedConfig: ResolvedCompositionThemeLightDarkConfig<ThemeId> = {
      attributeName: resolveAttributeName(config.attributeName),
      darkTheme: config.darkTheme,
      kind: 'light-dark',
      lightTheme: config.lightTheme,
      storageKey: config.storageKey,
      toolbar: {
        control: config.toolbar?.control ?? 'toggle',
        label: resolveToolbarLabel(config.toolbar?.label),
        title: resolveToolbarTitle(config.toolbar?.title),
      },
    };

    return resolvedConfig;
  }

  ensureCustomConfigIsValid(config);

  const resolvedBaseConfig = {
    attributeName: resolveAttributeName(config.attributeName),
    kind: 'custom' as const,
    storageKey: config.storageKey,
    themes: [...config.themes],
    toolbar: {
      control: config.toolbar?.control ?? 'dropdown',
      label: resolveToolbarLabel(config.toolbar?.label),
      title: resolveToolbarTitle(config.toolbar?.title),
    },
  };

  if ('defaultTheme' in config && config.defaultTheme !== undefined) {
    const resolvedConfig: ResolvedCompositionThemeCustomConfig<ThemeId> = {
      ...resolvedBaseConfig,
      defaultTheme: config.defaultTheme,
    };

    return resolvedConfig;
  }

  if ('systemFallback' in config && config.systemFallback !== undefined) {
    const resolvedConfig: ResolvedCompositionThemeCustomConfig<ThemeId> = {
      ...resolvedBaseConfig,
      systemFallback: {
        dark: config.systemFallback.dark,
        light: config.systemFallback.light,
      },
    };

    return resolvedConfig;
  }

  throw new Error('[composition-theme] Invalid "kind: custom" config: missing fallback strategy.');
}
