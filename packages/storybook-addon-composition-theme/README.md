# `@hoite-dev/storybook-addon-composition-theme`

Storybook addon for deterministic composition-theme control in manager and preview documents.

This package provides:
- a toolbar tool
- preview setup
- preset hooks for manager/preview bootstrap
- config helpers and validation

Consumer apps provide theme values and storage keys. Runtime state is owned by `localStorage` + root attribute application.
