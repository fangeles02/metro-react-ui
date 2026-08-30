import { useEffect, type ReactNode } from 'react';
import './CustomMessageBox.css';

export interface CustomMessageBoxButton {
  label: string;
  value?: unknown;
}

export interface CustomMessageBoxProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Title shown at the top. */
  title?: ReactNode;
  /** Main message content. */
  message?: ReactNode;
  /** Optional custom content below the message. */
  children?: ReactNode;
  /** Buttons shown at the bottom. Defaults to a single OK button. */
  buttons?: CustomMessageBoxButton[];
  /** Callback when a button is pressed. */
  onButtonPressed?: (value: unknown) => void;
  /** Callback when dismissed (backdrop/Escape). */
  onDismiss?: () => void;
  /** Accent color override. */
  accent?: string;
}

/**
 * Metro-style message box. Ported from the WP Toolkit `CustomMessageBox`
 * (modal dialog with title, message, optional content, and buttons).
 */
export function CustomMessageBox({
  open,
  title,
  message,
  children,
  buttons = [{ label: 'ok' }],
  onButtonPressed,
  onDismiss,
  accent,
}: CustomMessageBoxProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="metro-messagebox__overlay" onClick={onDismiss}>
      <div
        className="metro-messagebox"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
      >
        {title != null && <div className="metro-messagebox__title">{title}</div>}
        {message != null && <div className="metro-messagebox__message">{message}</div>}
        {children != null && <div className="metro-messagebox__content">{children}</div>}
        <div className="metro-messagebox__buttons">
          {buttons.map((btn, i) => (
            <button
              key={i}
              type="button"
              className="metro-messagebox__button"
              onClick={() => onButtonPressed?.(btn.value)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
