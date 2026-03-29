import type { ConsoleLogTypes, Locale } from 'types';
import { AvailableLocales } from 'types';

/**
 * A simple service for getting the DOM window and document objects,
 * to prevent calling window or document during server side rendering.
 *
 * @returns {{ window: Window | null, document: Document | null }} An object containing window and document objects, or null if running in a server-side environment.
 */
export function useDom(): { window: Window | null; document: Document | null } | null {
  // Check if running in a server-side environment (not in browser)
  // eslint-disable-next-line no-restricted-globals
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  // Return window and document objects
  return {
    // eslint-disable-next-line no-restricted-globals
    window,
    // eslint-disable-next-line no-restricted-globals
    document,
  };
}

/**
 * Logs messages to the console, but only in development environments.
 * The log level (e.g., 'log', 'info', 'warn', 'error') is determined by the provided `logType`.
 * This function ensures logs are not displayed in UAT or production environments.
 *
 * @param {string} logStatement - The main message or statement to be logged.
 * @param {ConsoleLogTypes} logType - The type of log (e.g., 'log', 'info', 'warn', 'error').
 * @param {unknown} [data=null] - Optional additional data to be logged with the message.
 */
export function devOnlyConsoleLog(
  logStatement: string,
  logType: ConsoleLogTypes = 'info',
  data: unknown = null,
) {
  if (import.meta.server) return;

  const { $logger } = useNuxtApp();

  if ($logger[logType]) {
    $logger[logType](logStatement, true, data);
  } else {
    // eslint-disable-next-line no-console
    console.warn('Invalid log type used in devOnlyConsoleLog:', logType);
  }
}

/**
 * Extracts the subdomain from a given hostname.
 *
 * @param {string} hostname - The full hostname (e.g., "martin.hoite.dev").
 * @returns {string | null} The subdomain if it exists; otherwise, null.
 *
 * @example
 * // Returns "martin" for "martin.hoite.dev"
 * const subdomain = getSubdomain('martin.hoite.dev');
 *
 * @example
 * // Returns null for "hoite.dev"
 * const subdomain = getSubdomain('hoite.dev');
 */
export function getSubdomain(hostname: string): string | null {
  const parts = hostname.split('.');

  if (parts.length <= 2) {
    return null;
  }

  return parts[0] ?? null;
}

/**
 * Extracts the locale from a URL where the locale is the first path segment.
 *
 * @param {string} url - The full URL (e.g., "https://martin.hoite.dev/en/kitchen-sink").
 * @returns {string | null} The locale if it exists; otherwise, null.
 *
 * @example
 * // Returns "en" for "https://martin.hoite.dev/en/kitchen-sink"
 * const locale = getLocaleFromUrl('https://martin.hoite.dev/en/kitchen-sink');
 *
 * @example
 * // Returns null for "https://martin.hoite.dev/"
 * const locale = getLocaleFromUrl('https://martin.hoite.dev/');
 */
export function getLocaleFromUrl(url: UrlString) {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter((segment) => segment.length > 0);
    return pathSegments.length > 0 ? pathSegments[0] : null;
  } catch (error) {
    const { $logger } = useNuxtApp();
    $logger.error('Invalid URL:', false, error);
    return null;
  }
}

/**
 * Extracts the locale from a path where the locale is the first path segment.
 *
 * @param {string} path - The path (e.g., "/en/kitchen-sink").
 * @returns {string | null} The locale if it exists; otherwise, null.
 *
 * @example
 * // Returns "en" for "/en/kitchen-sink"
 * const locale = getLocaleFromPath('/en/kitchen-sink');
 *
 * @example
 * // Returns null for "/kitchen-sink"
 * const locale = getLocaleFromPath('/kitchen-sink');
 */
export function getLocaleFromPath(path: string): Locale | null {
  try {
    const pathSegments = path.split('/').filter((segment) => segment.length > 0);

    const potentialLocale = pathSegments[0];
    const isValidLocale = AvailableLocales.includes(potentialLocale as Locale);

    return isValidLocale ? (potentialLocale as Locale) : null;
  } catch (error) {
    const { $logger } = useNuxtApp();
    $logger.error('Error processing path:', false, error);
    return null;
  }
}

/**
 * Removes the locale from a path where the locale is the first path segment.
 *
 * @param {string} path - The original path (e.g., "/en/kitchen-sink").
 * @returns {string} The path with the locale removed (e.g., "/kitchen-sink").
 *
 * @example
 * // Returns "/kitchen-sink" for "/en/kitchen-sink"
 * const newPath = removeLocaleFromPath('/en/kitchen-sink');
 *
 * @example
 * // Returns "/kitchen-sink" for "/kitchen-sink" (no locale present)
 * const newPath = removeLocaleFromPath('/kitchen-sink');
 */
export function removeLocaleFromPath(path: string): string {
  try {
    const pathSegments = path.split('/').filter((segment) => segment.length > 0);

    if (
      pathSegments.length > 0 &&
      AvailableLocales.includes(pathSegments[0] as (typeof AvailableLocales)[number])
    ) {
      pathSegments.shift();
    }

    return `/${pathSegments.join('/')}`;
  } catch (error) {
    const { $logger } = useNuxtApp();
    $logger.error('Error processing path:', false, error);
    return path; // Return original path in case of error
  }
}

/**
 * Extracts a single item from a (possibly nullable) array that is expected to contain at most one element.
 *
 * If the array has more than one item, an error is logged via the Nuxt $logger.
 * Returns the first item if the array has exactly one item.
 * Returns null if the array is null, empty, or has multiple items.
 *
 * @template T The expected type of the array item.
 * @param {T[] | null} array - The array to extract a single item from.
 * @returns {T | null} The single item from the array, or null.
 */
export function handleUmbracoSingleArray<T = unknown>(array: T[] | null): T | null {
  if (array) {
    if (array.length > 1) {
      const { $logger } = useNuxtApp();
      $logger.error('Assumed single array is multiple:', true, array);
    } else {
      return array[0] ?? null;
    }
  }

  return null;
}

export function getSingleUmbracoUrlFromArray(
  linkArray: UmbracoLink[] | null,
): SimplifiedUmbracoLink | null {
  const singleItem = handleUmbracoSingleArray(linkArray) as UmbracoLink | null;

  if (singleItem) {
    return {
      url: singleItem.route.path as UrlString,
      target: singleItem.target,
      title: singleItem.title,
    };
  }

  return null;
}

export function getMediaLink(path: string): string {
  const {
    public: { mediaBase },
  } = useRuntimeConfig();

  return `${mediaBase}${path}`;
}
