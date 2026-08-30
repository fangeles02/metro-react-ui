import { useEffect, useRef, useState, type ReactNode } from 'react';
import './SlideInEffect.css';

export interface SlideInEffectProps {
  children: ReactNode;
  /** Direction the content slides in from. Defaults to `up`. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Delay before the slide starts (ms). */
  delay?: number;
  /** Duration of the slide (ms). */
  duration?: number;
  className?: string;
}

/**
 * Metro-style slide-in effect. Ported from the WP Toolkit `SlideInEffect`
 * (content slides in from an edge when mounted).
 */
export function SlideInEffect({
  children,
  direction = 'up',
  delay = 0,
  duration = 350,
  className,
}: SlideInEffectProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`metro-slidein metro-slidein--${direction} ${visible ? 'metro-slidein--visible' : ''} ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
