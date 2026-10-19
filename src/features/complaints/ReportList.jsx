import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { Card, FeedbackState, StatusBadge } from '../../components/ui/Feedback.jsx';
import { FilterChip } from '../../components/ui/Selection.jsx';
import { selectComplaintDetail } from './complaintSelectors.js';
import { ReportsPage } from './ReportsPage.jsx';

export function ReportList(props) {
  const { data, actor, session, filters, setFilter, store, snapshot, notify, staff = false } = props;

  if (!staff && actor?.role !== 'resident') {
    return (
      <FeedbackState title="Resident demo view required">
        <Button onClick={() => session.setView('resident')}>Switch to resident demo</Button>
      </FeedbackState>
    );
  }

  // Resident view: Render the approved Pixel Stickers 4-folder assembly with facility carousel
  if (!staff) {
    return <ReportsPage {...props} />;
  }

  // Staff view: Render SDP staff complaint review list with filters and actions
  const filterName = 'staffReports';
  const filter = filters?.[filterName] || 'all';
  const rows = data.complaints.filter(
    item => selectComplaintDetail(data, item.id, actor) && (filter === 'all' || item.status === filter)
  );

  return (
    <div className="section-stack">
      <p className="page-intro">
        Review local demo reports and record maintenance actions. Sample data and browser-saved records.
      </p>
      <div className="form-actions">
        <Button
          disabled={Boolean(snapshot.pendingOperation)}
          onClick={() => {
            if (store.refresh()) notify('Reports refreshed from this browser.');
          }}
        >
          Refresh
        </Button>
      </div>
      {snapshot.pendingOperation && (
        <p className="helper">Retry or discard the pending change before refreshing.</p>
      )}
      <div className="filter-row" role="group" aria-label="Report status">
        {[
          ['all', 'All'],
          ['received', 'Received'],
          ['in_progress', 'In progress'],
          ['resolved', 'Resolved'],
        ].map(([value, label]) => (
          <FilterChip
            key={value}
            selected={filter === value}
            onClick={() => setFilter(filterName, value)}
          >
            {label}
          </FilterChip>
        ))}
      </div>
      <p role="status">
        {rows.length} {rows.length === 1 ? 'report' : 'reports'}
      </p>
      {rows.length ? (
        <div className="record-list">
          {rows.map(report => (
            <Card key={report.id} className="record-row">
              <h2>
                <ActionLink
                  className="record-link"
                  variant="text"
                  href={`#sdp/reports/${report.id}`}
                >
                  {data.facilities.find(item => item.id === report.facility_id)?.name || 'Facility report'}
                </ActionLink>
              </h2>
              <p>{report.description}</p>
              <div className="record-meta">
                <StatusBadge status={report.status} />
                <time dateTime={report.created_at}>
                  {new Date(report.created_at).toLocaleDateString('en-MY', {
                    timeZone: 'Asia/Kuala_Lumpur',
                  })}
                </time>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <FeedbackState title="No reports here" icon="report">
          {filter === 'all'
            ? 'Reports from this demo view will appear here.'
            : 'No reports match this status. Choose another filter.'}
        </FeedbackState>
      )}
    </div>
  );
}
