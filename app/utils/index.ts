/**
 * A simple service for getting the DOM window and document objects,
 * to prevent calling window or document during server side rendering.
 *
 * @returns {{ window: Window | null, document: Document | null }} An object containing window and document objects, or null if running in a server-side environment.
 */
export function useDOM(): { window: Window | null; document: Document | null } | null {
  // Check if running in a server-side environment (not in browser)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  // Return window and document objects
  return {
    window,
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
