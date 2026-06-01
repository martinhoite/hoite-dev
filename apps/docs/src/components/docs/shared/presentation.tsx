import type { ReactNode } from 'react';

export function TokenCode({ children, className }: { children: ReactNode; className?: string }) {
  return <code className={`token-code${className ? ` ${className}` : ''}`}>{children}</code>;
}
