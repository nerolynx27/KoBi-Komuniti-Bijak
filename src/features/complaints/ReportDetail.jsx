import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { Card, FeedbackState, StatusBadge } from '../../components/ui/Feedback.jsx';
import { PhotoPreview } from '../../components/ui/PhotoPreview.jsx';
import { Timeline } from '../../components/ui/Timeline.jsx';
import { selectComplaintDetail } from './complaintSelectors.js';
import { ReportActionForm } from './ReportActionForm.jsx';
import { formatMalaysiaDateTime } from '../activities/dateTime.js';

export function ReportDetail(props) {
  const { data, route, actor, back, showPhoto, staff = false } = props;
  if (!staff && actor.role !== 'resident') return <FeedbackState title="Resident demo view required"><Button onClick={() => props.session.setView('resident')}>Switch to resident demo</Button></FeedbackState>;
  const report = selectComplaintDetail(data, route.id, actor);
  if (!report) return <FeedbackState title="Report unavailable" action="Back to reports" onAction={() => back(staff ? 'sdp/reports' : 'reports')}>This report is not available in the current demo view.</FeedbackState>;
  const facility = data.facilities.find(item => item.id === report.facility_id);
  const reporter = data.profiles.find(item => item.id === report.resident_id);
  return <div className="section-stack report-detail"><Card className="report-summary"><h2>{facility.name}</h2><StatusBadge status={report.status} /><p>{report.description}</p><p className="helper">Created {formatMalaysiaDateTime(report.created_at)}</p>{staff && <p className="helper">Demo reporter: {reporter?.display_name || 'Resident demo account'} · {reporter?.email} · Sample identity</p>}<PhotoPreview attachment={report.photo_path} data={data} onEnlarge={showPhoto} /><ActionLink href={`#map?facility=${encodeURIComponent(report.facility_id)}`} icon="map">View on map</ActionLink></Card>
    <Card className="report-history"><h2>Report history</h2><Timeline updates={data.complaint_updates.filter(item => item.complaint_id === report.id)} data={data} showPhoto={showPhoto} /></Card>
    {staff && <div className="report-action"><ReportActionForm key={report.id} {...props} report={report} /></div>}
    <Button className="report-back" variant="quiet" onClick={() => back(staff ? 'sdp/reports' : 'reports')}>Back to reports</Button>
  </div>;
}
