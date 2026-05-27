export function createFrontendDocsPlaygroundControls<TControlName extends string>(
  include: readonly TControlName[],
) {
  return {
    include: Array.from(include),
    sort: 'none' as const,
  };
}

export function normalizeStoryValue<TValue extends string>(
  value: TValue,
  supportedValues: readonly TValue[],
  fallbackValue: TValue,
): TValue {
  if (supportedValues.includes(value)) {
    return value;
  }

  return fallbackValue;
}

export function normalizeOptionalStoryValue<TValue extends string>(
  value: TValue | undefined,
  supportedValues: readonly TValue[],
): TValue | undefined {
  if (value !== undefined && supportedValues.includes(value)) {
    return value;
  }

  return undefined;
}
