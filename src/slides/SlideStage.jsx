import React, { useEffect, useRef } from 'react';
import './SlideStage.css';

/**
 * SlideStage maintains a locked 1920x1080 canvas (16:9)
 * and uses ResizeObserver to calculate CSS variable --slide-scale
 * so it fits any screen or window without text-wrapping changes.
 */
export function SlideStage({ children, className = '' }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height) {
          const scale = Math.min(width / 1920, height / 1080);
          if (stageRef.current) {
            stageRef.current.style.setProperty('--slide-scale', scale);
          }
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="slide-viewport-container" ref={containerRef}>
      <div className={`slide-stage-16-9 ${className}`} ref={stageRef}>
        {children}
      </div>
    </div>
  );
}

/**
 * Top-left UNITEN logo badge, rendered consistently across slides.
 */
export function SlideUnitenBadge({ variant = 'vanilla' }) {
  return (
    <div className={`slide-uniten-badge ${variant}`}>
      <img src="/assets/slides/uniten-logo.png" alt="UNITEN — Universiti Tenaga Nasional" />
    </div>
  );
}

/**
 * Official Sime Darby Property Hackathon Section Badge.
 */
export function SlideSdpTag({ section, variant = 'gold' }) {
  if (!section) return null;
  return (
    <div className={`slide-sdp-badge ${variant}`}>
      <span>{section}</span>
    </div>
  );
}

/**
 * AS-18 Pixel Art Icon component.
 */
export function SlideIcon({ name, size = 32, color = 'currentColor', className = '' }) {
  return (
    <svg
      className={`slide-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      style={{ display: 'inline-block', verticalAlign: 'middle', color, shapeRendering: 'crispEdges' }}
      aria-hidden="true"
    >
      <use href={`/assets/ui/icons.svg#icon-${name}`} />
    </svg>
  );
}

/**
 * Reusable Pixel-Sticker Card with stepped 4px/8px corners, wine border, and solid shadow.
 */
export function SlideStickerCard({ children, surface = 'vanilla', className = '', style = {} }) {
  return (
    <div className={`slide-card-sticker ${surface} ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Reusable Folded-Tab Card with stepped cherry corner accent.
 */
export function SlideFoldedCard({ children, surface = 'vanilla', className = '', style = {} }) {
  return (
    <div className={`slide-card-sticker ${surface} ${className}`} style={style}>
      <div className="slide-folded-accent" />
      {children}
    </div>
  );
}

/**
 * Reusable Ticket Badge / Header Plaque with side bite cutouts.
 */
export function SlideTicketBadge({ children, surface = 'gold', className = '', style = {} }) {
  return (
    <div className={`slide-ticket-pill ${surface} ${className}`} style={style}>
      {children}
    </div>
  );
}
