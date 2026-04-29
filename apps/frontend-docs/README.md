# Frontend Docs

This workspace contains the Storybook-based documentation surfaces for frontend UI work.

Scope:
- `hub`: shared documentation entry point, including design system foundations, tokens, and refs.
- `design-system-react`: React implementation docs for the shared design system.
- `design-system-vue`: Vue implementation docs for the shared design system.
- `site-nuxt-components`: integration PoC for app-specific component documentation from `apps/site-nuxt`.

`site-nuxt-components` exists to verify that app-specific Storybooks can be built, bundled, referenced by the hub, and deployed together with the design system docs.

Expected long-term use:
- Document app-specific components such as page sections, content blocks, and composed UI patterns.
- Follow the same hub/ref pattern that can later be reused for other frontend apps, such as `site-react-components`.

Do not present `site-nuxt-components` as complete or mature yet. Keep the README clear that it is an integration PoC.
