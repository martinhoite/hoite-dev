export type IsoDateString = string & { readonly __isoDateStringTag: unique symbol };

export type IsoDateOnlyString = string & { readonly __isoDateOnlyDateTag: unique symbol };

export type HtmlString = string & { readonly __htmlStringTag: unique symbol };

export type UrlString = string & { readonly __urlStringTag: unique symbol };

export type LocaleCode = string & { readonly __localeCodeTag: unique symbol };

export type RoutePath = string & { readonly __routePathTag: unique symbol };

export type StartItemKey = string & { readonly __startItemKeyTag: unique symbol };

export type ContentId = string & { readonly __contentIdTag: unique symbol };

export type DocTypeAlias = string & { readonly __docTypeAliasTag: unique symbol };
