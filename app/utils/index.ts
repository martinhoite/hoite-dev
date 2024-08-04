/**
 * A simple service for getting the DOM window and document objects,
 * to prevent calling window or document during server side rendering.
 *
 * @returns {{ window: Window | null, document: Document | null }} An object containing window and document objects, or null if running in a server-side environment.
 */
export function useDOM(): { window: Window | null; document: Document | null } | null {
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
    document
  };
}

/**
 * Retrieves the pixel value of a CSS variable and returns it as a number.
 *
 * @param {string} variable - The name of the CSS variable (e.g., '--header-height').
 * @returns {number} The pixel value of the CSS variable as a number.
 *                   Returns 0 if the variable doesn't exist or isn't a valid number.
 *
 * @example
 * // CSS: --header-height: 100px;
 * const headerHeight = extractNumberFromCSSVariable('--header-height');
 * console.log(headerHeight); // Outputs: 100
 */
export function extractNumberFromCSSVariable(variable: string): number {
  const variableRef = useCssVars(variable);
  let value = variableRef.value;

  if (value?.endsWith('rem')) {
    value = parseFloat(value) * 16 + 'px'; // Convert rem to px for consistency
  }

  const number = Number(value?.replace('px', '') || 0);

  return number;
}

/**
 * A simple logging service that only logs to console in development.
 * @example
 * const loggingService = useLoggingService();
 *
 * loggingService.log('Hello world!');
 * loggingService.warn('Hello world!');
 * loggingService.error('Hello world!');
 * loggingService.info('Hello world!');
 */
export function useLoggingService(developmentOnly: boolean = false) {
  type LogLevel = 'log' | 'warn' | 'error' | 'info';

  const {
    public: { environment }
  } = useRuntimeConfig();

  // const applicationInsights = useApplicationInsights();

  function createLogger(level: LogLevel) {
    return function (...args: unknown[]) {
      if (environment !== 'production') {
        // eslint-disable-next-line no-console
        (console[level] as (message?: unknown, ...optionalParams: unknown[]) => void)(...args);
      }

      // TODO: Use application insights
      // if (!developmentOnly && environment !== 'development') {
      //   appInsights?.trackTrace({ message: `${level}: ${String(args)}` });
      // }
    };
  }

  return {
    log: createLogger('log'),
    warn: createLogger('warn'),
    error: createLogger('error'),
    info: createLogger('info')
  };
}

/**
 * Logging for developement environments only (i.e. won't show on UAT & Prod environments)
 * @param logStatement What the console warning should say
 * @param data Optional data to be added to the warning
 */
export function devOnlyConsoleLog(logStatement: string, data: unknown = null) {
  useLoggingService().info('\x1B[36m%s\x1B[0m', logStatement, data);
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
  return parts.length > 2 ? parts[0] : null;
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
export function getLocaleFromUrl(url: URLString) {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter((segment) => segment.length > 0);
    return pathSegments.length > 0 ? pathSegments[0] : null;
  } catch (error) {
    useLoggingService().error('Invalid URL:', error);
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
export function getLocaleFromPath(path: string): string | null {
  try {
    const pathSegments = path.split('/').filter((segment) => segment.length > 0);
    return pathSegments.length > 0 ? pathSegments[0] : null;
  } catch (error) {
    useLoggingService().error('Error processing path:', error);
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

    if (pathSegments.length > 0) {
      pathSegments.shift(); // Remove the first segment (locale)
    }

    return '/' + pathSegments.join('/');
  } catch (error) {
    useLoggingService().error('Error processing path:', error);
    return path; // Return original path in case of error
  }
}

export function handleUmbracoSingleArray(array: unknown[] | null): unknown | null {
  if (array) {
    if (array.length > 1) {
      useLoggingService(true).error('Assumed single array is multiple:', array);
    } else {
      return array[0];
    }
  }

  return null;
}

export function getSingleUmbracoUrlFromArray(linkArray: UmbracoLink[] | null): SimplifiedUmbracoLink | null {
  const singleItem = handleUmbracoSingleArray(linkArray) as UmbracoLink | null;

  if (singleItem) {
    return {
      url: singleItem.route.path as URLString,
      target: singleItem.target,
      title: singleItem.title
    };
  }

  return null;
}

export function getMediaLink(path: string): string {
  const {
    public: { mediaBase }
  } = useRuntimeConfig();

  return `${mediaBase}${path}`;
}
