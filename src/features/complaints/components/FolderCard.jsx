import { useEffect, useRef, useState } from 'react';
import { observeSize } from '../../../components/ui/PixelFrame.jsx';

function buildJacketPolygon(w, h, tabH, tabL, tabR, inset, flushBottom) {
  const i = inset;
  const pts = [];
  const push = (x, y) => pts.push(`${pts.length ? 'L' : 'M'}${x},${y}`);

  // Start at bottom-left corner
  if (flushBottom) {
    push(i, h - i);
  } else {
    push(i, h - 4 - i);
  }

  if (tabL <= 2) {
    // Left edge goes straight up into the first top tab
    push(i, 4 + i);
    push(2 + i, 4 + i);
    push(2 + i, 2 + i);
    push(4 + i, 2 + i);
    push(4 + i, i);
  } else {
    // Left edge goes up to folder top shoulder
    push(i, tabH + 4 + i);
    push(2 + i, tabH + 4 + i);
    push(2 + i, tabH + 2 + i);
    push(4 + i, tabH + 2 + i);
    push(4 + i, tabH + i);
    // Across left shoulder to top tab base
    push(tabL + i, tabH + i);
    // Up left edge of top tab
    push(tabL + i, 4 + i);
    push(tabL + 2 + i, 4 + i);
    push(tabL + 2 + i, 2 + i);
    push(tabL + 4 + i, 2 + i);
    push(tabL + 4 + i, i);
  }

  // Across top edge of top tab
  push(tabR - 4 - i, i);
  push(tabR - 4 - i, 2 + i);
  push(tabR - 2 - i, 2 + i);
  push(tabR - 2 - i, 4 + i);
  push(tabR - i, 4 + i);

  if (tabR < w - 2) {
    // Down right edge of top tab to shoulder
    push(tabR - i, tabH + i);
    // Across right shoulder to top-right corner of folder body
    push(w - 4 - i, tabH + i);
    push(w - 4 - i, tabH + 2 + i);
    push(w - 2 - i, tabH + 2 + i);
    push(w - 2 - i, tabH + 4 + i);
    push(w - i, tabH + 4 + i);
  }

  // Down right edge to bottom-right corner
  if (flushBottom) {
    push(w - i, h - i);
  } else {
    push(w - i, h - 4 - i);
    push(w - 2 - i, h - 4 - i);
    push(w - 2 - i, h - 2 - i);
    push(w - 4 - i, h - 2 - i);
    push(w - 4 - i, h - i);
    // Across bottom edge to bottom-left corner
    push(4 + i, h - i);
    push(4 + i, h - 2 - i);
    push(2 + i, h - 2 - i);
    push(2 + i, h - 4 - i);
  }

  return `${pts.join(' ')} Z`;
}

function buildRightTabPolygon(w, rTop, rBot, rWidth, inset, overlapSeam, fullBleed) {
  const i = inset;
  const x0 = fullBleed ? w + i : (overlapSeam ? w - i : w);
  return [
    `M${x0},${rTop + i}`,
    `L${w + rWidth - 4 - i},${rTop + i}`,
    `L${w + rWidth - 4 - i},${rTop + 2 + i}`,
    `L${w + rWidth - 2 - i},${rTop + 2 + i}`,
    `L${w + rWidth - 2 - i},${rTop + 4 + i}`,
    `L${w + rWidth - i},${rTop + 4 + i}`,
    `L${w + rWidth - i},${rBot - 4 - i}`,
    `L${w + rWidth - 2 - i},${rBot - 4 - i}`,
    `L${w + rWidth - 2 - i},${rBot - 2 - i}`,
    `L${w + rWidth - 4 - i},${rBot - 2 - i}`,
    `L${w + rWidth - 4 - i},${rBot - i}`,
    `L${x0},${rBot - i}`,
    'Z',
  ].join(' ');
}

