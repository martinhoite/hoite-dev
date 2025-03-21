import type { Theme } from '.';

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

export type SiteSettingsLogo = Expand<Omit<UmbracoImage, 'extension'>> & {
  extension: 'svg';
};

export type UmbracoThemeOption = 'Dark' | 'Light';

export type UmbracoSiteSettingsDefaults = {
  defaultTheme: Theme;
};

export type UmbracoSiteSettingsHeader = {
  headerLogo: SiteSettingsLogo | null;
  headerLogoLink: SimplifiedUmbracoLink | null;
  headerLogoText: string | null;
};

export type UmbracoSiteSettingsFooter = {
  footerLogo: SiteSettingsLogo | null;
};

export type UmbracoSiteSettingsMeta = {
  metaTitleExtension: string;
  seoOpenGraphFallbackImage: UmbracoImage;
  seoTwitterFallbackImage: UmbracoImage;
};

export type UmbracoSiteSettings = Expand<UmbracoSiteSettingsMeta> &
  Expand<UmbracoSiteSettingsDefaults> &
  Expand<UmbracoSiteSettingsHeader> &
  Expand<UmbracoSiteSettingsFooter>;

export type UmbracoSiteSettingsResponse = {
  metaTitleExtension: string | null;
  seoOpenGraphFallbackImage: UmbracoImage[] | null;
  seoTwitterFallbackImage: UmbracoImage[] | null;
  headerLogo: UmbracoImage[] | null;
  headerLogoLink: UmbracoLink[] | null;
  headerLogoText: string | null;
  footerLogo: UmbracoImage[] | null;
  defaultTheme: UmbracoThemeOption | null;
};

export type UmbracoNavigationItemProperties = {
  includeInNavigation?: boolean;
  includeChildrenInNavigation?: boolean;
};

export type UmbracoNavigationItem = {
  name: string;
  path: string;
  children?: UmbracoNavigationItem[] | null;
};

export type UmbracoPageDisplaySettings = Expand<UmbracoNavigationItemProperties> & {
  includeInSearch: boolean;
  includeInSiteMap: boolean;
  showBreadcrumbs: boolean;
};

export type UmbracoSeoAndMetaPageSettings = {
  seoTitle: string;
  seoDescription: string;
  seoOpenGraphImage: UmbracoImage[] | null;
  seoTwitterImage: UmbracoImage[] | null;
  canonicalURL: SimplifiedUmbracoLink | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
};
