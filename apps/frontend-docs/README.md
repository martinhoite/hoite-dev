# Frontend Docs

This workspace contains the Storybook implementation workbenches and shared helpers for frontend UI docs work.

The root docs app lives in the sibling workspace `apps/docs` and owns the public explanation, reference, and architecture layer.

Scope:
- `design-system-react`: React implementation docs for the shared design system.
- `design-system-vue`: Vue implementation docs for the shared design system.
- `site-nuxt-components`: integration PoC for app-specific component documentation from `apps/site-nuxt`.
- `shared`: the internal `@hoite-dev/frontend-docs-shared` package for cross-Storybook docs rendering helpers, source-link utilities, and shared Storybook setup.

`site-nuxt-components` is an integration PoC. It exists to prove that app-specific Storybooks can still share the same Storybook infrastructure when that surface returns to active maintenance.

Design-system docs pattern:
- Public React and Vue component docs use attached MDX pages.
- Framework CSF (Component Story Format) stories stay implementation-specific.
- Shared copy and section structure can come from framework-agnostic metadata, so React and Vue pages read the same while still rendering their own stories.
- Autodocs can be used for simple stories, but it is not the main pattern for shared public design-system docs.
- `apps/docs` owns the shared explanation layer, package boundaries, route-level architecture docs, and simplified visual contract samples.
- React and Vue Storybooks own interactive implementation behavior, controls, accessibility checks, and framework-specific rendering proof.

Consistency playbook:
- `DOCS_CONSISTENCY_README.md`: human workflow and usage guide.
- `DOCS_CONSISTENCY_AGENT_NOTES.md`: short execution checklist for automation-oriented edits.

Route model:
- `/` is owned by `apps/docs`.
- `/design-system/react/` is owned by the React Storybook build.
- `/design-system/vue/` is owned by the Vue Storybook build.
- The final same-origin static host is assembled by `apps/docs`, not by a composed Storybook hub.
- For string select controls whose URL values can look numeric, declare the argType as `{ type: { name: 'string' } }` so copied Storybook URLs such as `args=rotation:90` survive URL parsing and option validation.

Local host prerequisites:
- `127.0.0.1 docs.local.hoite.dev`
- `127.0.0.1 design-system-react.local.hoite.dev`
- `127.0.0.1 design-system-vue.local.hoite.dev`

Expected long-term use:
- Document app-specific components such as page sections, content blocks, and composed UI patterns.
- Keep Docusaurus as the root information architecture while Storybooks remain framework implementation workbenches.
