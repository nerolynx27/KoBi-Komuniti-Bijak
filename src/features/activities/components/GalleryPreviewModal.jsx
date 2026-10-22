import { useEffect, useRef } from 'react';
import { ActivityMiniPosterSvg } from './ActivityIllustrations.jsx';

export function GalleryPreviewModal({ item, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    const rafId = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="act-modal-backdrop is-gallery-preview-backdrop"
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="act-modal-card act-gallery-preview-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="act-gallery-modal-title"
      >
        {/* Top Metadata Row: Category Pill + Event Date (Set 1 Modal Layout) */}
        <div className="act-gallery-preview-top act-gallery-modal-top-row">
          <span
            className={`act-modal-badge act-sticker-pill is-${item.category}`}
          >
            {item.categoryLabel}
          </span>
          <span className="act-gallery-preview-date act-gallery-modal-date">
            {item.dateLabel}
          </span>
        </div>

        {/* Centered Bungee Heading */}
        <h2
          id="act-gallery-modal-title"
          className="act-gallery-preview-title act-gallery-modal-title"
        >
          {item.title}
        </h2>

        {/* Framed Large 16-bit Pixel Illustration */}
        <div className="act-gallery-preview-photo-frame act-gallery-modal-photo-frame">
          <ActivityMiniPosterSvg
            artworkKey={item.artworkKey}
            title={item.title}
            large
          />
        </div>

        {/* Centered Summary Caption */}
        <p className="act-gallery-preview-summary act-gallery-modal-summary">
          {item.summary}
        </p>

        {/* Full-width Brick Red CLOSE PREVIEW Button */}
        <button
          ref={closeButtonRef}
          type="button"
          className="act-close-preview-btn act-sticker-btn is-close-preview-cherry"
          onClick={onClose}
        >
          CLOSE PREVIEW
        </button>
      </div>
    </div>
  );
}
