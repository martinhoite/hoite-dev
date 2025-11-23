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
