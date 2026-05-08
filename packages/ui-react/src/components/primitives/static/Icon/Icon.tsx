import {
  type IconName,
  type IconRotation,
  type IconSize,
  type IconVariant,
  iconVariants,
  resolveIconDefinition,
} from '@hoite-dev/ui';
import type { AriaRole, ReactElement } from 'react';

import type { DataAttributes } from '../../../../types/dom';

type IconBaseProps = {
  className?: string;
  id?: string;
  label?: string;
  name: IconName;
  rotation?: IconRotation;
  role?: AriaRole;
  size?: IconSize;
  title?: string;
  variant?: IconVariant;
  'aria-label'?: string;
} & DataAttributes;

export type IconProps = IconBaseProps;

export function Icon({
  className,
  id,
  label,
  name,
  rotation,
  role,
  size,
  title,
  variant,
  'aria-label': ariaLabel,
  ...restProps
}: IconProps): ReactElement {
  const definition = resolveIconDefinition(name);
  const accessibleLabel = label ?? ariaLabel;
  const isDecorative = accessibleLabel === undefined || accessibleLabel.length === 0;

  return (
    <svg
      {...restProps}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={isDecorative ? undefined : accessibleLabel}
      className={iconVariants({
        className,
        rotation,
        size,
        variant,
      })}
      focusable={false}
      id={id}
      role={isDecorative ? undefined : (role ?? 'img')}
      viewBox={definition.viewBox}
      xmlns='http://www.w3.org/2000/svg'
    >
      {title ? <title>{title}</title> : null}
      {definition.paths.map((path) => (
        <path
          d={path}
          fill='none'
          key={`${definition.name}-${path}`}
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}
