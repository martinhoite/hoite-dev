import type { Locale } from 'types';
import type { ISODateOnlyString } from 'types/utilityTypes';

export type UmbracoContentTypes = 'website' | 'contentPage';

export type UmbracoDeliveryApiStartItem = {
  id: string;
  path: string;
};

export type UmbracoCultureInfo = {
  path: string;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoDeliveryApiCultures = {
  en: UmbracoCultureInfo;
  da: UmbracoCultureInfo;
};

export type UmbracoDeliveryApiResponse<ContentProperties = unknown> = {
  contentType: UmbracoContentTypes;
  name: string;
  createDate: ISODateString;
  route: UmbracoRoute;
  id: string;
  properties: Expand<ContentProperties>;
  cultures: UmbracoDeliveryApiCultures;
};

export type UmbracoPageResponse = ExpandRecursively<UmbracoSeoAndMetaPageSettings> &
  ExpandRecursively<UmbracoPageDisplaySettings> & {
    blocks?: unknown;
  };

export type UmbracoContentResponse<ItemType> = {
  total: number;
  items: UmbracoDeliveryApiResponse<ItemType>[];
};

/**
 * Represents the ID of a node in Umbraco.
 *
 * Expects a string in the form of a GUID from the node in Umbraco.
 */
export type UmbracoNodeId = string & { readonly __umbracoNodeIdBrand: unique symbol };

/**
 * Represents the path to a node in Umbraco.
 *
 * Expects a string of a unique path to a specific node in Umbraco.
 */
export type UmbracoNodePath = string & { readonly __umbracoNodePathBrand: unique symbol };

/**
 * Represents the alias of a node in Umbraco.
 *
 * Expects a string of a unique alias from a node in Umbraco.
 */
export type UmbracoAlias = string & { readonly __umbracoAliasBrand: unique symbol };

/**
 * Represents the name of a node in Umbraco.
 *
 * Expects the name of a node in Umbraco.
 */
export type UmbracoNodeName = string & { readonly __umbracoNodeNameBrand: unique symbol };

export type SortDirection = 'asc' | 'desc';

export type AncestorsParameterPattern = `ancestors:${UmbracoNodeId | UmbracoNodePath}`;
export type ChildrenParameterPattern = `children:${UmbracoNodeId | UmbracoNodePath}`;
export type DescendantsParameterPattern = `descendants:${UmbracoNodeId | UmbracoNodePath}`;

export type FilterByContentPattern = `contentType:${UmbracoAlias}`;
export type FilterByNodeNamePattern = `name:${UmbracoNodeName}`;
export type FilterByCreationDateLessThanPattern = `createDate<${ISODateOnlyString}`;
export type FilterByUpdateDateLessThanOrEqualPattern = `updateDate>:${ISODateOnlyString}`;

export type SortByCreateDatePattern = `createDate:${SortDirection}`;
export type SortByUpdateDatePattern = `updateDate:${SortDirection}`;
export type SortByLevelPattern = `level:${SortDirection}`;
export type SortByNamePattern = `name:${SortDirection}`;
export type SortBySortOrderPattern = `sortOrder:${SortDirection}`;

/**
 * Represents an array of one or more node property aliases (can be nested) in Umbraco.
 * @example
 * [alias1]
 * [alias1,alias2]
 * [alias1,alias2]
 * [alias1,properties[nestedAlias1]]
 * [alias1,properties[nestedAlias1,nestedAlias2]]
 * [alias1,alias2,alias3properties[nestedAlias1,nestedAlias2]] // Gets the properties of alias1, alias2, and the specific nestedAliases from alias3.
 */
export type UmbracoPropertyAliasArray = string & { readonly __umbracoPropertyAliasArrayBrand: unique symbol };

export type UmbracoPropertyTypes = 'properties[$all]' | `properties${UmbracoPropertyAliasArray}`;

type FilterPattern =
  | FilterByContentPattern
  | FilterByNodeNamePattern
  | FilterByCreationDateLessThanPattern
  | FilterByUpdateDateLessThanOrEqualPattern;

type SortPattern =
  | SortByCreateDatePattern
  | SortByUpdateDatePattern
  | SortByLevelPattern
  | SortByNamePattern
  | SortBySortOrderPattern;

export type UmbracoContentParameters = {
  fetch: 'fetch' | AncestorsParameterPattern | ChildrenParameterPattern | DescendantsParameterPattern;
  filter?: FilterPattern | FilterPattern[];
  sort?: SortPattern | SortPattern[];
  skip?: number;
  take?: number;
  expand?: UmbracoPropertyTypes;
  fields: UmbracoPropertyTypes;
};

export type UmbracoContentHeaders = HeadersInit & {
  'Accept-Language': Locale;
  'Api-Key'?: string;
  Preview?: boolean;
  'Start-Item': UmbracoNodeId | UmbracoNodePath;
};
