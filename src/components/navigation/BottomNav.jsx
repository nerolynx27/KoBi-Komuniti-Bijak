import { useEffect, useRef } from 'react';
import { navigation } from '../../content/uiText.js';
import { PixelFrame, observeSize } from '../ui/PixelFrame.jsx';

export function NavStickerIcon({ name, active = false, size = 26 }) {
  return (
    <svg
      className={`bottom-nav-sticker-icon ${active ? 'is-active' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {name === 'home' && <g fill="var(--color-wine)"><path d="M2 12h3V9h3V6h3V3h6v3h3v3h3v3h3v4h-4v10H6V16H2z" /><path d="M8 13h3v-3h3V7h1v3h3v3h2v11h-4v-7h-4v7H8z" fill={active ? 'var(--color-gold)' : 'var(--color-vanilla)'} /></g>}
      {name === 'map' && (
        <g>
          <path
            d="M2 5h6v2h2V5h8v2h2V5h6v18h-6v-2h-2v2h-8v-2H8v2H2V5z"
            fill="var(--color-wine)"
          />
          <rect x="4" y="7" width="4" height="14" fill={active ? 'var(--color-gold)' : 'var(--color-sand)'} />
          <rect x="10" y="7" width="8" height="14" fill="var(--color-vanilla)" />
          <rect x="13" y="7" width="2" height="14" fill="var(--color-wine)" />
          <rect x="20" y="7" width="4" height="14" fill={active ? 'var(--color-gold)' : 'var(--color-sand)'} />
        </g>
      )}

      {name === 'reports' && (
        <g>
          <path
            d="M5 2h13v2h2v2h2v2h2v18H5V2z"
            fill="var(--color-wine)"
          />
          <path
            d="M7 4h9v6h6v14H7V4z"
            fill={active ? 'var(--color-gold)' : 'var(--color-sand)'}
          />
          <path d="M18 4h2v2h2v2h-4V4z" fill="var(--color-vanilla)" />
          <rect x="9" y="12" width="10" height="2" fill="var(--color-wine)" />
          <rect x="9" y="16" width="10" height="2" fill="var(--color-wine)" />
          <rect x="9" y="20" width="7" height="2" fill="var(--color-wine)" />
        </g>
      )}

      {name === 'activities' && (
        <g>
          <path
            d="M18 4h4v20h-4v-3h-4v-2h-4v5H6v-5H3v-8h3V9h4V7h4V4h4z"
            fill="var(--color-wine)"
          />
          <rect x="5" y="13" width="3" height="4" fill="var(--color-cherry)" />
          <path
            d="M10 11h4V9h4v10h-4v-2h-4v-6z"
            fill={active ? 'var(--color-gold)' : 'var(--color-sand)'}
          />
          <rect x="18" y="6" width="2" height="16" fill="var(--color-vanilla)" />
          <rect x="7" y="19" width="2" height="3" fill="var(--color-sand)" />
          <rect x="24" y="9" width="2" height="2" fill="var(--color-wine)" />
          <rect x="24" y="13" width="3" height="2" fill="var(--color-wine)" />
          <rect x="24" y="17" width="2" height="2" fill="var(--color-wine)" />
        </g>
      )}

      {name === 'profile' && (
        <g>
          <path
            d="M10 3h8v2h2v6h-2v2h-8v-2H8V5h2V3z"
            fill="var(--color-wine)"
          />
          <rect x="10" y="5" width="8" height="6" fill={active ? 'var(--color-gold)' : 'var(--color-vanilla)'} />
          <path
            d="M6 15h16v2h2v8H4v-8h2v-2z"
            fill="var(--color-wine)"
          />
          <path
            d="M8 17h12v2h2v4H6v-4h2v-2z"
            fill={active ? 'var(--color-gold)' : 'var(--color-sand)'}
          />
        </g>
      )}
    </svg>
  );
}

function NavItem({ item, active }) {
  const ref = useRef(null);
  return (
    <a
      ref={ref}
      href={`#${item.id}`}
      className={`nav-item ${active ? 'framed is-selected' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {active && <PixelFrame targetRef={ref} />}
      <span className="control-content">
        <NavStickerIcon name={item.id} active={active} size={26} />
        <span>{item.label}</span>
      </span>
    </a>
  );
}

export function BottomNav({ active, specimen = false, items = navigation }) {
  const ref = useRef(null);
  useEffect(() => {
    if (specimen) return;
    const shell = ref.current?.closest('.app-shell');
    if (!shell) return undefined;
    const stop = observeSize(ref.current, rect =>
      shell.style.setProperty('--bottom-nav-reserve', `${Math.ceil(rect.height) + 16}px`)
    );
    return () => {
      stop();
      shell.style.removeProperty('--bottom-nav-reserve');
    };
  }, [specimen]);

  return (
    <nav
      ref={ref}
      aria-label={specimen ? 'Specimen navigation' : 'Main navigation'}
      className={`bottom-nav ${specimen ? 'specimen-nav' : ''}`}
    >
      {items.map(item => (
        <NavItem key={item.id} item={item} active={item.id === active} />
      ))}
    </nav>
  );
}
