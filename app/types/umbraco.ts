export type UmbracoMediaExtensions = 'svg' | 'png' | 'jpg';
export type UmbracoMediaTypes = 'Image' | 'umbracoMediaVectorGraphics';

export type UmbracoRoute = {
  path: string;
  startItem: UmbracoDeliveryApiStartItem;
};

export type SimplifiedUmbracoLink = {
  url: string | null;
  title: string;
  target: '_blank' | '_self' | '_parent' | '_top' | null;
};

export type UmbracoLink = Expand<SimplifiedUmbracoLink> & {
  queryString: string | string[] | null;
  destinationId: string;
  destinationType: string;
  route: UmbracoRoute;
  linkType: 'Content' | string;
};

export type UmbracoImageFocalPoint = {
  left: number;
  top: number;
};

export type UmbracoImage = {
  focalPoint: UmbracoImageFocalPoint;
  crops: unknown[];
  id: string;
  mediaType: UmbracoMediaTypes;
  url: string;
  extension: UmbracoMediaExtensions;
  width: number | null;
  height: number | null;
  bytes: number;
  properties: unknown;
};

export type UmbracoSiteSettingsHeader = {
  headerLogo: UmbracoImage | null;
  headerLogoLink: SimplifiedUmbracoLink | null;
};

export type UmbracoSiteSettingsFooter = {
  footerLogo: UmbracoImage | null;
};

export type UmbracoSiteSettings = Expand<UmbracoSiteSettingsHeader> & Expand<UmbracoSiteSettingsFooter>;

export type UmbracoSiteSettingsResponse = {
  headerLogo: UmbracoImage[] | null;
  headerLogoLink: UmbracoLink[] | null;
  footerLogo: UmbracoImage[] | null;
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
