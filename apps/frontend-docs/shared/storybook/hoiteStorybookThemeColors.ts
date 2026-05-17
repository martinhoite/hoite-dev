import {
  type HoiteThemeColorName,
  type HoiteThemeName,
  hoiteThemeColorValues,
} from '@hoite-dev/ui/theme-color-values';

export type HoiteStorybookThemeName = HoiteThemeName;

const hoiteStorybookColorTokenMap = {
  appBg: 'colorBgSurface',
  appBorderColor: 'colorBorderDefault',
  appContentBg: 'colorBgCanvas',
  appPreviewBg: 'colorBgCanvas',

  barBg: 'colorBgSurface',
  barHoverColor: 'colorTextPrimary',
  barSelectedColor: 'colorTextBrand',
  barTextColor: 'colorTextSecondary',

  booleanBg: 'colorBgSurface',
  booleanSelectedBg: 'colorBgSelected',

  buttonBg: 'colorBgSurface',
  buttonBorder: 'colorBorderDefault',

  colorPrimary: 'colorTextBrand',
  colorSecondary: 'colorBorderFocus',

  inputBg: 'colorBgField',
  inputBorder: 'colorBorderDefault',
  inputTextColor: 'colorTextPrimary',

  textColor: 'colorTextPrimary',
  textInverseColor: 'colorTextInverse',
} as const satisfies Record<string, HoiteThemeColorName>;

export function createHoiteStorybookColorValues(base: HoiteStorybookThemeName) {
  const tokens = hoiteThemeColorValues[base];

  return Object.fromEntries(
    Object.entries(hoiteStorybookColorTokenMap).map(([storybookKey, tokenName]) => [
      storybookKey,
      tokens[tokenName],
    ]),
  ) as Record<keyof typeof hoiteStorybookColorTokenMap, string>;
}
