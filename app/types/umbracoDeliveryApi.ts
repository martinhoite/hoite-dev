export type UmbracoDeliveryApiStartItem = {
  id: string;
  path: string;
};

export type UmbracoDeliveryApiRoute = {
  path: string;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoCultureInfo = {
  path: string;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoDeliveryApiCultures = {
  'en-bg': UmbracoCultureInfo;
  'da-dk': UmbracoCultureInfo;
};

export type UmbracoDeliveryApiResponse<ContentType = unknown> = {
  contentType: string;
  name: string;
  createDate: ISODateString;
  route: UmbracoDeliveryApiRoute;
  id: string;
  properties: ContentType;
  cultures: UmbracoDeliveryApiCultures;
};

export type UmbracoPageDisplaySettings = {
  includeInNavigation: boolean;
  includeChildrenInNavigation: boolean;
  includeInSearch: boolean;
  includeInSiteMap: boolean;
  showBreadcrumbs: boolean;
};

export type UmbracoSeoAndMetaPageSettings = {
  seoTitle: string;
  seoDecription: string;
  canonicalURL: SimplifiedUmbracoLink | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

export type UmbracoPageResponse = ExpandRecursively<UmbracoSeoAndMetaPageSettings> &
  ExpandRecursively<UmbracoPageDisplaySettings> & {
    blocks?: unknown;
  };
