import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import './AutoCompleteBox.css';

export type AutoCompleteFilterMode = 'none' | 'startsWith' | 'contains' | 'equals';

export interface AutoCompleteBoxProps<T> {
  /** Items to filter. */
  items: T[];
  /** Function returning the display string for an item. */
  getItemText: (item: T) => string;
  /** Filter mode. Defaults to `startsWith`. */
  filterMode?: AutoCompleteFilterMode;
  /** Currently selected item (controlled). */
  value?: T | null;
  /** Initial selected item (uncontrolled). */
  defaultValue?: T | null;
  /** Callback when an item is selected. */
  onSelectionChanged?: (item: T | null) => void;
  /** Callback when the text changes. */
  onTextChanged?: (text: string) => void;
  /** Placeholder/hint text. */
  hint?: string;
  /** Header text. */
  header?: string;
  /** Disables the control. */
  disabled?: boolean;
  /** Accent color override. */
  accent?: string;
  /** Accessible label. */
  'aria-label'?: string;
}

function matches(text: string, query: string, mode: AutoCompleteFilterMode): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  switch (mode) {
    case 'none':
      return true;
    case 'startsWith':
      return t.startsWith(q);
    case 'contains':
      return t.includes(q);
    case 'equals':
      return t === q;
    default:
      return t.startsWith(q);
  }
}

/**
 * Metro-style autocomplete text box. Ported from the WP Toolkit
 * `AutoCompleteBox` (text filtering + suggestion dropdown).
 */
export function AutoCompleteBox<T>({
  items,
  getItemText,
  filterMode = 'startsWith',
  value: valueProp,
  defaultValue = null,
  onSelectionChanged,
  onTextChanged,
  hint,
  header,
  disabled = false,
  accent,
  'aria-label': ariaLabel,
}: AutoCompleteBoxProps<T>) {
  const [text, setText] = useState(
    valueProp ? getItemText(valueProp) : defaultValue ? getItemText(defaultValue) : '',
  );
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const isControlled = valueProp !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef(false);
  // Preserve the last non-empty suggestions so the menu can collapse with its
  // content still visible even after the filter leaves no matches.
  const lastSuggestions = useRef<T[]>([]);

  const suggestions = useMemo(() => {
    if (!text) return items;
    return items.filter((item) => matches(getItemText(item), text, filterMode));
  }, [items, text, getItemText, filterMode]);

  if (suggestions.length > 0) lastSuggestions.current = suggestions;

  // Keep the menu mounted while it is animating closed so the collapse
  // transition can play out before it is removed from the tree.
  const showMenu = open || closing;
  const rendered = closing ? lastSuggestions.current : suggestions;

  // Drive the wrapper height: animate from 0 to the measured list height when
  // opening, to the new measured height as the item count changes, and back to
  // 0 when closing.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const menu = menuRef.current;
    if (!wrap || !menu) return;

    if (open) {
      if (!prevOpen.current) {
        // Just opened: animate from 0 to the measured height.
        wrap.style.height = '0px';
        void wrap.offsetHeight; // force a reflow so the transition starts
        wrap.style.height = `${menu.offsetHeight}px`;
      } else {
        // Item count changed while open: animate to the new measured height.
        wrap.style.height = `${menu.offsetHeight}px`;
      }
    } else if (closing) {
      wrap.style.height = '0px';
    }
    prevOpen.current = open;
  }, [open, closing, suggestions, showMenu]);

  // If the filter leaves no matches while open, collapse the menu.
  useLayoutEffect(() => {
    if (open && suggestions.length === 0) {
      setClosing(true);
      setOpen(false);
    }
  }, [open, suggestions.length]);

  const openMenu = () => {
    setClosing(false);
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
    setClosing(true);
  };

  const select = (item: T) => {
    const t = getItemText(item);
    setText(t);
    closeMenu();
    if (!isControlled) {
      // uncontrolled: keep text as source of truth
    }
    onSelectionChanged?.(item);
  };

  const handleTextChange = (t: string) => {
    setText(t);
    openMenu();
    setHighlighted(0);
    onTextChanged?.(t);
    if (!isControlled) onSelectionChanged?.(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[highlighted]) select(suggestions[highlighted]);
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  };

  return (
    <div
      className="metro-autocomplete"
      data-disabled={disabled}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {header != null && <label className="metro-autocomplete__header">{header}</label>}
      <div className="metro-autocomplete__field">
        <input
          ref={inputRef}
          className="metro-autocomplete__input"
          type="text"
          value={text}
          disabled={disabled}
          placeholder={hint}
          onChange={(e) => handleTextChange(e.target.value)}
          onFocus={openMenu}
          onBlur={() => setTimeout(closeMenu, 150)}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {showMenu && (
          <div
            ref={wrapRef}
            className="metro-autocomplete__menu-wrap"
            data-state={open ? 'open' : 'closing'}
            onTransitionEnd={() => {
              if (closing) setClosing(false);
            }}
          >
            <ul ref={menuRef} className="metro-autocomplete__menu" role="listbox">
              {rendered.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlighted}
                    className="metro-autocomplete__option"
                    data-highlighted={i === highlighted}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      select(item);
                    }}
                  >
                    {getItemText(item)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
