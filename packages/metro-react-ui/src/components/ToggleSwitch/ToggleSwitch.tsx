import { useId, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import './ToggleSwitch.css';

export interface ToggleSwitchProps {
  /** Whether the switch is on. */
  checked?: boolean;
  /** Initial checked state (uncontrolled). */
  defaultChecked?: boolean;
  /** Callback when the checked state changes. */
  onChange?: (checked: boolean) => void;
  /** Disables the switch. */
  disabled?: boolean;
  /** Header text shown above the switch. */
  header?: ReactNode;
  /** Accent color override for the switch track. */
  accent?: string;
  /** Accessible label. */
  'aria-label'?: string;
}

/**
 * Metro-style toggle switch. Ported from the WP Toolkit `ToggleSwitch`
 * (Checked/Unchecked/Dragging visual states + slide animation).
 */
export function ToggleSwitch({
  checked: checkedProp,
  defaultChecked = false,
  onChange,
  disabled = false,
  header,
  accent,
  'aria-label': ariaLabel,
}: ToggleSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div className="metro-toggle" data-checked={checked} data-disabled={disabled}>
      <div className="metro-toggle__layout">
        <div className="metro-toggle__text">
          {header != null && <div className="metro-toggle__header">{header}</div>}
          <div className="metro-toggle__content">
            <input
              ref={inputRef}
              id={inputId}
              className="metro-toggle__input"
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={handleChange}
              aria-label={ariaLabel}
            />
          </div>
        </div>
        <label
          className="metro-toggle__label"
          htmlFor={inputId}
          style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
        >
          <span className="metro-toggle__track">
            <span className="metro-toggle__track-inner" />
            <span className="metro-toggle__thumb">
              <span className="metro-toggle__thumb-center" />
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
