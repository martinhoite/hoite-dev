import { warnInDevelopment } from '@hoite-dev/diagnostics';
import { type LinkAppearance, linkVariants } from '@hoite-dev/ui';
import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  useEffect,
} from 'react';

type LinkBaseProps = {
  appearance?: LinkAppearance;
  children: ReactNode;
  href: string;
};

export type LinkProps = LinkBaseProps & Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href'>;

function hasVisibleContent(children: ReactNode): boolean {
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

export function Link({
  appearance,
  children,
  className,
  href,
  ...restProps
}: LinkProps): ReactElement {
  const hasContent = hasVisibleContent(children);

  useEffect(() => {
    if (hasContent) {
      return;
    }

    warnInDevelopment('[Link] Visible link text is missing. Use Link with visible content.');
  }, [hasContent]);

  return (
    <a {...restProps} className={linkVariants({ appearance, className })} href={href}>
      {children}
    </a>
  );
}
