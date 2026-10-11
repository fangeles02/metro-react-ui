import type { ReactNode } from 'react';
import './MetroLayoutBody.css';

export interface MetroLayoutBodyProps {
  /** Body content. */
  children?: ReactNode;
}

/**
 * MetroLayoutBody — a body container for use inside a `MetroLayout`. It adds
 * left/right padding that aligns with the `MetroLayout` header, so content is
 * not flush against the viewport edges.
 */
export function MetroLayoutBody({ children }: MetroLayoutBodyProps) {
  return <div className="metro-layout-body">{children}</div>;
}