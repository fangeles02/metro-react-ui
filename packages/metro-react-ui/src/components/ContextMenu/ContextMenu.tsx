import { useEffect, useRef, useState, type ReactNode } from 'react';
import './ContextMenu.css';

export interface ContextMenuItem {
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface ContextMenuProps {
  /** The element that opens the menu on long-press / right-click. */
  children: ReactNode;
  /** Menu items. */
  items: ContextMenuItem[];
  /** Accent color override. */
  accent?: string;
}

/**
 * Metro-style context menu. Ported from the WP Toolkit `ContextMenu`
 * (opens on tap-and-hold on touch, right-click on desktop).
 */
export function ContextMenu({ children, items, accent }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openAt = (x: number, y: number) => {
    setPos({ x, y });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return; // handled by contextmenu event
    longPressTimer.current = window.setTimeout(() => {
      openAt(e.clientX, e.clientY);
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      className="metro-contextmenu__host"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={handleContextMenu}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {children}
      {open && (
        <div
          ref={menuRef}
          className="metro-contextmenu"
          style={{ left: pos.x, top: pos.y }}
          role="menu"
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              className="metro-contextmenu__item"
              disabled={item.disabled}
              onClick={() => {
                close();
                item.onSelect?.();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
