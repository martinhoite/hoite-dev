import {
  createHoiteStorybookColorValues,
  type HoiteStorybookThemeName,
} from './hoiteStorybookThemeColors.ts';

export type { HoiteStorybookThemeName };

const hoiteStorybookBrandTitle = `
  <span class="hoite-storybook-brand">
    <svg
      aria-hidden="true"
      class="hoite-storybook-brand__mark"
      fill="none"
      viewBox="0 0 3000 3000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m1951.75 2536.88-875.4-875.4m995.01-50.12-975 975M2694.2 1778.5l-480.12-480.13m-380.29-961.561L558.794 1611.81m103.851 533.08L1903.89 903.645M70.71 1500 1500 70.71 2929.289 1500l-1429.29 1429.288z"
      />
    </svg>
    <span class="hoite-storybook-brand__text">Hoite Dev design system</span>
  </span>
`;

export function createHoiteStorybookThemeOptions(base: HoiteStorybookThemeName) {
  const colors = createHoiteStorybookColorValues(base);

  return {
    appBg: colors.appBg,
    appBorderColor: colors.appBorderColor,
    appBorderRadius: 6,
    appContentBg: colors.appContentBg,
    appPreviewBg: colors.appPreviewBg,
    barBg: colors.barBg,
    barHoverColor: colors.barHoverColor,
    barSelectedColor: colors.barSelectedColor,
    barTextColor: colors.barTextColor,
    base,
    booleanBg: colors.booleanBg,
    booleanSelectedBg: colors.booleanSelectedBg,
    brandTarget: '_self',
    brandTitle: hoiteStorybookBrandTitle,
    brandUrl: './',
    buttonBg: colors.buttonBg,
    buttonBorder: colors.buttonBorder,
    colorPrimary: colors.colorPrimary,
    colorSecondary: colors.colorSecondary,
    fontBase: 'Roboto, Arial, Helvetica, sans-serif',
    fontCode:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    inputBg: colors.inputBg,
    inputBorder: colors.inputBorder,
    inputBorderRadius: 6,
    inputTextColor: colors.inputTextColor,
    textColor: colors.textColor,
    textInverseColor: colors.textInverseColor,
  } as const;
}
