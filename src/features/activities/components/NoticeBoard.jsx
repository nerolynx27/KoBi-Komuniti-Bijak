import {
  ActivityMiniPosterSvg,
  buildSteppedRect,
} from './ActivityIllustrations.jsx';

export function PixelBinderClip({ className = '' }) {
  return (
    <svg
      className={`act-binder-clip ${className}`}
      width="40"
      height="30"
      viewBox="0 0 40 30"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {/* Top wire loop */}
      <rect x="12" y="0" width="16" height="3" fill="var(--color-wine)" />
      <rect x="9" y="3" width="3" height="9" fill="var(--color-wine)" />
      <rect x="28" y="3" width="3" height="9" fill="var(--color-wine)" />
      <rect x="12" y="3" width="16" height="8" fill="var(--color-vanilla)" />
      {/* Stepped lower clip jaw */}
      <path d={buildSteppedRect(2, 10, 36, 18, 3)} fill="var(--color-wine)" />
      <path d={buildSteppedRect(5, 13, 30, 12, 2)} fill="var(--color-sand)" />
      <rect x="7" y="14" width="26" height="2" fill="var(--color-vanilla)" />
      <rect x="16" y="11" width="8" height="14" fill="var(--color-wine)" />
      <rect x="18" y="13" width="4" height="10" fill="var(--color-gold)" />
    </svg>
  );
}

export function PixelPushpin() {
  return (
    <svg
      className="act-pushpin-svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {/* Pin shadow & needle tip */}
      <rect x="11" y="20" width="4" height="5" fill="var(--color-wine)" />
      <rect x="12" y="20" width="2" height="3" fill="var(--color-vanilla)" />
      {/* Lower collar */}
      <path d={buildSteppedRect(6, 12, 14, 9, 2)} fill="var(--color-wine)" />
      <rect x="8" y="14" width="10" height="5" fill="var(--color-cherry)" />
      {/* Top cap */}
      <path d={buildSteppedRect(4, 2, 18, 12, 3)} fill="var(--color-wine)" />
      <path d={buildSteppedRect(7, 5, 12, 6, 2)} fill="var(--color-cherry)" />
      <rect x="9" y="6" width="5" height="2" fill="var(--color-gold)" />
    </svg>
  );
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'ALL', accessibleLabel: 'All' },
  { id: 'community', label: 'COMMUNITY', accessibleLabel: 'Community' },
  { id: 'recycling', label: 'RECYCLING', accessibleLabel: 'Recycling' },
  { id: 'joined', label: 'JOINED', accessibleLabel: 'Joined' },
];

export function NoticeBoard({
  activities = [],
  activeFilter = 'all',
  onFilterChange,
  onSelectActivity,
}) {
  return (
    <section
      className="act-notice-board-section"
      aria-label="2026 Township Activities Notice Board"
    >
      {/* Top Hanging Binder Clips */}
      <div className="act-board-clips-row" aria-hidden="true">
        <PixelBinderClip className="act-board-clip-left" />
        <PixelBinderClip className="act-board-clip-right" />
      </div>

      {/* Stepped Folder-Style Frame matching Reports Section */}
      <div className="act-notice-board-frame">
        <div className="act-notice-board-surface">
          {/* Board Top Context Strip: Filter pills + 2026 Year Stamp on single row */}
          <div className="act-board-header-row">
            <div
              className="act-board-filters"
              role="group"
              aria-label="Filter activities by category"
            >
              {FILTER_OPTIONS.map(option => {
                const isSelected = activeFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-filter={option.id}
                    className={`act-filter-chip ${isSelected ? 'is-selected' : ''}`}
                    aria-pressed={isSelected}
                    aria-label={option.accessibleLabel || option.label}
                    onClick={() => onFilterChange?.(option.id)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <span className="act-board-year-label">2026</span>
          </div>

          {/* Staggered Pinned Mini-Poster Notes */}
          {activities.length === 0 ? (
            <div className="act-board-empty">
              <p className="act-board-empty-title">NO PINNED NOTES IN THIS FILTER</p>
              <p className="act-board-empty-copy">
                Switch back to ALL to view upcoming Community and Recycling flyers.
              </p>
            </div>
          ) : (
            <div className="act-pinned-notes-grid">
              {activities.map((activity, idx) => {
                const statusSuffix = activity.joined ? ', Joined' : '';
                const ariaLabel = `${activity.title}, ${activity.categoryLabel} activity on ${activity.dateLabel}, ${activity.participantCount} joined${statusSuffix}`;
                return (
                  <div key={activity.id} className="act-pinned-note-wrapper">
                    <button
                      type="button"
                      className={`act-pinned-note note-theme-${activity.noteTheme} note-slot-${idx + 1} ${
                        activity.joined ? 'is-joined' : ''
                      }`}
                      style={{ '--note-tilt': `${activity.tiltDeg || 0}deg` }}
                      aria-label={ariaLabel}
                      onClick={event => onSelectActivity?.(activity, event.currentTarget)}
                    >
                      <span className="act-note-pin-anchor" aria-hidden="true">
                        <PixelPushpin />
                      </span>

                      {/* Category top header band for Recycling notes */}
                      {(activity.noteTheme === 'sand-cherry' ||
                        activity.noteTheme === 'vanilla-cherry') && (
                        <span className="act-note-cherry-cap" aria-hidden="true" />
                      )}

                      {/* Folded pixel corner for Gold Community notes */}
                      {activity.noteTheme === 'gold' && (
                        <span className="act-note-folded-corner" aria-hidden="true" />
                      )}

                      <div className="act-note-illustration-wrap">
                        <ActivityMiniPosterSvg
                          artworkKey={activity.artworkKey}
                          title={activity.title}
                        />
                      </div>

                      <span className="act-note-title">{activity.title}</span>
                      <span className="act-note-date">{activity.dateLabel}</span>

                      <div className="act-note-footer">
                        <span
                          className={`act-note-category-badge is-${activity.category}`}
                        >
                          {activity.categoryLabel}
                        </span>
                        <span className="act-note-participants">
                          {activity.participantCount} joined
                        </span>
                      </div>

                      {activity.joined && (
                        <span className="act-note-joined-stamp">JOINED</span>
                      )}
                    </button>
                    {activity.isStoreActivity && activity.id && (
                      <a
                        href={`#activities/${activity.id}`}
                        className="act-note-direct-link"
                        aria-label={activity.title}
                      >
                        {activity.title}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
