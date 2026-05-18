import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  circularProgressVariants,
  describeProgressNormalizationWarning,
  type LoadingColor,
  type LoadingSize,
  normalizeProgressValue,
} from '@hoite-dev/ui';
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement,
  useEffect,
  useId,
  useMemo,
} from 'react';

import type { DataAttributes } from '../../../../types/dom';

type CircularProgressBaseProps = {
  color?: LoadingColor;
  labelClassName?: string;
  label?: string;
  max?: number;
  valueDisplay?: 'fraction' | 'percent';
  valueClassName?: string;
  valueLabel?: string;
  showValue?: boolean;
  size?: LoadingSize;
  value?: number;
};

type CircularProgressStyle = CSSProperties & {
  '--circular-progress-circumference'?: string;
  '--circular-progress-offset'?: string;
};

const radius = 18;
const circumference = 2 * Math.PI * radius;

export type CircularProgressProps = CircularProgressBaseProps &
  DataAttributes &
  Omit<ComponentPropsWithoutRef<'progress'>, 'children' | 'color' | 'max' | 'value'>;

function isPresent(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  return value.trim().length > 0;
}

export function CircularProgress({
  className,
  color,
  id,
  labelClassName,
  label,
  max,
  showValue = true,
  size,
  valueClassName,
  valueDisplay = 'percent',
  valueLabel,
  value,
  ...restProps
}: CircularProgressProps): ReactElement {
  const generatedId = useId();
  const normalized = useMemo(() => normalizeProgressValue({ max, value }), [max, value]);
  const normalizedId = generatedId.replaceAll(':', '');
  const progressId = id ?? (isPresent(label) ? `circular-progress-${normalizedId}` : undefined);
  const valuePercent = normalized.valuePercent;
  const resolvedValuePercent = valuePercent ?? 0;
  const resolvedValue = normalized.value ?? 0;
  const roundedPercent = Math.round(resolvedValuePercent);
  const roundedValue = Math.round(resolvedValue);
  const roundedMax = Math.round(normalized.max);
  const ariaHidden = restProps['aria-hidden'];
  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];

  const indicatorStyle: CircularProgressStyle = {
    '--circular-progress-circumference': `${circumference}`,
    '--circular-progress-offset': `${circumference * (1 - resolvedValuePercent / 100)}`,
  };

  const resolvedValueText =
    valueLabel !== undefined && valueLabel.trim().length > 0
      ? valueLabel
      : valueDisplay === 'fraction'
        ? `${roundedValue}/${roundedMax}`
        : `${roundedPercent}%`;
  const isFractionValueDisplay = valueDisplay === 'fraction';

  useEffect(() => {
    if (ariaHidden === true || ariaHidden === 'true') {
      return;
    }

    if (!isPresent(label)) {
      if (!isPresent(ariaLabel) && !isPresent(ariaLabelledBy)) {
        warnInDevelopment(
          '[CircularProgress] Accessible loading text is missing. Provide `label`, `aria-label`, or `aria-labelledby`, or mark the progress as decorative with `aria-hidden`.',
        );
      }
    }

    for (const warningReason of normalized.warningReasons) {
      warnInDevelopment(
        `[CircularProgress] ${describeProgressNormalizationWarning(warningReason)}`,
      );
    }

    if (normalized.isIndeterminate) {
      warnInDevelopment(
        '[CircularProgress] Indeterminate state is no longer supported. Falling back to 0%.',
      );
    }
  }, [
    ariaHidden,
    ariaLabel,
    ariaLabelledBy,
    label,
    normalized.isIndeterminate,
    normalized.warningReasons,
  ]);

  return (
    <div
      className={color === 'on-fill' ? 'progress-field progress-field--on-fill' : 'progress-field'}
    >
      <div className='circular-progress-field'>
        <div className={circularProgressVariants({ className, color, size })}>
          <svg aria-hidden='true' className='circular-progress__svg' viewBox='0 0 40 40'>
            <circle className='circular-progress__track' cx='20' cy='20' r={radius} />
            <circle
              className='circular-progress__indicator'
              cx='20'
              cy='20'
              r={radius}
              style={indicatorStyle}
            />
          </svg>
          {showValue ? (
            <span
              className={[
                'circular-progress__value',
                isFractionValueDisplay ? 'circular-progress__value--fraction' : undefined,
                valueClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {resolvedValueText}
            </span>
          ) : null}
          <progress
            {...restProps}
            className='loading-visually-hidden'
            id={progressId}
            max={normalized.max}
            value={resolvedValue}
          />
        </div>
        {isPresent(label) && progressId ? (
          <label
            className={['progress-field__label', 'circular-progress-field__label', labelClassName]
              .filter(Boolean)
              .join(' ')}
            htmlFor={progressId}
          >
            {label}
          </label>
        ) : null}
      </div>
    </div>
  );
}
