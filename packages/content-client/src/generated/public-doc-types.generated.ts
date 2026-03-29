export const excludedUmbracoDocTypes = [] as const;

export const publicUmbracoDocTypes = ['contentPage', 'frontpage', 'siteSettings'] as const;

export type ExcludedUmbracoDocType = (typeof excludedUmbracoDocTypes)[number];
export type PublicUmbracoDocType = (typeof publicUmbracoDocTypes)[number];
