import type { ReactNode } from 'react';

export function DocSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className='docs-section-heading'>{children}</h2>;
}

export function DocSubsectionHeading({ children }: { children: ReactNode }) {
  return <h3 className='docs-section-subheading'>{children}</h3>;
}
