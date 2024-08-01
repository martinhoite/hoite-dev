/**
 * Expands a type into a flat object structure, simplifying complex nested types.
 * Useful for improving IntelliSense support.
 *
 * @template T - Type to be expanded.
 * @returns A flattened object type of `T`.
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Recursively expands a type, flattening even deeply nested structures.
 * Enhances IntelliSense by simplifying complex type hierarchies.
 *
 * @template T - Type to be recursively expanded.
 * @returns A recursively flattened object type of `T`.
 */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

/**
 * A type alias for a string that is specifically designated to represent an ISO date.
 * This type uses a branding technique to differentiate between plain strings and ISO date strings.
 *
 * @example
 * // Correct usage:
 * let isoDateString: ISODateString = '2024-07-31T22:02:34.023Z' as ISODateString;
 *
 * // Incorrect usage:
 * // let isoDateString: ISODateString = 'Hello, world!'; // This would not be allowed without explicit casting
 */
export type ISODateString = string & { readonly __isoDateStringBrand: unique symbol };

/**
 * A type alias for a string that is specifically designated to contain HTML content.
 * This type uses a branding technique to differentiate between plain strings and HTML strings.
 *
 * @example
 * // Correct usage:
 * let htmlContent: VHTMLString = '<p>Hello, world!</p>' as VHTMLString;
 *
 * // Incorrect usage:
 * // let htmlContent: VHTMLString = 'Hello, world!'; // This would not be allowed without explicit casting
 */
export type VHTMLString = string & { readonly __htmlStringBrand: unique symbol };

/**
 * A type alias for a string that is specifically designated to contain URL content.
 * This type uses a branding technique to differentiate between plain strings and URL strings.
 *
 * @example
 * // Correct usage:
 * let urlString: URLString = 'https://www.example.com' as URLString;
 *
 * // Incorrect usage:
 * // let urlString: URLString = 'Not a URL'; // This would not be allowed without explicit casting
 *
 * @note Please verify this is actually a URL when using it.
 *
 * @example
 * // Example validation using the URL constructor:
 * const url = 'https://www.example.com';
 * try {
 *   new URL(url);
 *   let urlString: URLString = url as URLString;
 * } catch (_) {
 *   console.error('Invalid URL');
 * }
 */
export type URLString = string & { readonly __urlStringBrand: unique symbol };
