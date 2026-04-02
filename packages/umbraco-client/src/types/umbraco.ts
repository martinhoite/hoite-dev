import type {
  ContentId,
  DocTypeAlias,
  IsoDateOnlyString,
  IsoDateString,
  LocaleCode,
  RoutePath,
  StartItemKey,
  UrlString,
} from './opaque';
import type { Expand } from './utility';

export type UmbracoDeliveryApiStartItem = {
  id: ContentId;
  path: StartItemKey;
};

export type UmbracoContentRoute = {
  path: RoutePath;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoCultureInfo = {
  path: RoutePath;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoCultures = Record<LocaleCode, UmbracoCultureInfo>;

export type UmbracoContentItem<Properties = unknown, DocType extends string = DocTypeAlias> = {
  contentType: DocType;
  createDate: IsoDateString;
  cultures?: UmbracoCultures;
  id: ContentId;
  name: string;
  properties: Properties;
  route: UmbracoContentRoute;
};

export type UmbracoContentCollection<
  Properties = unknown,
  DocType extends string = DocTypeAlias,
> = {
  items: UmbracoContentItem<Properties, DocType>[];
  total: number;
};

export type UmbracoDeliveryApiResponse<
  Properties = unknown,
  DocType extends string = DocTypeAlias,
> = UmbracoContentItem<Properties, DocType>;

export type UmbracoContentResponse<
  Properties = unknown,
  DocType extends string = DocTypeAlias,
> = UmbracoContentCollection<Properties, DocType>;

export type UmbracoContentQueryParameters = {
  expand?: string;
  fetch?: string;
  fields?: string;
  filter?: string | string[];
  skip?: number;
  sort?: string | string[];
  take?: number;
};

export type UmbracoContentParameters = UmbracoContentQueryParameters;

export type UmbracoClientRequestOptions = {
  headers?: HeadersInit;
  locale?: LocaleCode;
  preview?: boolean;
  startItem?: StartItemKey;
};

export type UmbracoClientConfig = {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
  deliveryApiKey?: string;
  excludedDocTypes?: readonly string[];
};

export type UmbracoContentClientMethod = 'getNavigation' | 'getPageByRoute' | 'getSiteSettings';

export type UmbracoContentClientIssueCode =
  | 'expected_single_item_array'
  | 'invalid_content_theme'
  | 'invalid_required_value'
  | 'invalid_optional_url';

export type UmbracoContentClientIssueActionTaken =
  | 'returned_null'
  | 'used_default'
  | 'used_first_item';

export type UmbracoContentClientIssue = {
  actionTaken: UmbracoContentClientIssueActionTaken;
  code: UmbracoContentClientIssueCode;
  contentType?: string;
  field: string;
  method: UmbracoContentClientMethod;
  receivedCount?: number;
  receivedValue?: unknown;
};

export type UmbracoContentClientConfig = {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
  deliveryApiKey?: string;
  excludedDocTypes?: readonly string[];
  onIssue?: (issue: UmbracoContentClientIssue) => void;
};

export type UmbracoContentClientRequestOptions = {
  locale?: LocaleCode;
  preview?: boolean;
  startItem?: StartItemKey;
};

export type GetPageByRouteOptions = UmbracoContentClientRequestOptions & {
  path: string;
};

export type GetSiteSettingsOptions = UmbracoContentClientRequestOptions;

export type GetNavigationOptions = UmbracoContentClientRequestOptions;

export type UmbracoNodeId = ContentId & { readonly __umbracoNodeIdBrand: unique symbol };

export type UmbracoNodePath = RoutePath & { readonly __umbracoNodePathBrand: unique symbol };

export type UmbracoAlias = DocTypeAlias & { readonly __umbracoAliasBrand: unique symbol };

export type UmbracoNodeName = string & { readonly __umbracoNodeNameBrand: unique symbol };

export type SortDirection = 'asc' | 'desc';

export type AncestorsParameterPattern = `ancestors:${UmbracoNodeId | UmbracoNodePath}`;
export type ChildrenParameterPattern = `children:${UmbracoNodeId | UmbracoNodePath}`;
export type DescendantsParameterPattern = `descendants:${UmbracoNodeId | UmbracoNodePath}`;

export type FilterByContentPattern = `contentType:${UmbracoAlias}`;
export type FilterByNodeNamePattern = `name:${UmbracoNodeName}`;
export type FilterByCreationDateLessThanPattern = `createDate<${IsoDateOnlyString}`;
export type FilterByUpdateDateLessThanOrEqualPattern = `updateDate>:${IsoDateOnlyString}`;

export type SortByCreateDatePattern = `createDate:${SortDirection}`;
export type SortByUpdateDatePattern = `updateDate:${SortDirection}`;
export type SortByLevelPattern = `level:${SortDirection}`;
export type SortByNamePattern = `name:${SortDirection}`;
export type SortBySortOrderPattern = `sortOrder:${SortDirection}`;

export type UmbracoPropertyAliasArray = string & {
  readonly __umbracoPropertyAliasArrayBrand: unique symbol;
};

export type UmbracoPropertyTypes = 'properties[$all]' | `properties${UmbracoPropertyAliasArray}`;

export type UmbracoMediaExtensions = 'svg' | 'png' | 'jpg';
export type UmbracoMediaTypes = 'Image' | 'umbracoMediaVectorGraphics';

export type SimplifiedUmbracoLink = {
  url: UrlString | null;
  title: string;
  target: '_blank' | '_self' | '_parent' | '_top' | null;
};

export type UmbracoLink = Expand<
  SimplifiedUmbracoLink & {
    destinationId: ContentId;
    destinationType: string;
    linkType: 'Content' | string;
    queryString: string | string[] | null;
    route: UmbracoContentRoute;
  }
>;

export type UmbracoImageFocalPoint = {
  left: number;
  top: number;
};

export type UmbracoImage = {
  bytes: number;
  crops: unknown[];
  extension: UmbracoMediaExtensions;
  focalPoint: UmbracoImageFocalPoint;
  height: number | null;
  id: ContentId;
  mediaType: UmbracoMediaTypes;
  properties: unknown;
  url: UrlString;
  width: number | null;
};

export type SiteSettingsLogo = Expand<
  Omit<UmbracoImage, 'extension'> & {
    extension: 'svg';
  }
>;

export const availableContentThemes = ['dark', 'light'] as const;
export type ContentTheme = (typeof availableContentThemes)[number];
export type UmbracoThemeOption = 'Dark' | 'Light';

export type UmbracoSiteSettingsDefaults = {
  defaultTheme: ContentTheme;
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
  seoOpenGraphFallbackImage: UmbracoImage | null;
  seoTwitterFallbackImage: UmbracoImage | null;
};

export type UmbracoSiteSettings = Expand<
  UmbracoSiteSettingsMeta &
    UmbracoSiteSettingsDefaults &
    UmbracoSiteSettingsHeader &
    UmbracoSiteSettingsFooter
>;

export type UmbracoSiteSettingsResponse = {
  defaultTheme: UmbracoThemeOption | null;
  footerLogo: SiteSettingsLogo[] | null;
  headerLogo: SiteSettingsLogo[] | null;
  headerLogoLink: UmbracoLink[] | null;
  headerLogoText: string | null;
  metaTitleExtension: string | null;
  seoOpenGraphFallbackImage: UmbracoImage[] | null;
  seoTwitterFallbackImage: UmbracoImage[] | null;
};

export type UmbracoNavigationItemProperties = {
  includeChildrenInNavigation?: boolean;
  includeInNavigation?: boolean;
};

export type UmbracoNavigationItem = {
  children?: UmbracoNavigationItem[] | null;
  name: string;
  path: RoutePath;
};

export type UmbracoPageDisplaySettings = Expand<
  UmbracoNavigationItemProperties & {
    includeInSearch: boolean;
    includeInSiteMap: boolean;
    showBreadcrumbs: boolean;
  }
>;

export type UmbracoSeoAndMetaPageSettings = {
  canonicalURL: SimplifiedUmbracoLink | null;
  robotsFollow: boolean;
  robotsIndex: boolean;
  seoDescription: string;
  seoOpenGraphImage: UmbracoImage[] | null;
  seoTitle: string;
  seoTwitterImage: UmbracoImage[] | null;
};

export type UmbracoPageResponse = Expand<
  UmbracoSeoAndMetaPageSettings &
    UmbracoPageDisplaySettings & {
      blocks?: unknown;
    }
>;
