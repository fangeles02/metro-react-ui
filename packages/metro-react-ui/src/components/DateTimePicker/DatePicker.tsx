import { useState, type ReactNode } from 'react';
import './DateTimePicker.css';

export interface DatePickerProps {
  /** Currently selected date (controlled). */
  value?: Date;
  /** Initial date (uncontrolled). */
  defaultValue?: Date;
  /** Callback when the date changes. */
  onChange?: (date: Date) => void;
  /** Header text. */
  header?: ReactNode;
  /** Accent color override. */
  accent?: string;
  /** Accessible label. */
  'aria-label'?: string;
}

/**
 * Metro-style date picker. Ported from the WP Toolkit `DatePicker`
 * (tap to open a full-screen date selection sheet).
 */
export function DatePicker({
  value: valueProp,
  defaultValue,
  onChange,
  header,
  accent,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date>(defaultValue ?? new Date());
  const [open, setOpen] = useState(false);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const select = (d: Date) => {
    if (!isControlled) setInternalValue(d);
    onChange?.(d);
    setOpen(false);
  };

  const year = value.getFullYear();
  const month = value.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div
      className="metro-datetime"
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      {header != null && <div className="metro-datetime__header">{header}</div>}
      <button
        type="button"
        className="metro-datetime__trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
      >
        {value.toLocaleDateString()}
      </button>
      {open && (
        <div className="metro-datetime__overlay" onClick={() => setOpen(false)}>
          <div
            className="metro-datetime__sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="metro-datetime__sheet-header">
              {value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              <button
                type="button"
                className="metro-datetime__close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="metro-datetime__grid">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  type="button"
                  className="metro-datetime__day"
                  data-selected={day === value.getDate()}
                  onClick={() => select(new Date(year, month, day))}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
