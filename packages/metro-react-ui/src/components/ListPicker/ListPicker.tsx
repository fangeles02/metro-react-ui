import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import './ListPicker.css';

export type ListPickerMode = 'normal' | 'expanded';

export interface ListPickerItem<T> {
  value: T;
  label: ReactNode;
}

export interface ListPickerProps<T> {
  /** Items to pick from. */
  items: ListPickerItem<T>[];
  /** Currently selected value (controlled). */
  value?: T;
  /** Initial selected value (uncontrolled). */
  defaultValue?: T;
  /** Callback when selection changes. */
  onChange?: (value: T) => void;
  /** Header text shown above the picker. */
  header?: ReactNode;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Display mode. `normal` = inline dropdown, `expanded` = in-flow expanded
   * list (WP8 style, grows in place). */
  mode?: 'normal' | 'expanded';
  /** Maximum number of items visible in the open list before it scrolls.
   * Defaults to 5. */
  maxItemsVisible?: number;
  /** Disables the picker. */
  disabled?: boolean;
  /** Accent color override. */
  accent?: string;
  /** Accessible label. */
  'aria-label'?: string;
}

/**
 * Metro-style list picker. Ported from the WP Toolkit `ListPicker`
 * (normal inline dropdown + in-flow expanded list).
 */