function buildInnerPaperPolygon(pL, pT, pR, pB, foldSize, inset, flushBottom) {
  const i = inset;
  const f = foldSize;
  const pts = [];
  const push = (x, y) => pts.push(`${pts.length ? 'L' : 'M'}${x},${y}`);

  // Start at bottom-left of paper sheet
  if (flushBottom) {
    push(pL + i, pB - i);
  } else {
    push(pL + i, pB - 4 - i);
  }

  // Up to top-left stepped corner
  push(pL + i, pT + 4 + i);
  push(pL + 2 + i, pT + 4 + i);
  push(pL + 2 + i, pT + 2 + i);
  push(pL + 4 + i, pT + 2 + i);
  push(pL + 4 + i, pT + i);

  // Top edge up to dog-ear fold start
  const foldStartX = pR - f;
  const foldEndY = pT + f;
  push(foldStartX, pT + i);

  // Stepped diagonal along the dog-ear cut (4px steps)
  const steps = Math.floor(f / 4);
  for (let s = 1; s <= steps; s += 1) {
    const sx = foldStartX + s * 4;
    const sy = pT + s * 4;
    push(sx - 4, sy);
    push(sx, sy);
  }

  // Down right edge of paper sheet
  push(pR - i, foldEndY);
  if (flushBottom) {
    push(pR - i, pB - i);
  } else {
    push(pR - i, pB - 4 - i);
    push(pR - 2 - i, pB - 4 - i);
    push(pR - 2 - i, pB - 2 - i);
    push(pR - 4 - i, pB - 2 - i);
    push(pR - 4 - i, pB - i);
    // Bottom edge
    push(pL + 4 + i, pB - i);
    push(pL + 4 + i, pB - 2 - i);
    push(pL + 2 + i, pB - 2 - i);
    push(pL + 2 + i, pB - 4 - i);
  }

  return `${pts.join(' ')} Z`;
}

function buildFoldFlapPaths(pR, pT, foldSize) {
  const f = foldSize;
  const x0 = pR - f;
  const y0 = pT;
  const steps = Math.floor(f / 4);

  // Outer wine border of the dog-ear triangle flap
  const outer = [`M${x0},${y0}`, `L${x0},${y0 + f}`, `L${pR},${y0 + f}`];
  for (let s = steps; s >= 1; s -= 1) {
    outer.push(`L${x0 + s * 4},${y0 + (s - 1) * 4}`);
    outer.push(`L${x0 + (s - 1) * 4},${y0 + (s - 1) * 4}`);
  }
  outer.push('Z');

  // Inner cherry fill of the dog-ear flap (inset 2px on left & bottom)
  const inner = [`M${x0 + 2},${y0 + 4}`, `L${x0 + 2},${y0 + f - 2}`, `L${pR - 4},${y0 + f - 2}`];
  for (let s = steps - 1; s >= 1; s -= 1) {
    inner.push(`L${x0 + s * 4},${y0 + s * 4}`);
    inner.push(`L${x0 + (s - 1) * 4 + 2},${y0 + s * 4}`);
  }
  inner.push('Z');

  // Hard shadow directly beneath the dog-ear flap
  const shadow = `M${x0 + 2},${y0 + f} H${pR} V${y0 + f + 4} H${x0 + 4} V${y0 + f + 2} H${x0 + 2} Z`;

  return {
    outer: outer.join(' '),
    inner: inner.join(' '),
    shadow,
  };
}

export function SteppedFieldFrame({ children, className = '' }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    return observeSize(el, rect => {
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      setSize(prev => (prev?.width === width && prev?.height === height ? prev : { width, height }));
    });
  }, []);

  const w = size?.width || 0;
  const h = size?.height || 0;
  const outer = w >= 16 && h >= 16
    ? `M2,0 H${w - 2} V2 H${w} V${h - 2} H${w - 2} V${h} H2 V${h - 2} H0 V2 H2 Z`
    : '';
  const inner = w >= 16 && h >= 16
    ? `M4,2 H${w - 4} V4 H${w - 2} V${h - 4} H${w - 4} V${h - 2} H4 V${h - 4} H2 V4 H4 Z`
    : '';

  return (
    <div ref={ref} className={`sandbox-stepped-field ${w >= 16 ? 'has-svg' : ''} ${className}`}>
      {w >= 16 && h >= 16 && (
        <svg
          className="sandbox-stepped-field-svg"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden="true"
          focusable="false"
          shapeRendering="crispEdges"
        >
          <path d={outer} fill="var(--color-wine)" />
          <path d={inner} fill="var(--color-vanilla)" />
        </svg>
      )}
      {children}
    </div>
  );
}

export function ReportStickerIcon({ className = '' }) {
  return (
    <svg
      className={`sandbox-report-sticker ${className}`}
      width="48"
      height="52"
      viewBox="0 0 48 52"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {/* Hard offset shadow */}
      <path
        d="M10 6h30v4h2v34h-4v4H8v-4H6V10h4V6z"
        fill="var(--color-sand)"
        transform="translate(2 4)"
      />
      {/* Outer vanilla sticker rim */}
      <path
        d="M8 2h32v4h2v36h-4v4H6v-4H4V6h4V2z"
        fill="var(--color-vanilla)"
      />
      {/* Wine outline of tilted sheet */}
      <path
        d="M10 4h28v2h2v34h-2v2H8v-2H6V8h2V6h2V4z"
        fill="var(--color-wine)"
      />
      {/* Inner vanilla paper face */}
      <path
        d="M12 6h24v2h2v30h-2v2H10v-2H8V10h2V8h2V6z"
        fill="var(--color-vanilla)"
      />
      {/* Gold square stamp in upper-left */}
      <rect x="12" y="10" width="10" height="10" fill="var(--color-wine)" />
      <rect x="14" y="12" width="6" height="6" fill="var(--color-gold)" />
      {/* Header lines next to gold square */}
      <rect x="24" y="12" width="10" height="2" fill="var(--color-wine)" />
      <rect x="24" y="16" width="8" height="2" fill="var(--color-wine)" />
      {/* Body lines across paper */}
      <rect x="12" y="24" width="22" height="2" fill="var(--color-wine)" />
      <rect x="12" y="28" width="20" height="2" fill="var(--color-wine)" />
      <rect x="12" y="32" width="16" height="2" fill="var(--color-cherry)" />
      <rect x="12" y="36" width="12" height="2" fill="var(--color-wine)" />
    </svg>
  );
}

