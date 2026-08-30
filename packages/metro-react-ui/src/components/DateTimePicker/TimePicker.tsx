import { useState, type ReactNode } from 'react';
import './DateTimePicker.css';

export interface TimePickerProps {
  /** Currently selected time (controlled). */
  value?: Date;
  /** Initial time (uncontrolled). */
  defaultValue?: Date;
  /** Callback when the time changes. */
  onChange?: (time: Date) => void;
  /** Header text. */
  header?: ReactNode;
  /** Accent color override. */
  accent?: string;
  /** Accessible label. */
  'aria-label'?: string;
}

/**
 * Metro-style time picker. Ported from the WP Toolkit `TimePicker`
 * (tap to open a full-screen time selection sheet).
 */
export function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  header,
  accent,
  'aria-label': ariaLabel,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState<Date>(defaultValue ?? new Date());
  const [open, setOpen] = useState(false);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const select = (d: Date) => {
    if (!isControlled) setInternalValue(d);
    onChange?.(d);
    setOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

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
        {value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </button>
      {open && (
        <div className="metro-datetime__overlay" onClick={() => setOpen(false)}>
          <div className="metro-datetime__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="metro-datetime__sheet-header">
              Select time
              <button
                type="button"
                className="metro-datetime__close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="metro-datetime__timecols">
              <div className="metro-datetime__col">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className="metro-datetime__day"
                    data-selected={h === value.getHours()}
                    onClick={() => {
                      const d = new Date(value);
                      d.setHours(h);
                      select(d);
                    }}
                  >
                    {String(h).padStart(2, '0')}
                  </button>
                ))}
              </div>
              <div className="metro-datetime__col">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="metro-datetime__day"
                    data-selected={m === value.getMinutes()}
                    onClick={() => {
                      const d = new Date(value);
                      d.setMinutes(m);
                      select(d);
                    }}
                  >
                    {String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
