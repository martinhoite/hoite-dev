export const AvailableLocales = ['en', 'da'] as const;
export type Locale = (typeof AvailableLocales)[number];
export type Culture = Locale;

export const isLocale = (value: string | null | undefined): value is Locale => {
  return value === 'en' || value === 'da';
};

export const AvailableThemes = ['dark', 'light'] as const;
export type Theme = (typeof AvailableThemes)[number];

export type ConsoleLogTypes = 'log' | 'info' | 'warn' | 'error';
