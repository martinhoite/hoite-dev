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
} as const;

type StorybookManagerApi = {
  setConfig(config: typeof frontendDocsManagerConfig): void;
};

export function applyFrontendDocsManagerConfig(addons: StorybookManagerApi): void {
  addons.setConfig(frontendDocsManagerConfig);
}
