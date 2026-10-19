import { Button } from '../../components/ui/Button.jsx';
import { StatusBadge } from '../../components/ui/Feedback.jsx';
import { formatMalaysiaDateTime } from '../activities/dateTime.js';
const stateLabels = { normal: 'Normal', reported: 'Reported', repairing: 'Work in progress' };
export function FacilitySheet({ object, navigate, closeModal }) {
  function go(target) { closeModal(); navigate(target); }
  return <div className="section-stack"><div><p className={`facility-condition state-${object.state}`}>{stateLabels[object.state]}</p><p className="helper">Sample place · {object.facilityId || 'Decorative component'}</p></div>
    <p>{object.facilityId ? 'A shared neighbourhood facility. Public condition is based on active reports; report details stay in the demo report views.' : 'This decorative object is part of the neighbourhood schematic. It has no reporting or activity actions.'}</p>
    {object.reportable && <Button variant="primary" icon="report" onClick={() => go(`reports/new?facility=${encodeURIComponent(object.facilityId)}`)}>Report a problem</Button>}
    {object.activities.length > 0 && <section className="section-stack"><h3>{object.activities.length > 1 ? 'Choose an activity' : 'Activity at this place'}</h3>{object.activities.map(activity => <div className="record-row" key={activity.id}><h3>{activity.title}</h3><StatusBadge status={activity.status} /><p className="helper">{formatMalaysiaDateTime(activity.starts_at)}</p><Button icon="activity" onClick={() => go(`activities/${activity.id}`)}>View activity</Button></div>)}</section>}
  </div>;
}
