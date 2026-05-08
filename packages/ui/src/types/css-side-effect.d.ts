// Makes the exported package CSS files valid side-effect imports for projects
// that consume `@hoite-dev/ui`, for example:
//
//   import '@hoite-dev/ui/fonts.css';
//
// The CSS is loaded by the consuming app's bundler. This file only tells
// TypeScript that the import is valid and intentionally exposes no values.
export {};
