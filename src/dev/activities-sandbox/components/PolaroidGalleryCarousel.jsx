import { useEffect, useRef, useState } from 'react';
import {
  ActivityMiniPosterSvg,
  buildSteppedRect,
} from './ActivityIllustrations.jsx';

function PolaroidStringClip() {
  return (
    <svg
      className="act-polaroid-clip-svg"
      width="24"
      height="26"
      viewBox="0 0 24 26"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {/* Top wire loop gripping the string */}
      <rect x="7" y="0" width="10" height="3" fill="var(--color-wine)" />
      <rect x="5" y="3" width="3" height="7" fill="var(--color-wine)" />
      <rect x="16" y="3" width="3" height="7" fill="var(--color-wine)" />
      <rect x="8" y="3" width="8" height="5" fill="var(--color-vanilla)" />
      {/* Stepped peg body */}
      <path d={buildSteppedRect(3, 8, 18, 16, 2)} fill="var(--color-wine)" />
      <rect x="6" y="11" width="12" height="10" fill="var(--color-cherry)" />
      <rect x="7" y="12" width="10" height="3" fill="var(--color-gold)" />
      <rect x="10" y="15" width="4" height="6" fill="var(--color-wine)" />
    </svg>
  );
}

function PixelArrowIcon({ direction }) {
  const isLeft = direction === 'prev';
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {isLeft ? (
        <path
          d="M 15,4 H 11 V 8 H 7 V 10 H 5 V 14 H 7 V 16 H 11 V 20 H 15 V 16 H 11 V 14 H 9 V 10 H 11 V 8 H 15 Z"
          fill="var(--color-wine)"
        />
      ) : (
        <path
          d="M 9,4 H 13 V 8 H 17 V 10 H 19 V 14 H 17 V 16 H 13 V 20 H 9 V 16 H 13 V 14 H 15 V 10 H 13 V 8 H 9 Z"
          fill="var(--color-wine)"
        />
      )}
    </svg>
  );
}

// Evaluate quadratic Bezier y(t) for M 0,10 Q 240,42 480,10
function getCatenaryY(t) {
  const y0 = 10;
  const y1 = 42;
  const y2 = 10;
  const oneMinusT = 1 - t;
  return oneMinusT * oneMinusT * y0 + 2 * oneMinusT * t * y1 + t * t * y2;
}

