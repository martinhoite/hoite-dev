# @hoite-dev/ui

Shared UI foundation package.

This package owns the design token source, generated CSS custom properties, compiled shared CSS,
and public token/types exports consumed by the framework wrapper packages.

## CSS Layer Contract

The generated CSS exports keep token variables in named cascade layers so consumers can compose
or override them predictably.

- `@hoite-dev/ui/tokens.css` declares `tokens.layout`, `tokens.spacing`, `tokens.radius`,
  `tokens.size`, `tokens.stroke`, `tokens.motion.duration`, `tokens.motion.easing`,
  `tokens.typography.family`, `tokens.typography.weight`, `tokens.typography.size`,
  `tokens.typography.line-height`, `tokens.typography.letter-spacing`,
  `tokens.typography.paragraph-spacing`, and `tokens.primitive`.
- `@hoite-dev/ui/themes.css` declares `tokens.theme`.
- Both files declare the same @layer order, so their import order does not affect how the token layers cascade.
