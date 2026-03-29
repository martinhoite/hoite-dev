export type UmbracoDeliveryApiStartItem = {
  id: string;
  path: string;
};

export type UmbracoContentRoute = {
  path: string;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoCultureInfo = {
  path: string;
  startItem: UmbracoDeliveryApiStartItem;
};

export type UmbracoCultures = Record<string, UmbracoCultureInfo>;

export type UmbracoContentItem<Properties = unknown, DocType extends string = string> = {
  contentType: DocType;
  createDate: string;
  cultures?: UmbracoCultures;
  id: string;
  name: string;
  properties: Properties;
  route: UmbracoContentRoute;
};

export type UmbracoContentCollection<Properties = unknown, DocType extends string = string> = {
  items: UmbracoContentItem<Properties, DocType>[];
  total: number;
};

export type UmbracoContentQueryParameters = {
  expand?: string;
  fetch?: string;
  fields?: string;
  filter?: string | string[];
  skip?: number;
  sort?: string | string[];
  take?: number;
};

export type UmbracoClientRequestOptions = {
  headers?: HeadersInit;
  locale?: string;
  preview?: boolean;
  startItem?: string;
};

export type UmbracoClientConfig = {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
  deliveryApiKey?: string;
  excludedDocTypes?: readonly string[];
};
