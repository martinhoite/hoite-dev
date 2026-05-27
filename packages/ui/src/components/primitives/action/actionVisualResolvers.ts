import type { IconSize, IconVariant } from '../static/icon';
import type { LoadingColor, LoadingSize } from '../static/loading';
import type { ButtonSize, ButtonVariant } from './button';
import type { IconButtonSize, IconButtonVariant } from './icon-button';

type ActionVisualSize = ButtonSize | IconButtonSize | undefined;
type ActionVisualVariant = ButtonVariant | IconButtonVariant | undefined;

export function resolveActionIconVariant(
  variant: ActionVisualVariant,
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

export function resolveActionIconSize(size: ActionVisualSize): IconSize {
  if (size === 'small') {
    return 'sm';
  }

  if (size === 'large') {
    return 'lg';
  }

  return 'md';
}

export function resolveActionLoaderColor(
  variant: ActionVisualVariant,
  isDisabled: boolean,
): LoadingColor {
  if (isDisabled || variant === 'secondary') {
    return 'secondary';
  }

  return 'on-fill';
}

export function resolveActionLoaderSize(size: ActionVisualSize): LoadingSize {
  if (size === 'small') {
    return 'small';
  }

  return 'medium';
}
