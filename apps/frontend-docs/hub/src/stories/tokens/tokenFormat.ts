export type TokenValue = unknown;

export function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return true;
  }

  return false;
}

export function resolveCssVar(path: readonly string[], leaf: Record<string, unknown>): string {
  const extensions = leaf.$extensions;

  if (isRecord(extensions)) {
    const codeSyntax = extensions['com.figma.codeSyntax'];

    if (isRecord(codeSyntax)) {
      const webSyntax = codeSyntax.WEB;

      if (typeof webSyntax === 'string') {
        const varMatch = /var\((--[^)\s]+)\)/.exec(webSyntax);

        if (varMatch?.[1]) {
          return varMatch[1];
        }

        if (webSyntax.startsWith('--')) {
          return webSyntax;
        }
      }
    }
  }

  const fallback = path
    .join('-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-');

  return `--${fallback.toLowerCase()}`;
}

function formatRgbaFromComponents(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const components = value.components;

  if (!Array.isArray(components) || components.length < 3) {
    return null;
  }

  const alpha = typeof value.alpha === 'number' ? value.alpha : 1;
  const red = Math.round(Number(components[0]) * 255);
  const green = Math.round(Number(components[1]) * 255);
  const blue = Math.round(Number(components[2]) * 255);

  if (alpha < 1) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  return `rgb(${red}, ${green}, ${blue})`;
}

export function resolveTokenValue(value: TokenValue): string {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (isRecord(value)) {
    const rgba = formatRgbaFromComponents(value);
    const hex = typeof value.hex === 'string' ? value.hex : null;

    if (hex) {
      return hex;
    }

    if (rgba) {
      return rgba;
    }

    return JSON.stringify(value);
  }

  return '[unresolved value]';
}

export function resolveColorDisplayValue(value: TokenValue): string {
  if (isRecord(value)) {
    const alpha = typeof value.alpha === 'number' ? value.alpha : 1;
    const rgba = formatRgbaFromComponents(value);
    const hex = typeof value.hex === 'string' ? value.hex : null;

    if (alpha < 1 && rgba) {
      return rgba;
    }

    if (hex) {
      return hex;
    }

    if (rgba) {
      return rgba;
    }
  }

  return resolveTokenValue(value);
}

export function resolveColorSwatchValue(value: TokenValue): string | null {
  if (isRecord(value)) {
    const rgba = formatRgbaFromComponents(value);

    if (rgba) {
      return rgba;
    }

    if (typeof value.hex === 'string') {
      return value.hex;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  return null;
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const match = /-?\d*\.?\d+/.exec(value);

  if (!match?.[0]) {
    return null;
  }

  return Number(match[0]);
}

export function parseDurationMs(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const unitMatch = /^(-?\d*\.?\d+)\s*(ms|s)?$/i.exec(trimmed);

  if (!unitMatch) {
    return parseNumber(trimmed);
  }

  const numeric = Number(unitMatch[1]);
  const unit = (unitMatch[2] ?? '').toLowerCase();

  if (unit === 's') {
    return numeric * 1000;
  }

  return numeric;
}

export function toCategoryLabel(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function formatDurationDisplayValue(cssValue: string, isDurationToken: boolean): string {
  if (!isDurationToken) {
    return cssValue;
  }

  const durationMs = parseDurationMs(cssValue);

  if (durationMs === null) {
    return cssValue;
  }

  return `${durationMs}ms`;
}
