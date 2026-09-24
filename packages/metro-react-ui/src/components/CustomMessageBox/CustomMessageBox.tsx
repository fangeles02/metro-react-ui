import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { PhoneTextBox } from '../PhoneTextBox/PhoneTextBox';
import { MultiselectList } from '../MultiselectList/MultiselectList';
import { ToggleSwitch } from '../ToggleSwitch/ToggleSwitch';
import { ListPicker } from '../ListPicker/ListPicker';
import { Button } from '../Button/Button';
import './CustomMessageBox.css';

export interface CustomMessageBoxButton {
  label: string;
  value?: unknown;
}

/** A single selectable option for `select` / `multiselect` fields. */
export interface MessageBoxOption {
  value: unknown;
  label: ReactNode;
}

/** Declarative input field rendered inside the message box. */
export type MessageBoxField =
  | {
      type: 'text';
      name: string;
      label?: ReactNode;
      hint?: string;
      defaultValue?: string;
      required?: boolean;
      /** Optional inline style applied to the field wrapper (e.g. to override the default full width). */
      style?: CSSProperties;
    }
  | {
      type: 'password';
      name: string;
      label?: ReactNode;
      hint?: string;
      defaultValue?: string;
      required?: boolean;
      /** Optional inline style applied to the field wrapper (e.g. to override the default full width). */
      style?: CSSProperties;
    }
  | {
      type: 'select';
      name: string;
      label?: ReactNode;
      options: MessageBoxOption[];
      defaultValue?: unknown;
      /** Optional inline style applied to the field wrapper (e.g. to override the default full width). */
      style?: CSSProperties;
    }
  | {
      type: 'multiselect';
      name: string;
      label?: ReactNode;
      options: MessageBoxOption[];
      defaultValue?: unknown[];
      /** Optional inline style applied to the field wrapper (e.g. to override the default full width). */
      style?: CSSProperties;
    }
  | {
      type: 'toggle';
      name: string;
      label?: ReactNode;
      defaultValue?: boolean;
      /** Optional inline style applied to the field wrapper (e.g. to override the default full width). */
      style?: CSSProperties;
    };

export type MessageBoxVariant = 'default' | 'accent' | 'accentedButton';

export type MessageBoxTransition = 'swivel' | 'slide' | 'fade';

export interface CustomMessageBoxProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Title shown at the top. */
  title?: ReactNode;
  /** Main message content. */
  message?: ReactNode;
  /** Optional custom content below the message (escape hatch). */
  children?: ReactNode;
  /** Declarative input fields rendered between the message and the buttons. */
  fields?: MessageBoxField[];
  /** Buttons shown at the bottom. Defaults to a single OK button. */
  buttons?: CustomMessageBoxButton[];
  /**
   * Theming variant.
   * - `default`: chrome background, default buttons.
   * - `accent`: accent background, accent-light buttons.
   * - `accentedButton`: chrome background, accent buttons.
   */
  variant?: MessageBoxVariant;
  /**
   * Width threshold (px) separating mobile from wide layout. Defaults to 768
   * (matches AppBar). Below it the dialog is top-anchored and full-bleed
   * (WP8.1 style); at/above it the dialog is centered (Win8 style).
   */
  breakpoint?: number;
  /**
   * In/out transition. Defaults to `swivel` on mobile and `fade` on wide
   * screens. `slide` slides vertically with easing.
   */
  transition?: MessageBoxTransition;
  /** Callback when a button is pressed. Receives the button value and the
   * collected field values keyed by field `name`. */
  onButtonPressed?: (value: unknown, values: Record<string, unknown>) => void;
  /** Callback when dismissed (backdrop/Escape). */
  onDismiss?: () => void;
  /** Accent color override. */
  accent?: string;
}

const DEFAULT_BUTTONS: CustomMessageBoxButton[] = [{ label: 'ok' }];

/**
 * Metro-style message box. Ported from the WP Toolkit `CustomMessageBox`.
 *
 * Responsive behavior mirrors the authentic Windows Phone 8.1 dialog (mobile:
 * top-anchored, full-bleed, stacked full-width buttons) and the Windows 8/8.1
 * message box (wide: centered, compact bottom-right buttons). Supports
 * declarative input fields, theming variants, and swivel/slide/fade in-out
 * transitions.
 */
