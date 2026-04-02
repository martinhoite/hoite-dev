/**
 * Expands a type into a flat object structure, simplifying complex nested types.
 * Useful for improving IntelliSense support.
 *
 * @template T - Type to be expanded.
 * @returns A flattened object type of `T`.
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
