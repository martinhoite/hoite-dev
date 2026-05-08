# Frontend Docs

This workspace contains the Storybook-based documentation surfaces for frontend UI work.

Scope:
- `hub`: shared documentation entry point, including design system foundations, tokens, and refs.
- `design-system-react`: React implementation docs for the shared design system.
- `design-system-vue`: Vue implementation docs for the shared design system.
- `site-nuxt-components`: integration PoC for app-specific component documentation from `apps/site-nuxt`.
- `shared/docs`: cross-Storybook docs rendering helpers and source-link utilities for aligned React and Vue design-system docs pages.

`site-nuxt-components` is an integration PoC. It exists to prove that app-specific Storybooks can be built, referenced by the hub, and deployed alongside the design system docs.

Design-system docs pattern:
- Public React and Vue component docs use attached MDX pages.
- Framework CSF (Component Story Format) stories stay implementation-specific.
- Shared copy and section structure can come from framework-agnostic metadata, so React and Vue pages read the same while still rendering their own stories.
- Autodocs can be used for simple stories, but it is not the main pattern for shared public design-system docs.

Expected long-term use:
- Document app-specific components such as page sections, content blocks, and composed UI patterns.
- Follow the same hub/ref pattern that can later be reused for other frontend apps, such as `site-react-components`.
