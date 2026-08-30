import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import './PhoneTextBox.css';

export interface PhoneTextBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Watermark/hint text shown when empty. */
  hint?: string;
  /** Header text shown above the field. */
  header?: ReactNode;
  /** Accent color override. */
  accent?: string;
  /** Callback with the new value. */
  onValueChange?: (value: string) => void;
}

/**
 * Metro-style text input with a watermark hint and underline accent.
 * Ported from the WP Toolkit `PhoneTextBox`.
 */
export function PhoneTextBox({
  hint,
  header,
  accent,
  onValueChange,
  className,
  id,
  value,
  defaultValue,
  ...rest
}: PhoneTextBoxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const showHint = hint != null && currentValue === '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onValueChange?.(e.target.value);
  };

  return (
    <div
      className="metro-textbox"
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {header != null && <label className="metro-textbox__header" htmlFor={inputId}>{header}</label>}
      <div className="metro-textbox__field">
        <input
          {...rest}
          id={inputId}
          className={`metro-textbox__input ${className ?? ''}`}
          value={currentValue}
          onChange={handleChange}
        />
        {showHint && <span className="metro-textbox__hint">{hint}</span>}
      </div>
    </div>
  );
}
