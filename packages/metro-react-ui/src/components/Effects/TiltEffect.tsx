import { useRef, type ReactNode, type PointerEvent } from 'react';
import './TiltEffect.css';

export interface TiltEffectProps {
  children: ReactNode;
  /** Maximum tilt angle in degrees. Defaults to 17 (0.3 rad). */
  maxAngle?: number;
  /** Maximum depression (translateZ) in px. Defaults to 25. */
  maxDepression?: number;
  className?: string;
}

/**
 * Metro-style tilt effect. Ported from the WP Toolkit `TiltEffect`
 * (3D tilt on press using pointer tracking + CSS perspective).
 */
export function TiltEffect({
  children,
  maxAngle = 17,
  maxDepression = 25,
  className,
}: TiltEffectProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${(-py * maxAngle).toFixed(2)}deg) rotateY(${(px * maxAngle).toFixed(2)}deg) translateZ(${maxDepression}px)`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    el.releasePointerCapture(e.pointerId);
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <div
      ref={ref}
      className={`metro-tilt ${className ?? ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {children}
    </div>
  );
}
