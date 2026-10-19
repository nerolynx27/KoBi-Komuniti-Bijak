import { Button, ActionLink } from '../components/ui/Button.jsx';
import { Card, StatusBadge } from '../components/ui/Feedback.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Choice } from '../components/ui/FormField.jsx';
import { uiText } from '../content/uiText.js';

export function PartNotice({ children }) {
  return <div className="part-notice"><span className="eyebrow">Coming in Part 2</span><p>{children}</p></div>;
}

export function MapFoundation({ data }) {
  return <>
    <div className="map-foundation"><div className="map-preview-mark" aria-hidden="true"><Icon name="map" large /></div><span className="eyebrow">Your neighbourhood, connected</span><h2>A place for better<br />community living.</h2><p>Follow local care and find ways to take part.</p><div className="map-key"><Icon name="location" /><span>{data.township.name}</span></div><div className="map-caption"><Icon name="clock" /><span>Map preview · world not built yet</span></div></div>
    <section className="section-stack" aria-labelledby="explore-heading"><div className="section-heading"><h2 id="explore-heading">Start here</h2><span className="helper">Foundation preview</span></div><div className="destination-row"><Icon name="report" /><div><h3>Care for shared spaces</h3><p>See the sample report statuses.</p><ActionLink href="#reports" variant="text" size="sm">Explore reports</ActionLink></div></div><div className="destination-row"><Icon name="leaf" /><div><h3>Grow the community</h3><p>Discover a sample neighbourhood activity.</p><ActionLink href="#activities" variant="text" size="sm">Explore activities</ActionLink></div></div></section>
    <PartNotice>Facility selection and report forms arrive in Part 2. The interactive pixel world follows the completed shell.</PartNotice>
  </>;
}

export function ReportsFoundation({ data }) {
  return <><p className="page-intro">A shared place to follow the care of your neighbourhood.</p><PartNotice>Report submission, filters, details and staff updates are not implemented yet. These read-only examples show the shared status components.</PartNotice><section className="section-stack"><div className="section-heading"><h2>Report examples</h2><span className="sample-label">{uiText.sample}</span></div><ul className="record-list">{data.complaints.map(report => <li key={report.id}><Card><div className="record-top"><Icon name="report" /><h3>{data.facilities.find(f => f.id === report.facility_id).name}</h3></div><p>{report.description}</p><StatusBadge status={report.status} /><p className="helper record-footnote">Read-only sample · no submission made</p></Card></li>)}</ul></section></>;
}

export function ActivitiesFoundation({ data }) {
  return <><p className="page-intro">Small moments. A more connected community.</p><PartNotice>Activity details, filters and joining arrive in Part 2. No participation is recorded in this foundation.</PartNotice><section className="section-stack"><div className="section-heading"><h2>Activity example</h2><span className="sample-label">{uiText.sample}</span></div>{data.activities.filter(activity => activity.status !== 'draft').map(activity => <Card key={activity.id} className="card-context"><div className="record-top"><Icon name="leaf" /><span className="eyebrow">Community</span></div><h3>{activity.title}</h3><p>{activity.description}</p><p className="icon-line"><Icon name="location" />{data.facilities.find(f => f.id === activity.facility_id).name}</p><p className="icon-line"><Icon name="calendar" /><time dateTime={activity.starts_at}>{new Intl.DateTimeFormat('en-MY', { timeZone: 'Asia/Kuala_Lumpur', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(activity.starts_at))} MYT</time></p><StatusBadge status={activity.status} /><p className="helper record-footnote">Read-only sample · participation unavailable</p></Card>)}</section></>;
}

export function ProfileFoundation({ data, onPreferenceChange, onReset }) {
  const resident = data.profiles.find(profile => profile.role === 'resident');
  return <><Card><div className="record-top"><Icon name="profile" large /><div><span className="sample-label">Demo resident</span><h2>{resident.display_name}</h2></div></div><p>{data.township.name}</p><p className="helper">This is a sample profile. View switching does not sign you in or grant staff access.</p></Card><PartNotice>Account forms, profile editing and settings workflows arrive in Part 2.</PartNotice><Card><h2>Local demo</h2><Choice checked={data.preferences.rememberWorkspace} onChange={event => onPreferenceChange(event.target.checked)} aria-describedby="remember-help">Remember demo workspace</Choice><p id="remember-help" className="helper">When enabled, opening the home URL restores the last resident or SDP demo view. Direct page links take precedence. Navigation and dialogs stay out of the record store.</p><p className="helper">Records, layout and preferences stay in this browser. No real reports or account credentials are sent anywhere.</p><div className="paint-space"><Button icon="reset-demo" onClick={onReset}>{uiText.reset}</Button></div></Card></>;
}

export function StaffFoundation({ data, onExit }) {
  return <><p className="page-intro">A foundation for looking after shared places.</p><Card className="card-subtle"><span className="eyebrow">Simulated staff view</span><p>This workspace is open demo navigation. It provides no authentication or protected staff access.</p><div className="paint-space"><Button variant="quiet" icon="back" onClick={onExit}>Exit SDP demo workspace</Button></div></Card><section className="section-stack"><h2>Workspace preview</h2><div className="staff-preview"><Card><Icon name="report" /><h3>Reports</h3><p>{data.complaints.length} sample reports are ready for the next stage.</p><span className="helper">Actions planned for Part 2</span></Card><Card><Icon name="calendar" /><h3>Activities</h3><p>{data.activities.length} sample activity in the shared demo source.</p><span className="helper">Management planned for Part 2</span></Card><Card><Icon name="catalog" /><h3>World components</h3><p>{data.layout.length} sample placements in the local layout.</p><span className="helper">Catalog and editor planned for Part 2</span></Card></div></section><PartNotice>Report actions, activity management and world editor workflows remain unimplemented.</PartNotice></>;
}
