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
  /**
   * How the menu is triggered.
   * - `longpress` (default): tap-and-hold on touch, right-click on desktop.
   * - `click`: a plain click/tap opens the menu.
   */
  trigger?: 'longpress' | 'click';
  /**
   * Where to place the menu relative to the host element.
   * - `pointer` (default): at the pointer/click coordinates.
   * - `top`: centered horizontally on the host, opening upward (above it).
   * - `bottom`: centered horizontally on the host, opening downward.
   */
  placement?: 'pointer' | 'top' | 'bottom';
}

/**
 * Metro-style context menu. Ported from the WP Toolkit `ContextMenu`
 * (opens on tap-and-hold on touch, right-click on desktop).
 */
export function ContextMenu({
  children,
  items,
  accent,
  trigger = 'longpress',
  placement = 'pointer',
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [slide, setSlide] = useState<'up' | 'down'>('up');
  const longPressTimer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const openAt = (x: number, y: number) => {
    setPos({ x, y });
    // The menu appears below the cursor/origin, so it slides down.
    setSlide('down');
    setOpen(true);
  };

  const close = () => setOpen(false);

  // Open anchored to the trigger element (above or below it, centered).
  const openAtHost = () => {
    const host = hostRef.current;
    if (!host) return;
    // Measure the trigger (first child) rather than the host, since the host
    // can collapse to zero size when its child is absolutely positioned.
    const trigger = host.firstElementChild as HTMLElement | null;
    const rect = (trigger ?? host).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    if (placement === 'top') {
      // Menu's bottom aligns to the trigger's top (opens upward).
      setPos({ x: centerX, y: rect.top });
      setSlide('up');
    } else {
      // Menu's top aligns to the trigger's bottom (opens downward).
      setPos({ x: centerX, y: rect.bottom });
      setSlide('down');
    }
    setOpen(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (trigger !== 'longpress') return;
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
    if (trigger !== 'longpress') return;
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  const handleClick = () => {
    if (trigger !== 'click') return;
    openAtHost();
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

  const menuStyle: React.CSSProperties = { left: pos.x, top: pos.y };
  if (placement === 'top' || placement === 'bottom') {
    // Center horizontally on the host, clamped so the menu stays on-screen.
    const menuWidth = 200; // matches .metro-contextmenu min-width
    const half = menuWidth / 2;
    const minLeft = 8;
    const maxLeft = window.innerWidth - menuWidth - 8;
    const centered = pos.x - half;
    const clampedLeft = Math.min(Math.max(centered, minLeft), maxLeft);
    menuStyle.left = clampedLeft;
    menuStyle.transform = 'translateX(0)';
    if (placement === 'top') {
      // Anchor the menu's bottom to the host's top (opens upward).
      delete menuStyle.top;
      menuStyle.bottom = window.innerHeight - pos.y;
    }
  }

  return (
    <div
      ref={hostRef}
      className="metro-contextmenu__host"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {children}
      {open && (
        <div
          ref={menuRef}
          className={`metro-contextmenu metro-contextmenu--slide-${slide}`}
          style={menuStyle}
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
