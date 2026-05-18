import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type IconButtonSize,
  type IconButtonVariant,
  type IconName,
  type IconSize,
  type IconVariant,
  iconButtonVariants,
  type LoadingSize,
} from '@hoite-dev/ui';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { useEffect } from 'react';

import { Icon } from '../../static/Icon';
import { Loader } from '../../static/Loading';

type IconButtonBaseProps = {
  icon: IconName;
  isLoading?: boolean;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

type IconButtonAccessibleNameProps =
  | {
      'aria-label': string;
      'aria-labelledby'?: string;
    }
  | {
      'aria-label'?: string;
      'aria-labelledby': string;
    };

export type IconButtonProps = IconButtonBaseProps &
  IconButtonAccessibleNameProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'aria-label' | 'aria-labelledby' | 'children'>;

function isPresent(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  return value.trim().length > 0;
}

function resolveIconVariant(
  variant: IconButtonVariant | undefined,
  isDisabled: boolean,
): IconVariant {
  if (isDisabled) {
    return 'disabled';
  }

  if (variant === 'secondary') {
    return 'primary';
  }

  return 'on-fill';
}

function resolveIconSize(size: IconButtonSize | undefined): IconSize {
  if (size === 'small') {
    return 'sm';
  }

  if (size === 'large') {
    return 'lg';
  }

  return 'md';
}

function resolveLoaderSize(size: IconButtonSize | undefined): LoadingSize {
  if (size === 'small') {
    return 'small';
  }

  return 'medium';
}

export function IconButton({
  className,
  disabled = false,
  icon,
  isLoading = false,
  size,
  type = 'button',
  variant,
  ...restProps
}: IconButtonProps): ReactElement {
  const isButtonDisabled = disabled || isLoading;
  const iconSize = resolveIconSize(size);
  const iconVariant = resolveIconVariant(variant, isButtonDisabled);
  const loaderSize = resolveLoaderSize(size);
  const loaderColor = isButtonDisabled || variant === 'secondary' ? 'secondary' : 'on-fill';
  const ariaLabel = restProps['aria-label'];
  const ariaLabelledBy = restProps['aria-labelledby'];

  useEffect(() => {
    if (isPresent(ariaLabel) || isPresent(ariaLabelledBy)) {
      return;
    }

    warnInDevelopment(
      '[IconButton] Accessible name is missing. Provide `aria-label` or `aria-labelledby` for icon-only actions.',
    );
  }, [ariaLabel, ariaLabelledBy]);

  return (
    <button
      {...restProps}
      aria-busy={isLoading ? true : restProps['aria-busy']}
      className={iconButtonVariants({ className, size, variant })}
      disabled={isButtonDisabled}
      type={type}
    >
      {isLoading ? (
        <Loader
          aria-hidden='true'
          className='icon-button__loader'
          color={loaderColor}
          size={loaderSize}
        />
      ) : (
        <Icon
          aria-hidden='true'
          className='icon-button__visual'
          name={icon}
          size={iconSize}
          variant={iconVariant}
        />
      )}
    </button>
  );
}
