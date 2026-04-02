export const allUmbracoDocTypes = ['contentPage', 'frontpage', 'siteSettings'] as const;

export type UmbracoDocType = (typeof allUmbracoDocTypes)[number];

export const umbracoDocTypeSource = 'Generated from openapi/doc-types.seed.json.' as const;
