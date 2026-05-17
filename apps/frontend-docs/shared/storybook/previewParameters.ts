import type { FrontendDocsPlaygroundCodeVisibility } from './playgroundCodeRuntime.ts';
import { frontendDocsPlaygroundCodeDefaultVisibility } from './playgroundCodeRuntime.ts';

export type { FrontendDocsPlaygroundCodeVisibility } from './playgroundCodeRuntime.ts';

export const frontendDocsPreviewParameters = {
  backgrounds: {
    disable: true,
  },
} as const;

export const frontendDocsPlaygroundCodeGlobalKey = 'playgroundCode';

export const frontendDocsPreviewInitialGlobals = {
  [frontendDocsPlaygroundCodeGlobalKey]: frontendDocsPlaygroundCodeDefaultVisibility,
} satisfies Record<
  typeof frontendDocsPlaygroundCodeGlobalKey,
  FrontendDocsPlaygroundCodeVisibility
>;

export type FrontendDocsPreviewGlobals = {
  playgroundCode?: FrontendDocsPlaygroundCodeVisibility;
};

export function shouldShowFrontendDocsPlaygroundCode(
  globals: FrontendDocsPreviewGlobals | undefined,
): boolean {
  return globals?.playgroundCode === 'show';
}
