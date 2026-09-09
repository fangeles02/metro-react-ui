import { useState, type ReactNode } from 'react';
import './MultiselectList.css';

/** Inline copy of the Fluent `CheckmarkFilled` glyph (20x20 viewBox), so the
 * list isn't dependent on `@fluentui/react-icons`. A same-colored stroke is
 * layered on top to give it a thicker, WP8-style weight. */
function CheckmarkIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="metro-multiselect__check-icon"
    >
      <path
        d="M7.03 13.9 3.56 10a.75.75 0 0 0-1.12 1l4 4.5c.29.32.79.34 1.09.03l10.5-10.5a.75.75 0 0 0-1.06-1.06z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export interface MultiselectListItem<T> {
  value: T;
  label: ReactNode;
}

export interface MultiselectListProps<T> {
  /** Items to display. */
  items: MultiselectListItem<T>[];
  /** Currently selected values (controlled). */
  value?: T[];
  /** Initial selected values (uncontrolled). */
  defaultValue?: T[];
  /** Callback when the selection changes. */
  onChange?: (selected: T[]) => void;
  /** Header text. */
  header?: ReactNode;
  /** Accent color override. */
  accent?: string;
}

/**
 * Metro-style multi-select list. Ported from the WP Toolkit
 * `MultiselectList` (checkbox-style list with selection).
 */
export function MultiselectList<T>({
  items,
  value: valueProp,
  defaultValue = [],
  onChange,
  header,
  accent,
}: MultiselectListProps<T>) {
  const [internalValue, setInternalValue] = useState<T[]>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const toggle = (v: T) => {
    const next = value.includes(v)
      ? value.filter((x) => x !== v)
      : [...value, v];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div
      className="metro-multiselect"
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {header != null && <div className="metro-multiselect__header">{header}</div>}
      <ul className="metro-multiselect__list">
        {items.map((item, i) => {
          const selected = value.includes(item.value);
          return (
            <li key={i}>
              <button
                type="button"
                className="metro-multiselect__item"
                data-selected={selected}
                onClick={() => toggle(item.value)}
                aria-pressed={selected}
              >
                <span className="metro-multiselect__checkbox">
                  {selected && (
                    <span className="metro-multiselect__check">
                      <CheckmarkIcon />
                    </span>
                  )}
                </span>
                <span className="metro-multiselect__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
