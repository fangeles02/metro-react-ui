# Turnstile Transition — Technical Notes (TEMP)

> Temporary reference file. Created to preserve the turnstile/turnstile3 changes
> before a reset. Re-apply these changes after resetting.

---

## 1. `packages/metro-react-ui/src/components/Transitions/TurnstileTransition.tsx`

### Mode union
The `mode` prop type includes `'turnstile' | 'turnstile2' | 'turnstile3' | 'swivel' | 'cube'`.

```tsx
mode?: 'turnstile' | 'turnstile2' | 'turnstile3' | 'swivel' | 'cube';
```

---

## 2. `packages/metro-react-ui/src/components/Transitions/TurnstileTransition.css`

### 2a. Base turnstile IN direction (fixed — flips to LEFT on forward)

With `transform-origin: 0% 50%` (left edge):
- **negative `rotateY`** = flip to **left**
- **positive `rotateY`** = flip to **right**

```css
/* Forward in: -80° -> 0°, fade in — incoming flips in from the left */
@keyframes metro-turnstile-forward-in {
  0% {
    transform: perspective(1000px) rotateY(-80deg);
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    transform: perspective(1000px) rotateY(0deg);
    opacity: 1;
  }
}

/* Backward in: +50° -> 0°, fade in — incoming flips in from the right */
@keyframes metro-turnstile-backward-in {
  0% {
    transform: perspective(1000px) rotateY(50deg);
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    transform: perspective(1000px) rotateY(0deg);
    opacity: 1;
  }
}
```

### 2b. Turnstile3 — slide/scale entrance (IN phase)

```css
/* =====================================================================
   Turnstile3 — turnstile flip + slide/scale entrance.
   The page flips on the left vertical axis while sliding in from the
   side with a slight scale-down → scale-up, giving a snappy
   "door/page swing in" feel.
   ===================================================================== */

/* ---- "in" phase: incoming page (EaseOut, ~400ms) ---- */
.metro-turnstile--turnstile3.metro-turnstile--in {
  animation-duration: 0.4s; /* 400ms */
  animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1.0); /* snappy deceleration */
}

.metro-turnstile--turnstile3.metro-turnstile--forward.metro-turnstile--in {
  animation-name: metro-turnstile3-forward-in;
}

.metro-turnstile--turnstile3.metro-turnstile--backward.metro-turnstile--in {
  animation-name: metro-turnstile3-backward-in;
}

/* ---- "out" phase: outgoing page (EaseIn, 250ms) ---- */
.metro-turnstile--turnstile3.metro-turnstile--out {
  animation-duration: var(--wp-duration-fast); /* 250ms */
  animation-timing-function: cubic-bezier(1, 0, 1, 1); /* EaseIn */
}

.metro-turnstile--turnstile3.metro-turnstile--forward.metro-turnstile--out {
  animation-name: metro-turnstile3-forward-out;
}

.metro-turnstile--turnstile3.metro-turnstile--backward.metro-turnstile--out {
  animation-name: metro-turnstile3-backward-out;
}

/* Forward in: rotateY 45° -> 0°, translateX 60px -> 0, scale 0.92 -> 1 */
@keyframes metro-turnstile3-forward-in {
  0% {
    transform: perspective(1000px) translateX(60px) rotateY(45deg) scale(0.92);
    opacity: 0;
  }
  100% {
    transform: perspective(1000px) translateX(0) rotateY(0deg) scale(1);
    opacity: 1;
  }
}

/* Backward in: rotateY -45° -> 0°, translateX -60px -> 0, scale 0.92 -> 1 */
@keyframes metro-turnstile3-backward-in {
  0% {
    transform: perspective(1000px) translateX(-60px) rotateY(-45deg) scale(0.92);
    opacity: 0;
  }
  100% {
    transform: perspective(1000px) translateX(0) rotateY(0deg) scale(1);
    opacity: 1;
  }
}

/* Forward out: page flips 0° -> -50° while flying out to depth */
@keyframes metro-turnstile3-forward-out {
  0% {
    transform: perspective(1000px) translateZ(0) rotateY(0deg);
    opacity: 1;
  }
  96% {
    opacity: 1;
  }
  100% {
    transform: perspective(1000px) translateZ(-120px) rotateY(-50deg);
    opacity: 0;
  }
}

/* Backward out: page flips 0° -> +80° while flying out to depth */
@keyframes metro-turnstile3-backward-out {
  0% {
    transform: perspective(1000px) translateZ(0) rotateY(0deg);
    opacity: 1;
  }
  96% {
    opacity: 1;
  }
  100% {
    transform: perspective(1000px) translateZ(-120px) rotateY(80deg);
    opacity: 0;
  }
}
```

