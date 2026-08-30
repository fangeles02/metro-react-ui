import { useState, type PointerEvent } from 'react';
import './RatingControl.css';

export interface RatingControlProps {
  /** Current rating value (0..max). */
  value?: number;
  /** Initial value (uncontrolled). */
  defaultValue?: number;
  /** Number of rating items. Defaults to 5. */
  max?: number;
  /** Callback when the rating changes. */
  onChange?: (value: number) => void;
  /** Disables interaction. */
  readOnly?: boolean;
  /** Show the numeric value helper while dragging. */
  showSelectionHelper?: boolean;
  /** Accent color override. */
  accent?: string;
  /** Accessible label. */
  'aria-label'?: string;
}

/**
 * Metro-style star rating control. Ported from the WP Toolkit `Rating`
 * (filled/unfilled star layers + drag-to-rate interaction).
 */
export function RatingControl({
  value: valueProp,
  defaultValue = 0,
  max = 5,
  onChange,
  readOnly = false,
  showSelectionHelper = false,
  accent,
  'aria-label': ariaLabel,
}: RatingControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const displayValue = hoverValue ?? value;

  const setValue = (v: number) => {
    if (readOnly) return;
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  const handlePointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (readOnly) return;
    setHoverValue(Number(e.currentTarget.dataset.star));
  };

  const handlePointerLeave = () => setHoverValue(null);

  const handleClick = (e: PointerEvent<HTMLSpanElement>) => {
    if (readOnly) return;
    setValue(Number(e.currentTarget.dataset.star));
  };

  return (
    <div
      className="metro-rating"
      data-readonly={readOnly}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerLeave={handlePointerLeave}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      <div className="metro-rating__stars">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className="metro-rating__star"
            data-star={i + 1}
            data-filled={i < displayValue}
            onPointerMove={handlePointerMove}
            onClick={handleClick}
          >
            <svg viewBox="0 0 10 9.1" className="metro-rating__star-shape" aria-hidden="true">
              <path
                d="M 5.0,0.0 L 6.1,3.5 L 9.8,3.5 L 6.8,5.6 L 7.9,9.0 L 5.0,6.9 L 2.1,9.1 L 3.2,5.6 L 0.2,3.5 L 3.9,3.5 L 5.0,0.0 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        ))}
      </div>
      {showSelectionHelper && hoverValue != null && (
        <div className="metro-rating__helper">{hoverValue}</div>
      )}
    </div>
  );
}
