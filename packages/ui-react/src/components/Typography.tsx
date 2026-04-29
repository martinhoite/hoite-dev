import {
  resolveTypographyDefaultTag,
  type TypographyTag,
  type TypographyVariant,
  typographyVariants,
} from '@hoite-dev/ui';
import type { AriaAttributes, AriaRole, PropsWithChildren, ReactElement } from 'react';
import type { DataAttributes } from '../types/dom';

type TypographyBaseProps = {
  tag?: TypographyTag;
  className?: string;
  id?: string;
  role?: AriaRole;
  title?: string;
  variant: TypographyVariant;
} & AriaAttributes &
  DataAttributes;

export type TypographyProps = PropsWithChildren<TypographyBaseProps>;

export function Typography({
  tag,
  children,
  className,
  id,
  role,
  title,
  variant,
  ...restProps
}: TypographyProps): ReactElement {
  const Component = tag ?? resolveTypographyDefaultTag(variant);

  return (
    <Component
      {...restProps}
      className={typographyVariants({
        className,
        variant,
      })}
      id={id}
      role={role}
      title={title}
    >
      {children}
    </Component>
  );
}