export function FolderCard({
  id,
  label,
  folderIndex = 0,
  totalFolders = 4,
  state = 'open', // 'open' | 'behind' | 'slid-away'
  active = true,
  showRightTab = true,
  rightTabSequenced = false,
  fullBleed = false,
  hasLeftRail = false,
  onSelectTopTab,
  onSelectRightTab,
  onTabKeyDown,
  topTabId,
  panelId,
  children,
  className = '',
}) {
  const containerRef = useRef(null);
  const topTabRef = useRef(null);
  const [box, setBox] = useState({ width: 390, height: 480, tabH: 44 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    return observeSize(el, rect => {
      const width = Math.max(220, Math.round(rect.width));
      const height = Math.max(180, Math.round(rect.height));
      setBox(prev => (
        prev.width === width && prev.height === height
          ? prev
          : { width, height, tabH: 44 }
      ));
    });
  }, []);

  const { width: w, height: h, tabH } = box;
  const rWidth = fullBleed ? 30 : 32;

  // Compute horizontal slot for the top tab (4 sequential slots: Report, Received, In progress, Resolved)
  const slotW = Math.floor((w - 4) / totalFolders);
  const tabL = folderIndex * slotW;
  const tabR = folderIndex === totalFolders - 1 ? w - 4 : (folderIndex + 1) * slotW + 2;
  const tabW = tabR - tabL;

  // Compute vertical slot for the right-edge tab (sequenced top-to-bottom along the left edge when slid away)
  const seqSlotH = 104;
  const seqGap = 4;
  const rawRTop = rightTabSequenced
    ? tabH + 8 + folderIndex * (seqSlotH + seqGap)
    : tabH + 18;
  const rTop = Math.min(rawRTop, Math.max(tabH + 8, h - seqSlotH - 8));
  const rBot = Math.min(h - 6, rTop + seqSlotH);

  // Inner vanilla paper coordinates (inset on the left when vertical tabs occupy the left rail)
  const leftRailOffset = hasLeftRail ? rWidth : 0;
  const pL = leftRailOffset + 8;
  const pR = w - 8;
  const pT = tabH + 8;
  const pB = fullBleed ? h : h - 8;
  const foldSize = 24;

  const isSlidAway = state === 'slid-away';
  const isOpen = state === 'open';
  const overlapSeam = !fullBleed || isSlidAway;

  const jacketOuter = buildJacketPolygon(w, h, tabH, tabL, tabR, 0, fullBleed);
  const jacketFill = buildJacketPolygon(w, h, tabH, tabL, tabR, 2, fullBleed);
  const rightTabOuter = showRightTab ? buildRightTabPolygon(w, rTop, rBot, rWidth, 0, overlapSeam, fullBleed) : '';
  const rightTabFill = showRightTab ? buildRightTabPolygon(w, rTop, rBot, rWidth, 2, overlapSeam, fullBleed) : '';
  const paperOuter = buildInnerPaperPolygon(pL, pT, pR, pB, foldSize, 0, fullBleed);
  const paperFill = buildInnerPaperPolygon(pL, pT, pR, pB, foldSize, 2, fullBleed);
  const foldPaths = buildFoldFlapPaths(pR, pT, foldSize);

  const svgW = w + (showRightTab ? rWidth : 0) + 6;
  const svgH = h + 6;

  // Z-index order: earlier slid-away folders sit above the open folder so their right-edge vertical tabs
  // are visible and clickable along the left rail; behind folders sit below the open folder.
  const zOrder = isSlidAway ? 12 - folderIndex : isOpen ? 6 : 5 - folderIndex;

  return (
    <div
      ref={containerRef}
      id={panelId}
      role={panelId ? 'tabpanel' : undefined}
      aria-labelledby={panelId && topTabId ? (isSlidAway ? `${topTabId}-vertical` : topTabId) : undefined}
      className={`sandbox-folder-card is-${state} ${active ? 'is-active' : 'is-inactive'} ${fullBleed ? 'is-full-bleed' : ''} ${hasLeftRail ? 'has-left-rail' : ''} ${className}`}
      style={{
        '--folder-tab-h': `${tabH}px`,
        '--folder-right-tab-w': `${rWidth}px`,
        '--folder-left-rail': `${leftRailOffset}px`,
        zIndex: fullBleed ? zOrder : undefined,
      }}
      data-folder-id={id}
      data-folder-state={state}
    >
      {/* Decorative SVG silhouette: stepped outline, jacket rim, inner paper, cherry folded corner, and both tab shapes */}
      <svg
        className="sandbox-folder-svg"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        aria-hidden="true"
        focusable="false"
        shapeRendering="crispEdges"
      >
        {/* Hard offset shadow (+4px, +4px) */}
        {!fullBleed && (
          <path
            className="folder-svg-shadow"
            d={`${jacketOuter} ${rightTabOuter}`}
            transform="translate(4 4)"
          />
        )}
        {/* 2px Wine outer border around folder jacket + top tab */}
        <path className="folder-svg-ink" d={jacketOuter} />
        {/* Folder jacket fill: Gold when active/open, Sand when behind or slid-away */}
        <path
          className={active && isOpen ? 'folder-svg-jacket-active' : 'folder-svg-jacket-inactive'}
          d={jacketFill}
        />

        {/* Right-edge vertical tab shape */}
        {showRightTab && (
          <g className="folder-svg-right-tab-group">
            {isSlidAway && (
              <path
                className="folder-svg-shadow"
                d={rightTabOuter}
                transform="translate(2 3)"
              />
            )}
            <path className="folder-svg-ink" d={rightTabOuter} />
            <path
              className={active && isOpen ? 'folder-svg-jacket-active' : 'folder-svg-jacket-inactive'}
              d={rightTabFill}
            />
          </g>
        )}

        {/* Inner Vanilla paper sheet + stepped Cherry corner fold (rendered when open) */}
        {isOpen && pB > pT + 36 && (
          <g className="folder-svg-paper-group">
            <path className="folder-svg-ink" d={paperOuter} />
            <path className="folder-svg-paper" d={paperFill} />
            <path className="folder-svg-fold-shadow" d={foldPaths.shadow} />
            <path className="folder-svg-ink" d={foldPaths.outer} />
            <path className="folder-svg-fold" d={foldPaths.inner} />
          </g>
        )}
      </svg>

      {/* Top horizontal tab button (separate live HTML button over the SVG top tab shape) */}
      <button
        ref={topTabRef}
        id={topTabId}
        type="button"
        aria-pressed={active && isOpen}
        tabIndex={isSlidAway ? -1 : 0}
        aria-hidden={isSlidAway ? 'true' : undefined}
        className={`sandbox-folder-top-tab ${active && isOpen ? 'is-selected' : ''}`}
        style={{
          left: `${tabL}px`,
          width: `${tabW}px`,
          minHeight: `${tabH}px`,
        }}
        onClick={() => onSelectTopTab?.(id, folderIndex)}
        onKeyDown={event => onTabKeyDown?.(event, folderIndex)}
      >
        <span className="sandbox-folder-tab-text">{label}</span>
      </button>

      {/* Right-edge vertical tab button (separate live HTML button over the SVG right-edge tab shape) */}
      {showRightTab && (
        <button
          id={topTabId ? `${topTabId}-vertical` : undefined}
          type="button"
          role={topTabId && isSlidAway ? 'tab' : undefined}
          aria-selected={topTabId && isSlidAway ? false : undefined}
          aria-controls={topTabId && panelId && isSlidAway ? panelId : undefined}
          className={`sandbox-folder-right-tab ${isSlidAway ? 'is-exposed' : ''}`}
          style={{
            top: `${rTop}px`,
            height: `${rBot - rTop}px`,
            width: `${Math.max(44, rWidth)}px`,
            minWidth: '44px',
            minHeight: '44px',
          }}
          tabIndex={isSlidAway || !topTabId ? 0 : -1}
          aria-hidden={!isSlidAway && Boolean(topTabId) ? 'true' : undefined}
          aria-label={`${label} (vertical folder tab)`}
          onClick={() => (onSelectRightTab || onSelectTopTab)?.(id, folderIndex)}
          onKeyDown={event => onTabKeyDown?.(event, folderIndex)}
        >
          <span className="sandbox-folder-right-tab-text">{label}</span>
        </button>
      )}

      {/* Live HTML content inside the inner Vanilla paper sheet */}
      <div
        className="sandbox-folder-body"
        hidden={!isOpen}
        aria-hidden={!isOpen ? 'true' : undefined}
      >
        {children}
      </div>
    </div>
  );
}
