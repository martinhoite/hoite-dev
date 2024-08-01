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
