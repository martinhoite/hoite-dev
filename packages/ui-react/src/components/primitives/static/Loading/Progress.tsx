import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type DataAttributes,
  describeProgressNormalizationWarning,
  type LoadingColor,
  type LoadingSize,
  normalizeProgressValue,
  progressVariants,
} from '@hoite-dev/ui';
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement,
  useEffect,
  useId,
  useMemo,
} from 'react';

type ProgressBaseProps = {
  color?: LoadingColor;
  label?: string;
  max?: number;
  size?: LoadingSize;
  value?: number;
};

export type ProgressProps = ProgressBaseProps &
  DataAttributes &
  Omit<ComponentPropsWithoutRef<'progress'>, 'children' | 'color' | 'max' | 'value'>;

type ProgressVisualStyle = CSSProperties & {
  '--progress-value-percent'?: string;
};

function isPresent(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  return value.trim().length > 0;
}

export function Progress({
  className,
  color,
  id,
  label,
  max,
  size,
  value,
  ...restProps
}: ProgressProps): ReactElement {
  const generatedId = useId();
  const normalized = useMemo(() => normalizeProgressValue({ max, value }), [max, value]);
  const normalizedId = generatedId.replaceAll(':', '');
  const progressId = id ?? (isPresent(label) ? `progress-${normalizedId}` : undefined);
  const ariaHidden = restProps['aria-hidden'];
  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];
  const visualStyle: ProgressVisualStyle = {
    '--progress-value-percent': `${normalized.valuePercent ?? 0}%`,
  };
  const visualClassName = progressVariants({
    className: normalized.isIndeterminate
      ? `${className ?? ''} progress--indeterminate`.trim()
      : className,
    color,
    size,
  });

  useEffect(() => {
    if (ariaHidden === true || ariaHidden === 'true') {
      return;
    }

    if (!isPresent(label)) {
      if (!isPresent(ariaLabel) && !isPresent(ariaLabelledBy)) {
        warnInDevelopment(
          '[Progress] Accessible loading text is missing. Provide `label`, `aria-label`, or `aria-labelledby`, or mark the progress as decorative with `aria-hidden`.',
        );
      }
    }

    for (const warningReason of normalized.warningReasons) {
      warnInDevelopment(`[Progress] ${describeProgressNormalizationWarning(warningReason)}`);
    }
  }, [ariaHidden, ariaLabel, ariaLabelledBy, label, normalized.warningReasons]);

  return (
    <div
      className={color === 'on-fill' ? 'progress-field progress-field--on-fill' : 'progress-field'}
    >
      {isPresent(label) && progressId ? (
        <label className='progress-field__label' htmlFor={progressId}>
          {label}
        </label>
      ) : null}
      <div aria-hidden='true' className={visualClassName} style={visualStyle}>
        <span className='progress__indicator' />
      </div>
      <progress
        {...restProps}
        className='loading-visually-hidden'
        id={progressId}
        max={normalized.max}
        value={normalized.isIndeterminate ? undefined : normalized.value}
      />
    </div>
  );
}
