export const AvailableLocales = ['en', 'da'] as const;
export type Locale = (typeof AvailableLocales)[number];
export type Culture = Locale;
