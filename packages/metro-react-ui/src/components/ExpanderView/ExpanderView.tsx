import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './ExpanderView.css';

/** Inline copies of the Fluent `ChevronRightFilled` / `ChevronDownFilled`
 * glyphs (20x20 viewBox), so the expander isn't dependent on
 * `@fluentui/react-icons`. */
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="metro-expander__chevron-icon"
    >
      {expanded ? (
        <path d="M15.8 7.73c.28.3.27.78-.03 1.06l-5.25 5a.75.75 0 0 1-1.04 0l-5.25-5a.75.75 0 0 1 1.04-1.08L10 12.2l4.73-4.5a.75.75 0 0 1 1.06.02" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      ) : (
        <path d="M7.73 4.2a.75.75 0 0 1 1.06.03l5 5.25c.28.3.28.75 0 1.04l-5 5.25a.75.75 0 1 1-1.08-1.04L12.2 10l-4.5-4.73a.75.75 0 0 1 .02-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

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
  // Keep the content mounted while it animates closed.
  const [closing, setClosing] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const prevExpanded = useRef(false);

  // Drive the content wrapper's height so it animates open (0 → full) and
  // closed (full → 0), mirroring the ListPicker expanded-inflow technique.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (expanded) {
      if (!prevExpanded.current) {
        // Just expanded: animate from 0 up to the full content height. Force a
        // reflow so the transition starts.
        wrap.style.height = '0px';
        void wrap.offsetHeight;
      }
      wrap.style.height = `${wrap.scrollHeight}px`;
    } else if (closing) {
      wrap.style.height = '0px';
    }
    prevExpanded.current = expanded;
  }, [expanded, closing, children]);

  const toggle = () => {
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onExpandedChange?.(next);
    if (next) setClosing(false);
    else setClosing(true);
  };

  return (
    <div
      className="metro-expander"
      data-expanded={expanded}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      <button type="button" className="metro-expander__header" onClick={toggle} aria-expanded={expanded}>
        <span className="metro-expander__chevron">
          <ChevronIcon expanded={expanded} />
        </span>
        <span className="metro-expander__title">{header}</span>
      </button>
      {(expanded || closing) && (
        <div
          ref={wrapRef}
          className="metro-expander__content-wrap"
          data-state={expanded ? 'open' : 'closing'}
          onTransitionEnd={() => {
            if (closing) setClosing(false);
          }}
        >
          <div className="metro-expander__content">{children}</div>
        </div>
      )}
    </div>
  );
}
