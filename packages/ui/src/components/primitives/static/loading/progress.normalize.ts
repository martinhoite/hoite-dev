export type ProgressNormalizationWarningReason =
  | 'max-not-finite'
  | 'max-not-positive'
  | 'value-below-min'
  | 'value-not-finite'
  | 'value-over-max';

export type NormalizedProgressValue = {
  isIndeterminate: boolean;
  max: number;
  value: number | undefined;
  valuePercent: number | undefined;
  warningReasons: readonly ProgressNormalizationWarningReason[];
};

export type ProgressNormalizationInput = {
  max?: number;
  value?: number;
};

/**
 * Normalizes numeric input for native <progress> elements.
 *
 * Native semantics:
 * - Omitting `value` creates an indeterminate progress indicator.
 * - `max` defaults to 1 and must be a finite number greater than 0.
 * - Determinate `value` must be finite and within [0, max].
 *
 * This helper enforces those rules by fixing invalid `max`, clamping
 * out-of-range determinate values, and returning warning reasons so wrappers
 * can surface development warnings without diverging behavior.
 */
export function normalizeProgressValue({
  max,
  value,
}: ProgressNormalizationInput): NormalizedProgressValue {
  const warningReasons: ProgressNormalizationWarningReason[] = [];

  let normalizedMax = max ?? 1;

  if (!Number.isFinite(normalizedMax)) {
    normalizedMax = 1;
    warningReasons.push('max-not-finite');
  }

  if (normalizedMax <= 0) {
    normalizedMax = 1;
    warningReasons.push('max-not-positive');
  }

  if (value === undefined) {
    return {
      isIndeterminate: true,
      max: normalizedMax,
      value: undefined,
      valuePercent: undefined,
      warningReasons,
    };
  }

  if (!Number.isFinite(value)) {
    warningReasons.push('value-not-finite');

    return {
      isIndeterminate: true,
      max: normalizedMax,
      value: undefined,
      valuePercent: undefined,
      warningReasons,
    };
  }

  let normalizedValue = value;

  if (normalizedValue < 0) {
    normalizedValue = 0;
    warningReasons.push('value-below-min');
  }

  if (normalizedValue > normalizedMax) {
    normalizedValue = normalizedMax;
    warningReasons.push('value-over-max');
  }

  return {
    isIndeterminate: false,
    max: normalizedMax,
    value: normalizedValue,
    valuePercent: (normalizedValue / normalizedMax) * 100,
    warningReasons,
  };
}

export function describeProgressNormalizationWarning(
  reason: ProgressNormalizationWarningReason,
): string {
  if (reason === 'max-not-finite') {
    return '`max` was not finite. Falling back to 1.';
  }

  if (reason === 'max-not-positive') {
    return '`max` must be greater than 0. Falling back to 1.';
  }

  if (reason === 'value-not-finite') {
    return '`value` was not finite. Rendering indeterminate progress state.';
  }

  if (reason === 'value-below-min') {
    return '`value` was below 0 and was clamped to 0.';
  }

  return '`value` was greater than `max` and was clamped to `max`.';
}
