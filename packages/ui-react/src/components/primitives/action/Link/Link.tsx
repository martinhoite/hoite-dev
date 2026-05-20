import { warnInDevelopment } from '@hoite-dev/diagnostics';
import {
  type LinkAppearance,
  type LinkRel,
  type LinkTarget,
  linkVariants,
  resolveLinkRel,
} from '@hoite-dev/ui';
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
  rel?: LinkRel;
  target?: LinkTarget;
};

export type LinkProps = LinkBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href' | 'rel' | 'target'>;

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
  rel,
  target,
  ...restProps
}: LinkProps): ReactElement {
  const hasContent = hasVisibleContent(children);
  const resolvedRel = resolveLinkRel(target, rel);

  useEffect(() => {
    if (hasContent) {
      return;
    }

    warnInDevelopment('[Link] Visible link text is missing. Use Link with visible content.');
  }, [hasContent]);

  return (
    <a
      {...restProps}
      className={linkVariants({ appearance, className })}
      href={href}
      rel={resolvedRel}
      target={target}
    >
      {children}
    </a>
  );
}
