import { useEffect, useRef, useState } from 'react';
import { ActivityMiniPosterSvg } from './ActivityIllustrations.jsx';

export function ActivityDetailModal({ activity, onClose, onJoin, onLeave }) {
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const dialogRef = useRef(null);
  const primaryActionRef = useRef(null);

  useEffect(() => {
    setConfirmingLeave(false);
  }, [activity?.id, activity?.joined]);

  useEffect(() => {
    if (!activity) return undefined;
    const rafId = requestAnimationFrame(() => {
      primaryActionRef.current?.focus();
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
  }, [activity, onClose]);

  if (!activity) return null;

  return (
    <div
      className="act-modal-backdrop"
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="act-modal-card act-detail-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="act-detail-modal-title"
      >
        {/* Top Metadata & Close Row */}
        <div className="act-modal-top-row">
          <div className="act-modal-badges">
            <span className={`act-sticker-pill is-${activity.category}`}>
              {activity.categoryLabel}
            </span>
            {activity.joined && (
              <span className="act-sticker-pill is-joined-pill">Joined</span>
            )}
          </div>
          <button
            type="button"
            className="act-modal-icon-close"
            aria-label="Close activity details"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <h2 id="act-detail-modal-title" className="act-modal-title">
          {activity.title}
        </h2>

        <div className="act-modal-illustration-frame">
          <ActivityMiniPosterSvg
            artworkKey={activity.artworkKey}
            title={activity.title}
            large
          />
        </div>

        <div className="act-detail-meta-grid">
          <div className="act-detail-meta-item">
            <span className="act-detail-meta-label">DATE &amp; TIME</span>
            <strong className="act-detail-meta-value">
              {activity.dateLabel} · {activity.timeLabel}
            </strong>
          </div>
          <div className="act-detail-meta-item">
            <span className="act-detail-meta-label">LOCATION &amp; HOST</span>
            <strong className="act-detail-meta-value">
              {activity.location} · {activity.organizer}
            </strong>
          </div>
          <div className="act-detail-meta-item">
            <span className="act-detail-meta-label">PARTICIPATION</span>
            <strong className="act-detail-meta-value">
              {activity.participantCount} joined
            </strong>
          </div>
        </div>

        <p className="act-modal-summary">{activity.description}</p>

        {/* Action Bar: Join Activity or Confirmed Leave Activity */}
        {!activity.joined ? (
          <div className="act-modal-action-stack">
            <button
              ref={primaryActionRef}
              type="button"
              className="act-sticker-btn is-primary-gold"
              onClick={() => onJoin?.(activity.id)}
            >
              Join Activity
            </button>
          </div>
        ) : !confirmingLeave ? (
          <div className="act-modal-action-row">
            <button
              ref={primaryActionRef}
              type="button"
              className="act-sticker-btn is-quiet-sand"
              onClick={() => setConfirmingLeave(true)}
            >
              Leave Activity
            </button>
            <button
              type="button"
              className="act-sticker-btn is-primary-gold"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <div
            className="act-leave-confirm-box"
            role="group"
            aria-label="Confirm leaving activity"
          >
            <p className="act-leave-confirm-copy">
              Leave <strong>{activity.title}</strong>? Your spot will be reopened.
            </p>
            <div className="act-modal-action-row">
              <button
                type="button"
                className="act-sticker-btn is-danger-cherry"
                onClick={() => {
                  setConfirmingLeave(false);
                  onLeave?.(activity.id);
                }}
              >
                Confirm Leave
              </button>
              <button
                ref={primaryActionRef}
                type="button"
                className="act-sticker-btn is-quiet-sand"
                onClick={() => setConfirmingLeave(false)}
              >
                Keep Spot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
