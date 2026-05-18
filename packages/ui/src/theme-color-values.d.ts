export type HoiteThemeName = 'light' | 'dark';

export type HoiteThemeColorName =
  | 'colorBgCanvas'
  | 'colorBgSurface'
  | 'colorBgField'
  | 'colorBgSelected'
  | 'colorTextPrimary'
  | 'colorTextSecondary'
  | 'colorTextInverse'
  | 'colorTextBrand'
  | 'colorBorderDefault'
  | 'colorBorderFocus';

export declare const hoiteThemeColorValues: Readonly<
  Record<HoiteThemeName, Readonly<Record<HoiteThemeColorName, string>>>
>;