// Base resting tilt angle along the sagging string
function getCatenaryBaseTilt(slotOffset) {
  if (slotOffset < -0.15) return 5;
  if (slotOffset > 0.15) return -5;
  return 0;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function PolaroidGalleryCarousel({
  items = [],
  selectedId = null,
  onSelectPolaroid,
}) {
  const [startIndex, setStartIndex] = useState(0);
  const [swingAngle, setSwingAngle] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const dragStateRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    moved: false,
  });
  const animFrameRef = useRef(null);

  const maxStartIndex = Math.max(0, items.length - 3);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  function triggerSwingImpulse(initialDegrees) {
    if (prefersReducedMotion()) {
      setSwingAngle(0);
      return;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    let angle = initialDegrees;
    let velocity = 0;
    const stiffness = 0.16;
    const damping = 0.82;

    function step() {
      const force = -stiffness * angle;
      velocity = (velocity + force) * damping;
      angle += velocity;

      if (Math.abs(angle) < 0.15 && Math.abs(velocity) < 0.15) {
        setSwingAngle(0);
        animFrameRef.current = null;
        return;
      }

      setSwingAngle(angle);
      animFrameRef.current = requestAnimationFrame(step);
    }

    setSwingAngle(angle);
    animFrameRef.current = requestAnimationFrame(step);
  }

  function handleSlideBy(delta) {
    if (items.length <= 3) {
      triggerSwingImpulse(delta > 0 ? -7 : 7);
      return;
    }
    setStartIndex(prev => {
      const next = (prev + delta + (maxStartIndex + 1)) % (maxStartIndex + 1);
      return next;
    });
    triggerSwingImpulse(delta > 0 ? -9 : 9);
  }

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      lastX: event.clientX,
      moved: false,
    };
  }

  function handlePointerMove(event) {
    if (!dragStateRef.current.active) return;
    const dx = event.clientX - dragStateRef.current.startX;
    if (Math.abs(dx) > 6) {
      dragStateRef.current.moved = true;
    }
    const clampedDx = Math.max(-48, Math.min(48, dx));
    setDragDeltaX(clampedDx);
    if (!prefersReducedMotion()) {
      setSwingAngle(Math.max(-10, Math.min(10, dx * 0.18)));
    }
    dragStateRef.current.lastX = event.clientX;
  }

  function handlePointerUp() {
    if (!dragStateRef.current.active) return;
    const totalDx = dragStateRef.current.lastX - dragStateRef.current.startX;
    dragStateRef.current.active = false;
    setDragDeltaX(0);

    if (totalDx <= -36) {
      handleSlideBy(1);
    } else if (totalDx >= 36) {
      handleSlideBy(-1);
    } else if (Math.abs(totalDx) > 4) {
      triggerSwingImpulse(totalDx * 0.2);
    } else {
      setSwingAngle(0);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handleSlideBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleSlideBy(1);
    }
  }

  const visibleItems = items.slice(startIndex, startIndex + 3);
  const slotPositions = [0.17, 0.5, 0.83];

  return (
    <section
      className="act-gallery-section"
      aria-label="Completed activities Polaroid gallery"
      onKeyDown={handleKeyDown}
    >
      {/* Section Header Row */}
      <div className="act-gallery-header-row">
        <button
          type="button"
          className="act-gallery-arrow-btn"
          aria-label="Previous gallery photos"
          onClick={() => handleSlideBy(-1)}
        >
          <PixelArrowIcon direction="prev" />
        </button>

        <h2 className="act-gallery-heading">GALLERY</h2>

        <button
          type="button"
          className="act-gallery-arrow-btn"
          aria-label="Next gallery photos"
          onClick={() => handleSlideBy(1)}
        >
          <PixelArrowIcon direction="next" />
        </button>
      </div>

      {/* Sagging Catenary Line Stage */}
      <div
        className="act-polaroid-line-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Curved Catenary String SVG */}
        <svg
          className="act-catenary-string-svg"
          viewBox="0 0 480 52"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M 0,10 Q 240,42 480,10"
            fill="none"
            stroke="var(--color-wine)"
            strokeWidth="5"
            strokeLinecap="square"
          />
        </svg>

        {/* Hanging Polaroids Row */}
        <div
          className="act-polaroid-hanging-row"
          style={{
            transform: dragDeltaX ? `translateX(${dragDeltaX * 0.35}px)` : undefined,
          }}
        >
          {visibleItems.map((item, slotIdx) => {
            const t = slotPositions[slotIdx] ?? 0.5;
            const stringY = getCatenaryY(t);
            const slotOffset = t - 0.5;
            const baseTilt = getCatenaryBaseTilt(slotOffset);
            const totalTilt = Number((baseTilt + swingAngle).toFixed(2));
            const isSelected = selectedId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`act-polaroid-card slot-${slotIdx} ${
                  isSelected ? 'is-selected' : ''
                }`}
                style={{
                  '--polaroid-drop': `${Math.round(stringY - 10)}px`,
                  '--polaroid-tilt': `${totalTilt}deg`,
                }}
                aria-label={`${item.code} ${item.title} — ${item.shortCaption}, ${item.dateLabel}`}
                onClick={event => {
                  if (dragStateRef.current.moved) {
                    dragStateRef.current.moved = false;
                    return;
                  }
                  onSelectPolaroid?.(item, event.currentTarget);
                }}
              >
                <span className="act-polaroid-clip-wrap" aria-hidden="true">
                  <PolaroidStringClip />
                </span>

                <div className="act-polaroid-frame">
                  <div className="act-polaroid-photo-window">
                    <ActivityMiniPosterSvg
                      artworkKey={item.artworkKey}
                      title={item.title}
                    />
                  </div>
                  <div className="act-polaroid-caption-strip">
                    <span className="act-polaroid-caption">{item.shortCaption}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
