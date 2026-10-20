import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import {
  calculateDistanceMeters,
  formatWalkingDistance,
  getFacilityActivities,
  getFacilityReportHistory,
} from './worldboxData.js';

const stateLabels = {
  normal: 'Normal',
  reported: 'Reported',
  repairing: 'Work in progress',
};

export function WorldboxFacilitySheet({
  facility,
  location,
  userHome,
  isUserHome = false,
  onClose,
}) {
  if (!facility) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  const distanceMeters = userHome && location ? calculateDistanceMeters(userHome, location) : null;
  const distanceText = isUserHome
    ? 'Your registered home'
    : distanceMeters !== null
      ? formatWalkingDistance(distanceMeters)
      : null;

  const reportHistory = getFacilityReportHistory(facility.id);
  const activities = getFacilityActivities(facility.id);

  return (
    <div
      className="worldbox-sheet-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={facility.name}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="worldbox-sheet">
        <div className="sheet-header">
          <div className="sheet-title-group">
            <span className="sheet-eyebrow">
              <Icon name="location" /> {facility.category || 'Amenity'}
            </span>
            <h2 className="sheet-title">{facility.name}</h2>
          </div>
          <button type="button" className="sheet-close-btn" onClick={onClose} aria-label="Close sheet">
            ✕
          </button>
        </div>

        <div className="sheet-badges">
          {isUserHome && (
            <span className="badge-pill badge-home">
              <Icon name="map" /> My House
            </span>
          )}
          <span className={`badge-pill state-${facility.state}`}>
            ● {stateLabels[facility.state] || 'Normal'}
          </span>
          {distanceText && (
            <span className="badge-pill badge-distance">
              🚶 {distanceText}
            </span>
          )}
        </div>

        <div className="sheet-body">
          <p className="sheet-description">{facility.description}</p>

          {/* Report History */}
          <section className="sheet-section">
            <h3 className="section-title">
              <Icon name="history" /> Maintenance & Report History
            </h3>
            {reportHistory.length > 0 ? (
              <div className="history-timeline">
                {reportHistory.map(entry => (
                  <div key={entry.id} className="history-entry">
                    <div className="history-meta">
                      <span className={`history-status state-${entry.status}`}>
                        {entry.status.toUpperCase()}
                      </span>
                      <span className="history-date">
                        {new Date(entry.date).toLocaleDateString('en-MY', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="history-note">{entry.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-notice">No past maintenance reports on record for this facility.</p>
            )}
          </section>

          {/* Activities */}
          {activities.length > 0 && (
            <section className="sheet-section">
              <h3 className="section-title">
                <Icon name="calendar" /> Community Activities Here
              </h3>
              <div className="activity-cards">
                {activities.map(act => (
                  <div key={act.id} className="activity-card">
                    <strong>{act.title}</strong>
                    <span className="activity-time">
                      {new Date(act.starts_at).toLocaleString('en-MY', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action button */}
          <div className="sheet-actions">
            {facility.reportable ? (
              <Button
                variant="primary"
                icon="report"
                onClick={() => alert(`Report modal opened for: ${facility.name} (${facility.id})`)}
              >
                Report a problem here
              </Button>
            ) : (
              <p className="action-hint">
                {isUserHome
                  ? 'This is your private registered residence. Community issue reporting applies to shared public facilities.'
                  : 'Decorative or non-reportable component.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
