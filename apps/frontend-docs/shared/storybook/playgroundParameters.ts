export type FrontendDocsPlaygroundAddonId =
  | 'a11y'
  | 'actions'
  | 'code'
  | 'controls'
  | 'interactions';

export type FrontendDocsPlaygroundAddonVisibility = Partial<
  Record<FrontendDocsPlaygroundAddonId, boolean>
>;

export type FrontendDocsPlaygroundParametersOptions = {
  addons?: FrontendDocsPlaygroundAddonVisibility;
  controls?: Record<string, unknown>;
  docs?: Record<string, unknown>;
};

export const frontendDocsDefaultPlaygroundAddons = {
  a11y: true,
  actions: false,
  code: false,
  controls: true,
  interactions: false,
} as const satisfies Record<FrontendDocsPlaygroundAddonId, boolean>;

export function createFrontendDocsPlaygroundParameters({
  addons,
  controls,
  docs,
}: FrontendDocsPlaygroundParametersOptions = {}) {
  const resolvedAddons = {
    ...frontendDocsDefaultPlaygroundAddons,
    ...addons,
  };

  return {
    actions: {
      disable: !resolvedAddons.actions,
    },
    a11y: {
      disable: !resolvedAddons.a11y,
    },
    controls: {
      disable: !resolvedAddons.controls,
      ...controls,
    },
    docs: {
      codePanel: resolvedAddons.code,
      ...docs,
    },
    interactions: {
      disable: !resolvedAddons.interactions,
    },
  };
}
