import { type CSSProperties, type ReactNode } from 'react';
import './ChatBubble.css';

export type ChatBubbleType = 'incoming' | 'outgoing';
export type ChatBubbleTailPosition = 'upper' | 'lower';
export type ChatBubbleTailSide = 'left' | 'right';

export interface ChatBubbleTail {
  /**
   * Vertical placement of the tail.
   * Defaults: `upper` for incoming, `lower` for outgoing.
   */
  position?: ChatBubbleTailPosition;
  /**
   * Which side the tail points toward (the sender).
   * Defaults: `left` for incoming, `right` for outgoing.
   */
  side?: ChatBubbleTailSide;
}

export interface ChatBubbleProps {
  /** Message content. */
  children: ReactNode;
  /**
   * Message direction. Defaults to `incoming`.
   * - `incoming` — received: accent-light background, tail upper-left.
   * - `outgoing` — sent: accent background, tail lower-right.
   */
  type?: ChatBubbleType;
  /**
   * Bubble background color. Defaults to the accent color for `outgoing` and
   * the lighter accent for `incoming` (authentic WP 8.1 messaging). The tail
   * automatically matches this color.
   */
  background?: string;
  /**
   * Tail configuration.
   * - `side` — the tail sits on the left/right side of the bubble (the
   *   classic side placement): left for incoming, right for outgoing.
   * - `default` — the tail sits on the top/bottom edge: top-left pointing up
   *   for incoming, bottom-right pointing down for outgoing.
   * - `none` — hide the tail.
   * - An object to override `position` and/or `side` independently.
   */
  tail?: ChatBubbleTail | 'side' | 'default' | 'none';
  /**
   * Optional timestamp text (e.g. "9:41") rendered at the lower-right of the
   * bubble, embedded inside it. Omit to hide it.
   */
  timestamp?: string;
  /** Extra class names. */
  className?: string;
}

/**
 * Metro-style chat message bubble. Ported from the WP 8.1 messaging shape:
 * a plain rectangle (no corner radius) with a small tail pointing toward the
 * sender.
 *
 * Tail placement:
 * - `tail="side"` (default) — tail on the side: upper-left pointing left for
 *   incoming, lower-right pointing right for outgoing.
 * - `tail="default"` — tail on the top/bottom edge: top-left pointing up for
 *   incoming, bottom-right pointing down for outgoing.
 */
export function ChatBubble({
  children,
  type = 'incoming',
  background,
  tail = 'side',
  timestamp,
  className,
}: ChatBubbleProps) {
  const resolvedBackground =
    background ?? (type === 'outgoing' ? 'var(--wp-accent)' : 'var(--wp-accent-light)');

  const tailConfig: ChatBubbleTail | null =
    tail === 'none' ? null : tail === 'side' || tail === 'default' ? {} : tail;

  const position = tailConfig?.position ?? (type === 'outgoing' ? 'lower' : 'upper');
  const side = tailConfig?.side ?? (type === 'outgoing' ? 'right' : 'left');

  // Placement class:
  // - `default` tail → edge placement (top for upper, bottom for lower).
  // - `side` tail (or explicit side) → side placement.
  const placement = tail === 'default' ? `edge-${position}` : side;

  // Cascade the resolved background to the tail via a custom property so the
  // triangle always matches the bubble.
  const style: CSSProperties & { '--metro-chatbubble-tail-color'?: string } = {
    background: resolvedBackground,
  };
  if (tailConfig) {
    style['--metro-chatbubble-tail-color'] = resolvedBackground;
  }

  return (
    <div
      className={`metro-chatbubble metro-chatbubble--${type} metro-chatbubble--tail-${placement} ${tailConfig ? '' : 'metro-chatbubble--no-tail'} ${className ?? ''}`}
      style={style}
    >
      <span className="metro-chatbubble__tail" aria-hidden="true" />
      <span className="metro-chatbubble__content">{children}</span>
      {timestamp ? <span className="metro-chatbubble__timestamp">{timestamp}</span> : null}
    </div>
  );
}