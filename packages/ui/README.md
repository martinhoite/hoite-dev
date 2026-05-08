# @hoite-dev/ui

Shared UI foundation package for the Hoite Dev design system.

This package owns the shared styling foundation used by the framework packages. It contains the design token source, generated CSS custom properties, compiled shared CSS, and public style-related exports such as CVA definitions, token values, and related types.

It also owns shared design-system docs metadata that belongs with the styling contract, such as component copy, usage notes, controls guidance, and source-link metadata used by both React and Vue Storybook docs pages.

It does not contain framework-specific component implementations. Those live in packages such as `@hoite-dev/ui-react`.

## Storybook

Storybook stories should reflect the package boundary.

- `@hoite-dev/ui` owns the shared typography contract and similar shared component contracts.
- Shared overview stories should document that contract through values such as supported variants, supported tags, default tag mappings, and class output from shared helpers.
- Framework-specific stories should live under their own Vue or React group and only prove that the wrapper components render the shared contract correctly.
- Shared public React and Vue component docs can import metadata from this package so both frameworks present the same copy and section structure while rendering their own stories.

## CSS Layer Contract

The generated CSS exports keep token variables in named cascade layers so consumers can compose or override them predictably.

- `@hoite-dev/ui/tokens.css` contains the generated token layer definitions
- `@hoite-dev/ui/themes.css` contains the generated theme layer definitions
- Both files declare the same `@layer` order, so their import order does not affect how the token layers cascade
- Exported CSS subpaths such as `@hoite-dev/ui/icon.css` are side-effect CSS entry points. They use one shared side-effect declaration file rather than per-file string-export stubs.
