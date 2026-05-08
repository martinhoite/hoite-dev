export const supportedLoadingSizes = ['small', 'medium', 'large'] as const;
export const supportedLoadingColors = ['primary', 'secondary', 'on-fill'] as const;

export type LoadingSize = (typeof supportedLoadingSizes)[number];
export type LoadingColor = (typeof supportedLoadingColors)[number];
