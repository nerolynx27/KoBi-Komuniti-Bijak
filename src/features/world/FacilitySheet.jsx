import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StatusBadge } from '../../components/ui/Feedback.jsx';
import { formatMalaysiaDateTime } from '../activities/dateTime.js';

const stateLabels = {
  normal: 'Normal',
  reported: 'Reported',
  repairing: 'Work in progress',
};

export function FacilitySheet({ object, navigate, closeModal, onClose = closeModal }) {
  if (!object) return null;

  const close = onClose || closeModal;

  function go(target) {
    if (close) close();
    if (navigate) navigate(target);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && close) {
      close();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && close) {
      close();
    }
  }

  const reportHistory = object.reportHistory || [];
  const activities = object.activities || [];

  return (
    <div
      className="facility-sheet"
      tabIndex={-1}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={object.name}
    >
      <div className="facility-sheet-content section-stack">
        {/* Badges Bar */}
        <div className="sheet-badges">
          {object.isUserHome && (
            <span className="badge-pill badge-home">
              <Icon name="map" /> My House
            </span>
          )}
          <span className={`badge-pill facility-condition state-${object.state}`}>
            ● {stateLabels[object.state] || 'Normal'}
          </span>
          {object.distanceText && (
            <span className="badge-pill badge-distance">
              🚶 {object.distanceText}
            </span>
          )}
        </div>

        {/* Description / Summary */}
        <p className="facility-description">
          {object.description ||
            (object.isUserHome
              ? 'This is your private registered residence. Community issue reporting applies to shared public facilities.'
              : object.facilityId
                ? 'A shared neighbourhood facility in Elmina West (Seksyen U16). Public condition is based on active reports; report details stay in the demo report views.'
                : 'This decorative object is part of the neighbourhood schematic. It has no reporting or activity actions.')}
        </p>

        {/* Report History Timeline */}
        {reportHistory.length > 0 && (
          <section className="sheet-section">
            <h3 className="section-title">
              <Icon name="clock" /> Maintenance &amp; Report History
            </h3>
            <div className="history-timeline">
              {reportHistory.map(entry => (
                <div key={entry.id} className="history-entry">
                  <div className="history-meta">
                    <span className={`history-status state-${entry.status}`}>
                      {entry.status.toUpperCase()}
                    </span>
                    <span className="history-date">
                      {entry.date || entry.created_at
                        ? new Date(entry.date || entry.created_at).toLocaleDateString('en-MY', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                  <p className="history-note">{entry.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Scheduled Activities */}
        {activities.length > 0 && (
          <section className="sheet-section">
            <h3 className="section-title">
              <Icon name="calendar" /> {activities.length > 1 ? 'Choose an activity' : 'Activity at this place'}
            </h3>
            <div className="activity-cards">
              {activities.map(activity => (
                <div className="record-row" key={activity.id}>
                  <h3>{activity.title}</h3>
                  <StatusBadge status={activity.status} />
                  <p className="helper">{formatMalaysiaDateTime(activity.starts_at)}</p>
                  <Button icon="activity" onClick={() => go(`activities/${activity.id}`)}>
                    View activity
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Button */}
        <div className="sheet-actions">
          {object.reportable ? (
            <Button
              variant="primary"
              icon="report"
              onClick={() => go(`reports/new?facility=${encodeURIComponent(object.facilityId)}`)}
            >
              Report a problem
            </Button>
          ) : object.isUserHome ? (
            <p className="action-hint">
              This is your private registered residence. Community issue reporting applies to shared public facilities.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
