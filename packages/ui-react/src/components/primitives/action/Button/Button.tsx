import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
  type IconName,
  type IconSize,
  type IconVariant,
  type LoadingSize,
} from '@hoite-dev/ui';
import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '../../static/Icon';
import { Loader } from '../../static/Loading';

type ButtonBaseProps = {
  isLoading?: boolean;
  leadingIcon?: IconName;
  loadingLabel?: string;
  preventLoadingShrink?: boolean;
  size?: ButtonSize;
  trailingIcon?: IconName;
  variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps & ComponentPropsWithoutRef<'button'>;

function isPresent(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  return value.trim().length > 0;
}

function hasVisibleContent(children: ReactNode, loadingLabel: string | undefined): boolean {
  if (isPresent(loadingLabel)) {
    return true;
  }

  return Children.toArray(children).some((child) => {
    if (child === null || child === undefined || typeof child === 'boolean') {
      return false;
    }

    if (typeof child === 'string') {
      return child.trim().length > 0;
    }

    return true;
  });
}

function resolveLoaderColor(variant: ButtonVariant | undefined, isDisabled: boolean) {
  if (isDisabled || variant === 'secondary') {
    return 'secondary';
  }

  return 'on-fill';
}

function resolveIconVariant(variant: ButtonVariant | undefined, isDisabled: boolean): IconVariant {
  if (isDisabled) {
    return 'disabled';
  }

  if (variant === 'secondary') {
    return 'primary';
  }

  return 'on-fill';
}

function resolveIconSize(size: ButtonSize | undefined): IconSize {
  if (size === 'small') {
    return 'sm';
  }

  if (size === 'large') {
    return 'lg';
  }

  return 'md';
}

function resolveLoaderSize(size: ButtonSize | undefined): LoadingSize {
  if (size === 'small') {
    return 'small';
  }

  return 'medium';
}

export function Button({
  children,
  className,
  disabled = false,
  isLoading = false,
  leadingIcon,
  loadingLabel,
  preventLoadingShrink = false,
  size,
  trailingIcon,
  type = 'button',
  variant,
  ...restProps
}: ButtonProps): ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [preservedWidth, setPreservedWidth] = useState<number | undefined>(undefined);
  const isButtonDisabled = disabled || isLoading;
  const visibleContent = isLoading && isPresent(loadingLabel) ? loadingLabel : children;
  const hasContent = hasVisibleContent(visibleContent, undefined);
  const shouldShowLeadingLoader =
    isLoading && (leadingIcon !== undefined || (!trailingIcon && hasContent));
  const shouldShowTrailingLoader =
    isLoading && leadingIcon === undefined && trailingIcon !== undefined;
  const loaderColor = resolveLoaderColor(variant, isButtonDisabled);
  const loaderSize = resolveLoaderSize(size);
  const iconSize = resolveIconSize(size);
  const iconVariant = resolveIconVariant(variant, isButtonDisabled);
  const buttonStyle =
    preventLoadingShrink && isLoading && preservedWidth !== undefined
      ? { ...restProps.style, minWidth: `${preservedWidth}px` }
      : restProps.style;

  useLayoutEffect(() => {
    if (!preventLoadingShrink || isLoading) {
      return;
    }

    const button = buttonRef.current;

    if (button === null) {
      return;
    }

    const nextWidth = button.getBoundingClientRect().width;

    setPreservedWidth((currentWidth) => {
      if (currentWidth === nextWidth) {
        return currentWidth;
      }

      return nextWidth;
    });
  });

  useEffect(() => {
    if (hasContent) {
      return;
    }

    warnInDevelopment(
      '[Button] Visible button text is missing. Use Button with visible content, or use IconButton for icon-only actions.',
    );
  }, [hasContent]);

  return (
    <button
      {...restProps}
      aria-busy={isLoading ? true : restProps['aria-busy']}
      className={buttonVariants({ className, size, variant })}
      disabled={isButtonDisabled}
      ref={buttonRef}
      style={buttonStyle}
      type={type}
    >
      {shouldShowLeadingLoader ? (
        <Loader
          aria-hidden='true'
          className='button__leading-visual button__loader'
          color={loaderColor}
          size={loaderSize}
        />
      ) : null}
      {!shouldShowLeadingLoader && leadingIcon !== undefined ? (
        <Icon
          className='button__leading-visual'
          name={leadingIcon}
          size={iconSize}
          variant={iconVariant}
        />
      ) : null}
      {hasContent ? <span className='button__content'>{visibleContent}</span> : null}
      {shouldShowTrailingLoader ? (
        <Loader
          aria-hidden='true'
          className='button__trailing-visual button__loader'
          color={loaderColor}
          size={loaderSize}
        />
      ) : null}
      {!shouldShowTrailingLoader && trailingIcon !== undefined ? (
        <Icon
          className='button__trailing-visual'
          name={trailingIcon}
          size={iconSize}
          variant={iconVariant}
        />
      ) : null}
    </button>
  );
}
