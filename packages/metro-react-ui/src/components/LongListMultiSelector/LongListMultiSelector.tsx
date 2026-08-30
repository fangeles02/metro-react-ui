import { useState, type ReactNode } from 'react';
import './LongListMultiSelector.css';

export interface LongListGroup<T> {
  /** Group key (used for the jump list). */
  key: string;
  /** Items in this group. */
  items: T[];
}

export interface LongListMultiSelectorProps<T> {
  /** Grouped items. */
  groups: LongListGroup<T>[];
  /** Function returning the display label for an item. */
  getItemLabel: (item: T) => ReactNode;
  /** Function returning a stable id for an item. */
  getItemId: (item: T) => string;
  /** Currently selected item ids (controlled). */
  value?: string[];
  /** Initial selected ids (uncontrolled). */
  defaultValue?: string[];
  /** Callback when selection changes. */
  onChange?: (selectedIds: string[]) => void;
  /** Header text. */
  header?: ReactNode;
  /** Accent color override. */
  accent?: string;
}

/**
 * Metro-style long list multi-selector. Ported from the WP Toolkit
 * `LongListMultiSelector` (grouped list with a letter jump bar and
 * multi-selection).
 */
export function LongListMultiSelector<T>({
  groups,
  getItemLabel,
  getItemId,
  value: valueProp,
  defaultValue = [],
  onChange,
  header,
  accent,
}: LongListMultiSelectorProps<T>) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((x) => x !== id)
      : [...value, id];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const jumpTo = (key: string) => {
    const el = document.getElementById(`metro-llms-${key}`);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="metro-llms"
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {header != null && <div className="metro-llms__header">{header}</div>}
      <div className="metro-llms__body">
        <div className="metro-llms__list">
          {groups.map((group) => (
            <div key={group.key} id={`metro-llms-${group.key}`} className="metro-llms__group">
              <div className="metro-llms__group-key">{group.key}</div>
              {group.items.map((item) => {
                const id = getItemId(item);
                const selected = value.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className="metro-llms__item"
                    data-selected={selected}
                    onClick={() => toggle(id)}
                    aria-pressed={selected}
                  >
                    <span className="metro-llms__checkbox">
                      {selected && <span className="metro-llms__check">✓</span>}
                    </span>
                    <span className="metro-llms__label">{getItemLabel(item)}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="metro-llms__jumpbar">
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              className="metro-llms__jump"
              onClick={() => jumpTo(group.key)}
            >
              {group.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
