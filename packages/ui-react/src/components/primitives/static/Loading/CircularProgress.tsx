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
  const roundedPercent = valuePercent === undefined ? undefined : Math.round(valuePercent);
  const roundedValue = normalized.value === undefined ? undefined : Math.round(normalized.value);
  const roundedMax = Math.round(normalized.max);
  const ariaHidden = restProps['aria-hidden'];
  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];

  const indicatorClassName =
    normalized.isIndeterminate || valuePercent === undefined
      ? 'circular-progress__indicator circular-progress__indicator--indeterminate'
      : 'circular-progress__indicator';

  const indicatorStyle: CircularProgressStyle = {
    '--circular-progress-circumference': `${circumference}`,
    '--circular-progress-offset':
      valuePercent === undefined
        ? `${circumference}`
        : `${circumference * (1 - valuePercent / 100)}`,
  };

  const resolvedValueText =
    valueLabel !== undefined && valueLabel.trim().length > 0
      ? valueLabel
      : roundedPercent === undefined
        ? '...'
        : valueDisplay === 'fraction'
          ? `${roundedValue}/${roundedMax}`
          : `${roundedPercent}%`;

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
  }, [ariaHidden, ariaLabel, ariaLabelledBy, label, normalized.warningReasons]);

  return (
    <div
      className={color === 'on-fill' ? 'progress-field progress-field--on-fill' : 'progress-field'}
    >
      <div className='circular-progress-field'>
        <div className={circularProgressVariants({ className, color, size })}>
          <svg aria-hidden='true' className='circular-progress__svg' viewBox='0 0 40 40'>
            <circle className='circular-progress__track' cx='20' cy='20' r={radius} />
            <circle
              className={indicatorClassName}
              cx='20'
              cy='20'
              r={radius}
              style={indicatorStyle}
            />
          </svg>
          {showValue ? (
            <span
              className={['circular-progress__value', valueClassName].filter(Boolean).join(' ')}
            >
              {resolvedValueText}
            </span>
          ) : null}
          <progress
            {...restProps}
            className='loading-visually-hidden'
            id={progressId}
            max={normalized.max}
            value={normalized.isIndeterminate ? undefined : normalized.value}
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
