export const AvailableLocales = ['en', 'da'] as const;
export type Locale = (typeof AvailableLocales)[number];
export type Culture = Locale;

export const AvailableThemes = ['dark', 'light'] as const;
export type Theme = (typeof AvailableThemes)[number];
