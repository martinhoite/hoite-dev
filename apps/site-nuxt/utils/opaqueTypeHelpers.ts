import type { IsoDateOnlyString, IsoDateString, UrlString, VhtmlString } from '~/types/opaqueTypes';

/**
 * Matches full ISO 8601 date strings with time and timezone information.
 * Examples:
 * - 2024-07-31T22:02:34Z
 * - 2024-07-31T22:02:34.123Z
 * - 2024-07-31T22:02:34+02:00
 */
export const ISO_DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

/**
 * Checks whether a value is a valid ISO 8601 datetime string.
 */
export function isIsoDateString(value: unknown): value is IsoDateString {
  return typeof value === 'string' && ISO_DATETIME_REGEX.test(value);
}

/**
 * Validates and converts a string into an IsoDateString.
 *
 * Throws if the value is not a valid ISO 8601 datetime string.
 */
export function toIsoDateString(value: string): IsoDateString {
  if (!isIsoDateString(value)) {
    throw new Error(`Invalid IsoDateString: ${value}`);
  }
  return value as IsoDateString;
}

/**
 * Matches ISO 8601 date-only strings (no time component).
 * Example: 2024-07-31
 */
export const ISO_DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks whether a value is a valid ISO 8601 date-only string.
 */
export function isIsoDateOnlyString(value: unknown): value is IsoDateOnlyString {
  return typeof value === 'string' && ISO_DATE_ONLY_REGEX.test(value);
}

/**
 * Validates and converts a string into an ISODateOnlyString.
 *
 * Throws if the value is not a valid ISO date-only string.
 */
export function toIsoDateOnlyString(value: string): IsoDateOnlyString {
  if (!isIsoDateOnlyString(value)) {
    throw new Error(`Invalid ISODateOnlyString: ${value}`);
  }
  return value as IsoDateOnlyString;
}

/**
 * Checks whether a string is a valid absolute or relative URL.
 * Uses the built-in URL constructor for validation.
 */
export function isUrlString(value: unknown): value is UrlString {
  if (typeof value !== 'string') return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates and converts a string into a UrlString.
 *
 * Throws if the value is not a valid URL.
 */
export function toUrlString(value: string): UrlString {
  if (!isUrlString(value)) {
    throw new Error(`Invalid UrlString: ${value}`);
  }
  return value as UrlString;
}

/**
 * Heuristically checks whether a string contains HTML markup.
 * This does not guarantee well-formed HTML, only that markup-like text exists.
 */
export function isVhtmlString(value: unknown): value is VhtmlString {
  return typeof value === 'string' && /<[^>]+>/.test(value);
}

/**
 * Validates and converts a string into a VhtmlString.
 *
 * Throws if the value does not appear to contain HTML markup.
 */
export function toVhtmlString(value: string): VhtmlString {
  if (!isVhtmlString(value)) {
    throw new Error(`Invalid VhtmlString: ${value}`);
  }
  return value as VhtmlString;
}
