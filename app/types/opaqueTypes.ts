/**
 * Opaque string type representing a valid ISO 8601 datetime.
 *
 * @helpers Runtime construction and validation helpers live in `utils/opaqueTypeHelpers`.
 */
export type IsoDateString = string & { readonly __isoDateStringTag: unique symbol };

/**
 * Opaque string type representing a valid ISO 8601 date (no time component).
 *
 * @helpers Runtime construction and validation helpers live in `utils/opaqueTypeHelpers`.
 */
export type IsoDateOnlyString = string & { readonly __isoDateOnlyDateTag: unique symbol };

/**
 * Opaque string type representing HTML content.
 *
 * @helpers Runtime construction and validation helpers live in `utils/opaqueTypeHelpers`.
 */
export type VhtmlString = string & { readonly __htmlStringTag: unique symbol };

/**
 * Opaque string type representing a valid URL.
 *
 * @helpers Runtime construction and validation helpers live in `utils/opaqueTypeHelpers`.
 */
export type UrlString = string & { readonly __urlStringTag: unique symbol };
