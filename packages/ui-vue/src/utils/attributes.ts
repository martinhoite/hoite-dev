export function pickAriaAndDataAttributes(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key.startsWith('aria-') || key.startsWith('data-')),
  );
}
