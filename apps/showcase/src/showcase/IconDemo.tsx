import { useMemo, useRef, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { iconRegistry, type IconRegistration } from './icons/iconRegistry';

/* Full Fluent UI System Icons browser.
   Every icon family from @fluentui/react-icons is available (generated in
   icons/iconRegistry.ts). Each card shows the Regular and Filled variants
   side by side; click one to copy its React component name (e.g. EditFilled). */

const SIZES = [16, 24, 32, 48, 64];

/** Copy text to the clipboard, falling back to the legacy execCommand path. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/** Build the React component name for a variant (e.g. Edit + Filled -> EditFilled). */
function componentName(icon: IconRegistration, variant: 'regular' | 'filled'): string {
  const suffix = variant === 'filled' ? 'Filled' : 'Regular';
  return `${icon.name}${suffix}`;
}

function IconCard({
  icon,
  onCopy,
}: {
  icon: IconRegistration;
  onCopy: (name: string) => void;
}) {
  const [copied, setCopied] = useState<'regular' | 'filled' | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopy = (variant: 'regular' | 'filled', name: string | undefined) => {
    if (!name) return;
    copyText(name).then((ok) => {
      if (ok) {
        onCopy(name);
        setCopied(variant);
        setCopyFailed(false);
      } else {
        setCopyFailed(true);
        setCopied(null);
      }
    });
  };

  const renderVariant = (variant: 'regular' | 'filled', name: string | undefined) => {
    const Icon = variant === 'filled' ? icon.filled : icon.regular;
    if (!name || !Icon) return null;
    return (
      <button
        type="button"
        className="icon-browser__variant"
        onClick={() => handleCopy(variant, name)}
        title={`Copy ${name}`}
        aria-label={`Copy ${name}`}
      >
        <Icon fontSize={24} />
        <span className="icon-browser__copy-state">
          {copied === variant ? 'Copied!' : name}
        </span>
      </button>
    );
  };

  return (
    <div className="icon-browser__card" title={icon.name}>
      <div className="icon-browser__variants">
        {renderVariant('regular', icon.regular ? componentName(icon, 'regular') : undefined)}
        {renderVariant('filled', icon.filled ? componentName(icon, 'filled') : undefined)}
      </div>
      <div className="icon-browser__name">{icon.name}</div>
      {copyFailed && <div className="icon-browser__error">Copy unavailable</div>}
    </div>
  );
}

export function IconDemo() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState(24);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return iconRegistry;
    return iconRegistry.filter(
      (icon) =>
        icon.name.toLowerCase().includes(q) ||
        // also match raw variant names (e.g. "EditFilled")
        (icon.regular ? componentName(icon, 'regular').toLowerCase().includes(q) : false) ||
        (icon.filled ? componentName(icon, 'filled').toLowerCase().includes(q) : false),
    );
  }, [query]);

  const handleCopy = (name: string) => {
    setToast(`Copied ${name}`);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1600);
  };

  return (
    <div className="icon-browser">
      {/* Controls */}
      <div className="showcase__demo">
        <span className="showcase__demo-label">Search</span>
        <div className="showcase__demo-row">
          <input
            type="search"
            className="icon-browser__search"
            placeholder="Search icons… e.g. edit, arrow, wifi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search icons"
          />
          {query && (
            <button
              type="button"
              className="showcase__demo-btn"
              onClick={() => setQuery('')}
            >
              Clear
            </button>
          )}
        </div>
        <span className="showcase__demo-hint">
          Click an icon to copy its React component name (e.g. <code>EditFilled</code>).
        </span>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Size</span>
        <div className="showcase__demo-row">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={`showcase__demo-btn${size === s ? ' showcase__demo-btn--active' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">
          Gallery ({filtered.length} / {iconRegistry.length} icons)
        </span>
        {filtered.length === 0 ? (
          <div className="icon-browser__empty">
            No icons match “{query}”. Try a different keyword.
          </div>
        ) : (
          <div className="icon-gallery" style={{ fontSize: size }}>
            {filtered.map((icon) => (
              <IconCard key={icon.name} icon={icon} onCopy={handleCopy} />
            ))}
          </div>
        )}
      </div>

      {/* Copy feedback toast */}
      {toast && <div className="icon-browser__toast">{toast}</div>}

      <div className="showcase__demo">
        <span className="showcase__demo-label">Usage</span>
        <CodeBlock
          code={`import { EditRegular, EditFilled } from '@fluentui/react-icons';

<EditRegular />                     {/* outline, 1em */}
<EditFilled />                      {/* filled, 1em */}
<EditRegular fontSize={32} />       {/* fixed size */}

{/* In an AppBarButton (any ReactNode works) */}
<AppBarButton label="edit" icon={<EditFilled />} />`}
        />
      </div>
    </div>
  );
}
