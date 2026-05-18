# Frontend Docs

This workspace contains the Storybook-based documentation surfaces for frontend UI work.

Scope:
- `hub`: shared documentation entry point, including design system foundations, tokens, and refs.
- `design-system-react`: React implementation docs for the shared design system.
- `design-system-vue`: Vue implementation docs for the shared design system.
- `site-nuxt-components`: integration PoC for app-specific component documentation from `apps/site-nuxt`.
- `shared`: the internal `@hoite-dev/frontend-docs-shared` package for cross-Storybook docs rendering helpers, source-link utilities, and shared Storybook setup.

`site-nuxt-components` is an integration PoC. It exists to prove that app-specific Storybooks can be built and share the same docs infrastructure. Its hub ref is currently parked until the app-specific docs return to active maintenance.

Design-system docs pattern:
- Public React and Vue component docs use attached MDX pages.
- Framework CSF (Component Story Format) stories stay implementation-specific.
- Shared copy and section structure can come from framework-agnostic metadata, so React and Vue pages read the same while still rendering their own stories.
- Autodocs can be used for simple stories, but it is not the main pattern for shared public design-system docs.

Consistency playbook:
- `DOCS_CONSISTENCY_README.md`: human workflow and usage guide.
- `DOCS_CONSISTENCY_AGENT_NOTES.md`: short execution checklist for automation-oriented edits.

Storybook composition notes:
- The unified frontend docs container composes the React and Vue Storybooks through the hub.
- Storybook 10.4.0 still needs hub-local composition guards for hard-refreshing ref routes, keeping Controls attached to the correct ref iframe, and preserving copied URL `args` on composed ref stories.
- Those guards live in `hub/.storybook/storybookCompositionPreviewFrameWorkaround.ts`; re-check them after Storybook upgrades.
- For string select controls whose URL values can look numeric, declare the argType as `{ type: { name: 'string' } }` so copied Storybook URLs such as `args=rotation:90` survive URL parsing and option validation.

Expected long-term use:
- Document app-specific components such as page sections, content blocks, and composed UI patterns.
- Follow the same hub/ref pattern that can later be reused for other frontend apps, such as `site-react-components`.