export function CustomMessageBox({
  open,
  title,
  message,
  children,
  fields,
  buttons = DEFAULT_BUTTONS,
  variant = 'default',
  breakpoint = 768,
  transition,
  onButtonPressed,
  onDismiss,
  accent,
}: CustomMessageBoxProps) {
  // Responsive detection (mirrors AppBar).
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  // Exit-animation state: keep the dialog mounted while it animates out.
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  // Tracks the previous `open` value so we only reset state on the
  // false -> true transition (not on every render where open is truthy).
  const prevOpenRef = useRef(open);

  // Field values, keyed by field name.
  const [values, setValues] = useState<Record<string, unknown>>({});

  const effectiveTransition: MessageBoxTransition =
    isMobile ? (transition ?? 'swivel') : 'fade';

  // When `open` transitions false -> true, reset the closing state.
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setClosing(false);
      closingRef.current = false;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Seed values from field defaults.
      const seed: Record<string, unknown> = {};
      fields?.forEach((f) => {
        if (f.defaultValue !== undefined) seed[f.name] = f.defaultValue;
      });
      setValues(seed);
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape to dismiss.
  useEffect(() => {
    if (!open && !closing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  // Clean up timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const finishClose = () => {
    setClosing(false);
    closingRef.current = false;
  };

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    // Unmount after the out animation finishes. Must be >= the longest out
    // animation duration (swivel out = 500ms).
    timerRef.current = window.setTimeout(finishClose, 200);
  };

  const handleButtonPressed = (value: unknown) => {
    onButtonPressed?.(value, values);
    requestClose();
  };

  const handleDismiss = () => {
    onDismiss?.();
    requestClose();
  };

  const setFieldValue = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Map the message box variant to the core Button component variant.
  const buttonVariant: 'default' | 'filled' | 'accent' =
    variant === 'accent' ? 'filled' : variant === 'accentedButton' ? 'accent' : 'default';

  if (!open && !closing) return null;
  if (typeof document === 'undefined') return null;

  const variantClass = `metro-messagebox--${variant}`;
  const transitionClass = `metro-messagebox--${effectiveTransition}`;
  const stateClass = closing ? 'metro-messagebox--out' : 'metro-messagebox--in';

  return createPortal(
    <div
      className={`metro-messagebox__overlay ${closing ? 'metro-messagebox__overlay--out' : ''}`}
      onClick={handleDismiss}
    >
      <div
        className={`metro-messagebox ${variantClass} ${transitionClass} ${stateClass} ${isMobile ? 'metro-messagebox--mobile' : 'metro-messagebox--wide'}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={accent ? ({ '--wp-accent': accent } as CSSProperties) : undefined}
      >
        {title != null && <div className="metro-messagebox__title">{title}</div>}
        {message != null && <div className="metro-messagebox__message">{message}</div>}
        {fields != null && fields.length > 0 && (
          <div className="metro-messagebox__fields">
            {fields.map((field) => (
              <div className="metro-messagebox__field" key={field.name} style={field.style}>
                {renderField(field, values, setFieldValue)}
              </div>
            ))}
          </div>
        )}
        {children != null && <div className="metro-messagebox__content">{children}</div>}
        <div className="metro-messagebox__buttons">
          {buttons.map((btn, i) => (
            <Button
              key={i}
              variant={buttonVariant}
              className="metro-messagebox__button"
              onClick={() => handleButtonPressed(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function renderField(
  field: MessageBoxField,
  values: Record<string, unknown>,
  setValue: (name: string, value: unknown) => void,
) {
  switch (field.type) {
    case 'text':
      return (
        <PhoneTextBox
          header={field.label}
          hint={field.hint}
          required={field.required}
          value={(values[field.name] as string | undefined) ?? ''}
          onValueChange={(v) => setValue(field.name, v)}
        />
      );
    case 'password':
      return (
        <PhoneTextBox
          type="password"
          header={field.label}
          hint={field.hint}
          required={field.required}
          value={(values[field.name] as string | undefined) ?? ''}
          onValueChange={(v) => setValue(field.name, v)}
        />
      );
    case 'select':
      return (
        <ListPicker
          items={field.options.map((o) => ({ value: o.value, label: o.label }))}
          header={field.label}
          mode="expanded"
          value={values[field.name]}
          onChange={(v) => setValue(field.name, v)}
        />
      );
    case 'multiselect':
      return (
        <MultiselectList
          items={field.options.map((o) => ({ value: o.value, label: o.label }))}
          header={field.label}
          value={(values[field.name] as unknown[] | undefined) ?? []}
          onChange={(v) => setValue(field.name, v)}
        />
      );
    case 'toggle':
      return (
        <ToggleSwitch
          header={field.label}
          checked={(values[field.name] as boolean | undefined) ?? false}
          onChange={(v) => setValue(field.name, v)}
        />
      );
  }
}
