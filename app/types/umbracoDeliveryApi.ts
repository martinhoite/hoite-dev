import type { UmbracoRoute } from './umbraco';

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
  properties: ContentProperties;
  cultures: UmbracoDeliveryApiCultures;
};

export type UmbracoPageResponse = ExpandRecursively<UmbracoSeoAndMetaPageSettings> &
  ExpandRecursively<UmbracoPageDisplaySettings> & {
    blocks?: unknown;
  };