export function ListPicker<T>({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  header,
  placeholder = 'tap to select',
  mode = 'normal',
  maxItemsVisible = 5,
  disabled = false,
  accent,
  'aria-label': ariaLabel,
}: ListPickerProps<T>) {
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const selected = items.find((i) => i.value === value);
  const selectedIndex = selected ? items.indexOf(selected) : -1;
  const menuRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const valueRowRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // The `.normal` container is the positioning anchor for the overlay menu.
  const normalRef = useRef<HTMLDivElement>(null);
  // Used to lock the expanded container to the trigger's width (the trigger is
  // hidden while open, so the width can't be measured from it then).
  const expandedRef = useRef<HTMLDivElement>(null);
  // Height of the collapsed value row, captured before it gets hidden while
  // expanded so the expand animation can grow from it.
  const collapsedRowHeight = useRef(0);

  // Keep the inline menu mounted while it animates closed.
  const showMenu = open || closing;

  // `expanded` mode renders the in-flow expanded list whenever requested.
  const effectiveMode = mode === 'expanded' && items.length > 0 ? 'expanded' : 'normal';

  // For the in-flow expanded mode we drive an expander height: the selected
  // item's row when collapsed, the full list height when expanded. The list
  // stays mounted and is clipped (overflow hidden), mirroring WP8's clip +
  // translate approach.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const row = valueRowRef.current;
    const menu = menuRef.current;
    const expanded = expandedRef.current;
    if (effectiveMode !== 'expanded' || !wrap) return;

    // Keep the container locked to the trigger's width so the expanded list
    // matches the trigger. The trigger is hidden (display:none) while open, so
    // measure it whenever it is visible (collapsed).
    if (expanded && row && !open) {
      expanded.style.width = `${row.offsetWidth}px`;
      collapsedRowHeight.current = row.offsetHeight;
    }

    if (open) {
      if (menu) {
        // Cap the expanded height to `maxItemsVisible` options (scrollable).
        // Include the list's vertical padding so `maxItemsVisible` full items
        // fit (otherwise the last is cut off).
        const firstOption = menu.querySelector('.metro-listpicker__option');
        const itemHeight = firstOption ? firstOption.getBoundingClientRect().height : 41;
        const cs = getComputedStyle(menu);
        const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        // With `box-sizing: border-box` the max-height box includes borders, so
        // the content area is maxHeight − borders. To fit `maxItemsVisible`
        // full items, add padding AND border to the item total.
        const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        const maxListHeight = Math.max(1, maxItemsVisible) * itemHeight + paddingY + borderY;
        menu.style.maxHeight = `${maxListHeight}px`;
        menu.style.overflowY = 'auto';

        // Center the selected item in the visible viewport so exactly
        // `maxItemsVisible` full items show around it (and reopening keeps its
        // position). Using screen-coordinate deltas avoids offsetParent issues.
        if (selectedIndex >= 0) {
          const selectedEl = menu.children[selectedIndex] as HTMLElement | undefined;
          if (selectedEl) {
            const listRect = menu.getBoundingClientRect();
            const selRect = selectedEl.getBoundingClientRect();
            const target = selRect.top - listRect.top - (menu.clientHeight - itemHeight) / 2;
            menu.scrollTop += target;
          }
        }

        if (!prevOpen.current) {
          // Just opened: animate from the last captured collapsed (value-row)
          // height up to the (capped) list height. Force a reflow so the
          // transition starts.
          wrap.style.height = `${collapsedRowHeight.current || wrap.offsetHeight}px`;
          void wrap.offsetHeight;
        }
        // While open the trigger is hidden, so the wrapper only needs to fit
        // the (capped) list. Use scrollHeight (full content) so a clipped
        // list still expands to its full capped height.
        wrap.style.height = `${Math.min(menu.scrollHeight, maxListHeight)}px`;
      }
    } else {
      // Collapse back to the single value row's height.
      const rowHeight = row ? `${row.offsetHeight}px` : '0px';
      wrap.style.height = rowHeight;
    }
    prevOpen.current = open;
  }, [open, closing, items, effectiveMode, maxItemsVisible]);

  // For the normal (overlay dropdown) mode we drive the menu wrapper height:
  // animate from 0 to the measured list height when opening, and back to 0
  // when closing. While open we also align the menu so the selected item sits
  // against the (hidden) trigger's position: top/mid/bottom depending on where
  // in the list the selected item is.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const menu = menuRef.current;
    const normal = normalRef.current;
    if (effectiveMode !== 'normal' || !wrap || !menu) return;

    // Cap the visible height to `maxItemsVisible` options (scrollable beyond).
    // Include the list's vertical padding AND borders (box-sizing: border-box)
    // so exactly `maxItemsVisible` full items fit.
    const firstOption = menu.querySelector('.metro-listpicker__option');
    const itemHeight = firstOption ? firstOption.getBoundingClientRect().height : 41;
    const cs = getComputedStyle(menu);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const maxListHeight = Math.max(1, maxItemsVisible) * itemHeight + paddingY + borderY;
    menu.style.maxHeight = `${maxListHeight}px`;
    menu.style.overflowY = 'auto';

    if (open) {
      if (!prevOpen.current) {
        // Just opened: animate from 0 to the capped height.
        wrap.style.height = '0px';
        void wrap.offsetHeight; // force a reflow so the transition starts
        wrap.style.height = `${Math.min(menu.scrollHeight, maxListHeight)}px`;
      } else {
        wrap.style.height = `${Math.min(menu.scrollHeight, maxListHeight)}px`;
      }

      // Center the selected item in the visible viewport so exactly
      // `maxItemsVisible` full items show around it (and reopening keeps its
      // position).
      if (selectedIndex >= 0) {
        const selectedEl = menu.children[selectedIndex] as HTMLElement | undefined;
        if (selectedEl) {
          const listRect = menu.getBoundingClientRect();
          const selRect = selectedEl.getBoundingClientRect();
          const target = selRect.top - listRect.top - (menu.clientHeight - itemHeight) / 2;
          menu.scrollTop += target;
        }
      }

      // Align the selected item with the trigger area. The menu is absolutely
      // positioned inside `.normal`; set the wrapper `top` so the selected
      // row's center lands on the trigger's vertical center. Item height is
      // measured from the first option; trigger height from the anchor.
      if (normal && selectedIndex >= 0) {
        const menuHeight = Math.min(menu.scrollHeight, maxListHeight);
        const triggerHeight = normal.offsetHeight;
        const selectedCenter = selectedIndex * itemHeight + itemHeight / 2;
        // Center the selected row at the trigger's vertical center; clamp so
        // the menu stays within the trigger area (top or bottom).
        const triggerCenter = triggerHeight / 2;
        const top = Math.max(
          Math.min(triggerCenter - selectedCenter, 0),
          triggerHeight - menuHeight,
        );
        wrap.style.top = `${top}px`;
      }
    } else if (closing) {
      wrap.style.height = '0px';
    }
    prevOpen.current = open;
  }, [open, closing, items, effectiveMode, selectedIndex, maxItemsVisible]);

  // Collapse the picker when the user clicks/taps outside it (for normal and
  // expanded inline modes).
  useEffect(() => {
    const inlineOpen = (effectiveMode === 'normal' || effectiveMode === 'expanded') && !disabled && open;
    if (!inlineOpen) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (effectiveMode === 'expanded') closeExpanded();
        else closeMenu();
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [effectiveMode, disabled, open]);

  const openMenu = () => {
    setClosing(false);
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
    setClosing(true);
  };

  const openExpanded = () => {
    // Capture the collapsed value-row height and the trigger's width before
    // they get hidden, so the expand animation has a start height and the
    // container keeps the trigger's width.
    const row = valueRowRef.current;
    if (row) {
      collapsedRowHeight.current = row.offsetHeight;
      if (expandedRef.current) {
        expandedRef.current.style.width = `${row.offsetWidth}px`;
      }
    }
    setClosing(false);
    setOpen(true);
  };

  const closeExpanded = () => {
    setOpen(false);
    setClosing(true);
  };

  const select = (v: T) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
    if (effectiveMode === 'normal') closeMenu();
    else closeExpanded();
  };

  return (
    <div
      ref={rootRef}
      className="metro-listpicker"
      data-disabled={disabled}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {header != null && <div className="metro-listpicker__header">{header}</div>}

      {mode === 'normal' ? (
        <div ref={normalRef} className="metro-listpicker__normal">
          <button
            type="button"
            className="metro-listpicker__trigger"
            data-hidden={open ? 'true' : 'false'}
            disabled={disabled}
            onClick={() => (open ? closeMenu() : openMenu())}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={ariaLabel}
          >
            <span className="metro-listpicker__value">
              {selected ? selected.label : placeholder}
            </span>
            <span className="metro-listpicker__chevron">▾</span>
          </button>
          {showMenu && (
            <div
              ref={wrapRef}
              className="metro-listpicker__menu-wrap"
              data-state={open ? 'open' : 'closing'}
              onTransitionEnd={() => {
                if (closing) setClosing(false);
              }}
            >
              <ul ref={menuRef} className="metro-listpicker__menu" role="listbox">
                {items.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={item.value === value}
                      className="metro-listpicker__option"
                      data-selected={item.value === value}
                      onClick={() => select(item.value)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : effectiveMode === 'expanded' ? (
        <div ref={expandedRef} className="metro-listpicker__expanded">
          <div
            ref={wrapRef}
            className="metro-listpicker__expander"
            data-state={open ? 'open' : 'closing'}
            onTransitionEnd={() => {
              if (closing) setClosing(false);
            }}
          >
            <button
              ref={valueRowRef}
              type="button"
              className="metro-listpicker__trigger"
              data-hidden={open ? 'true' : 'false'}
              disabled={disabled}
              onClick={() => (open ? closeExpanded() : openExpanded())}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={ariaLabel}
            >
              <span className="metro-listpicker__value">
                {selected ? selected.label : placeholder}
              </span>
              <span className="metro-listpicker__chevron">▾</span>
            </button>
            <ul ref={menuRef} className="metro-listpicker__expander-list" role="listbox">
              {items.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.value === value}
                    className="metro-listpicker__option"
                    data-selected={item.value === value}
                    onClick={() => select(item.value)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
