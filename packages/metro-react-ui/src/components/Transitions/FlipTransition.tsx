import { type ReactNode } from 'react';
import './FlipTransition.css';

export interface FlipTransitionProps {
  children: ReactNode;
  /**
   * Direction of the transition.
   * Forward = page swings in from -80° (or out to +50°).
   * Backward = page swings in from +50° (or out to -80°).
   */
  direction?: 'forward' | 'backward';
  /**
   * Which half of the two-stage transition this is.
   * `in` = incoming page (EaseOut, 350ms); `out` = outgoing page (EaseIn, 250ms).
   */
  phase?: 'in' | 'out';
  /** Unique key so the animation re-runs when content changes. */
  animationKey?: string | number;
  /**
   * Horizontal pivot of the rotation.
   * `left` (default) = rotate around the left edge, like flipping a book page
   * (matches the original WP toolkit `CenterOfRotationX = 0`).
   * `center` = rotate around the middle, like a spinning circle.
   */
  origin?: 'left' | 'center';
  /**
   * Rotation axis for the `swivel` mode.
   * `horizontal` (default) = rotate around the vertical axis (RotationY),
   * like a spinning sign.
   * `vertical` = rotate around the horizontal axis (RotationX), like a
   * top/bottom cube flip.
   */
  axis?: 'horizontal' | 'vertical';
  /**
   * The transition family.
   * `flip` (default) = book-page flip around the vertical axis (RotationY),
   * matching the WP Toolkit `TurnstileTransition`.
   * `turnstile` = turnstile flip + slide/scale entrance (the page flips on the
   * left vertical axis while sliding in from the side with a slight
   * scale-down → scale-up).
   * `swivel` = true 3D cube rotation around the vertical axis (RotationY),
   * like the PowerPoint "Cube" slide transition or Instagram stories.
   */
  mode?: 'flip' | 'turnstile' | 'swivel';
}

/**
 * Metro-style page transition. Ported from the WP Toolkit storyboards.
 *
 * Flip (RotationY around the vertical axis, left origin):
 *   Forward in:   -80° -> 0°   (EaseOut, 350ms)
 *   Forward out:    0° -> +50° (EaseIn,  250ms)
 *   Backward in:  +50° -> 0°   (EaseOut, 350ms)
 *   Backward out:   0° -> -80° (EaseIn,  250ms)
 *
 * Swivel (RotationY around the vertical axis, respects `origin`):
 *   Forward in:   -45° -> 0°   (EaseOut, 350ms)
 *   Forward out:    0° -> +90° (EaseIn,  250ms)
 *   Backward in:  -45° -> 0°   (EaseOut, 350ms)
 *   Backward out:   0° -> +60° (EaseIn,  250ms)
 *
 * Cube (RotationY around the vertical axis, center origin) — PowerPoint / IG stories:
 *   Forward in:   +90° -> 0°   (EaseOut, 350ms) — incoming comes from the right
 *   Forward out:    0° -> -90° (EaseIn,  250ms) — outgoing rotates away to the left
 *   Backward in:  -90° -> 0°   (EaseOut, 350ms) — incoming comes from the left
 *   Backward out:   0° -> +90° (EaseIn,  250ms) — outgoing rotates away to the right
 */
export function FlipTransition({
  children,
  direction = 'forward',
  phase = 'in',
  animationKey,
  origin = 'left',
  axis = 'horizontal',
  mode = 'flip',
}: FlipTransitionProps) {
  return (
    <div
      key={animationKey}
      className={`metro-flip metro-flip--${mode} metro-flip--${direction} metro-flip--${phase} metro-flip--origin-${origin} metro-flip--axis-${axis}`}
    >
      {children}
    </div>
  );
}
