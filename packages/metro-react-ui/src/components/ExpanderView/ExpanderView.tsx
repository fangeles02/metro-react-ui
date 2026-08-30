import { useState, type ReactNode } from 'react';
import './ExpanderView.css';

export interface ExpanderViewProps {
  /** Header content shown in the collapsed bar. */
  header?: ReactNode;
  /** Content revealed when expanded. */
  children?: ReactNode;
  /** Whether the view starts expanded. */
  defaultExpanded?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Callback when expanded state changes. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Accent color override. */
  accent?: string;
}

/**
 * Metro-style expander view. Ported from the WP Toolkit `ExpanderView`
 * (tap header to expand/collapse content).
 */
export function ExpanderView({
  header,
  children,
  defaultExpanded = false,
  expanded: expandedProp,
  onExpandedChange,
  accent,
}: ExpanderViewProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : internalExpanded;

  const toggle = () => {
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <div
      className="metro-expander"
      data-expanded={expanded}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      <button type="button" className="metro-expander__header" onClick={toggle} aria-expanded={expanded}>
        <span className="metro-expander__chevron">▸</span>
        <span className="metro-expander__title">{header}</span>
      </button>
      {expanded && <div className="metro-expander__content">{children}</div>}
    </div>
  );
}