---

## 3. `apps/showcase/src/App.tsx` — restructured transition architecture

### Key changes
- Replaced the old two-phase `outgoing`/`incoming` model with a single `transition` state.
- **Outgoing page stays in the document flow** (preserves page height → no scroll jump).
- **Incoming page renders as a fixed overlay** and animates in.
- `window.scrollTo(0, 0)` after each transition so new pages open at the top.
- Added `renderPage` helper + imported `ShowcasePage` type.

### State model
```tsx
interface NavState {
  pageId: string;
  direction: 'forward' | 'backward';
}

/** An in-flight transition: `from` stays in flow, `to` overlays on top. */
interface TransitionState {
  from: NavState;
  to: NavState;
}
```

### Navigation handlers
```tsx
const navigate = (id: string) => {
  if (id === current.pageId) return;
  setTransition({ from: current, to: { pageId: id, direction: 'forward' } });
  timeoutRef.current = window.setTimeout(() => {
    setCurrent({ pageId: id, direction: 'forward' });
    setTransition(null);
    window.scrollTo(0, 0);
  }, OUT_DURATION);
};

const goBack = () => {
  if (current.pageId === 'home') return;
  setTransition({ from: current, to: { pageId: 'home', direction: 'backward' } });
  timeoutRef.current = window.setTimeout(() => {
    setCurrent({ pageId: 'home', direction: 'backward' });
    setTransition(null);
    window.scrollTo(0, 0);
  }, OUT_DURATION);
};
```

### Render (two-phase turnstile)
```tsx
return (
  <div className="showcase">
    {/* Outgoing page stays in flow; flips out (phase="out") */}
    {transition ? (
      <div className="showcase__outgoing">
        <TurnstileTransition
          direction={transition.from.direction}
          phase="out"
          animationKey={`out-${transition.from.pageId}`}
          mode='turnstile'
        >
          {renderPage(transition.from.pageId, fromPage)}
        </TurnstileTransition>
      </div>
    ) : (
      renderPage(current.pageId, active)
    )}

    {/* Incoming page overlays viewport; flips in (phase="in") */}
    {transition && (
      <div className="showcase__incoming">
        <TurnstileTransition
          direction={transition.to.direction}
          phase="in"
          animationKey={`in-${transition.to.pageId}`}
          mode='turnstile'
        >
          {renderPage(transition.to.pageId, toPage)}
        </TurnstileTransition>
      </div>
    )}
  </div>
);
```

> **Note:** To use turnstile3 instead, change both `mode='turnstile'` to `mode='turnstile3'`.

---

## 4. `apps/showcase/src/App.css`

```css
/* Outgoing page stays in the document flow during the transition, so the
   page height is preserved and the scroll position doesn't jump. */
.showcase__outgoing {
  width: 100%;
}

/* Incoming page overlays the viewport and animates in on top. The
   background is transparent so the outgoing page's flip-out (which stays
   in the document flow beneath) remains visible during the transition. */
.showcase__incoming {
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow: hidden;
}

/* Incoming page fills the full viewport width. */
.showcase__incoming > * {
  width: 100%;
}
```

---

## 5. Build commands

```bash
# Rebuild the core library (required for showcase to pick up CSS/TSX changes)
npm run build:lib

# Build the showcase
npm run build:showcase

# Run the dev server
npm run dev
```

> The library's `exports` point to `dist/`, so you MUST run `npm run build:lib`
> after editing `packages/metro-react-ui/src/**` for the showcase to reflect changes.
