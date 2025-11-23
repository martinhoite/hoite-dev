import type { ISODateString, ISODateOnlyString, URLString, VHTMLString } from '~/types/opaqueTypes';

/**
 * Matches full ISO 8601 date strings with time and timezone information.
 * Examples:
 * - 2024-07-31T22:02:34Z
 * - 2024-07-31T22:02:34.123Z
 * - 2024-07-31T22:02:34+02:00
 */
export const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

/**
 * Checks whether a value is a valid ISO 8601 datetime string.
 */
export function isISODateString(value: unknown): value is ISODateString {
  return typeof value === 'string' && ISO_DATETIME_REGEX.test(value);
}

/**
 * Validates and converts a string into an ISODateString.
 *
 * Throws if the value is not a valid ISO 8601 datetime string.
 */
export function toISODateString(value: string): ISODateString {
  if (!isISODateString(value)) {
    throw new Error(`Invalid ISODateString: ${value}`);
  }
  return value as ISODateString;
}

/**
 * Matches ISO 8601 date-only strings (no time component).
 * Example: 2024-07-31
 */
export const ISO_DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks whether a value is a valid ISO 8601 date-only string.
 */
export function isISODateOnlyString(value: unknown): value is ISODateOnlyString {
  return typeof value === 'string' && ISO_DATE_ONLY_REGEX.test(value);
}

/**
 * Validates and converts a string into an ISODateOnlyString.
 *
 * Throws if the value is not a valid ISO date-only string.
 */
export function toISODateOnlyString(value: string): ISODateOnlyString {
  if (!isISODateOnlyString(value)) {
    throw new Error(`Invalid ISODateOnlyString: ${value}`);
  }
  return value as ISODateOnlyString;
}

/**
 * Checks whether a string is a valid absolute or relative URL.
 * Uses the built-in URL constructor for validation.
 */
export function isURLString(value: unknown): value is URLString {
  if (typeof value !== 'string') return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates and converts a string into a URLString.
 *
 * Throws if the value is not a valid URL.
 */
export function toURLString(value: string): URLString {
  if (!isURLString(value)) {
    throw new Error(`Invalid URLString: ${value}`);
  }
  return value as URLString;
}

/**
 * Heuristically checks whether a string contains HTML markup.
 * This does not guarantee well-formed HTML, only that markup-like text exists.
 */
export function isVHTMLString(value: unknown): value is VHTMLString {
  return typeof value === 'string' && /<[^>]+>/.test(value);
}

/**
 * Validates and converts a string into a VHTMLString.
 *
 * Throws if the value does not appear to contain HTML markup.
 */
export function toVHTMLString(value: string): VHTMLString {
  if (!isVHTMLString(value)) {
    throw new Error(`Invalid VHTMLString: ${value}`);
  }
  return value as VHTMLString;
}
