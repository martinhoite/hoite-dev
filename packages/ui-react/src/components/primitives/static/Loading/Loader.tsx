import { warnInDevelopment } from '@hoite-dev/diagnostics';
import { type LoadingColor, type LoadingSize, loaderVariants } from '@hoite-dev/ui';
import { type ComponentPropsWithoutRef, type ReactElement, useEffect } from 'react';

type LoaderBaseProps = {
  color?: LoadingColor;
  size?: LoadingSize;
};

export type LoaderProps = LoaderBaseProps & Omit<ComponentPropsWithoutRef<'span'>, 'color'>;

function isPresent(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  return value.trim().length > 0;
}

export function Loader({ className, color, size, ...restProps }: LoaderProps): ReactElement {
  const ariaHidden = restProps['aria-hidden'];
  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];

  useEffect(() => {
    if (ariaHidden === true || ariaHidden === 'true') {
      return;
    }

    if (!isPresent(ariaLabel) && !isPresent(ariaLabelledBy)) {
      warnInDevelopment(
        '[Loader] Accessible loading text is missing. Provide `aria-label` or `aria-labelledby`, or mark the loader as decorative with `aria-hidden`.',
      );
    }
  }, [ariaHidden, ariaLabel, ariaLabelledBy]);

  return (
    <span
      {...restProps}
      className={loaderVariants({ className, color, size })}
      role={restProps.role ?? 'status'}
    />
  );
}
