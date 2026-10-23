import { SdpActionLink, SdpCard } from '../../components/sdp/SdpPrimitives.jsx';
import { SdpMotif } from '../../components/sdp/SdpMotif.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { useActivityClock } from '../activities/ActivityDetail.jsx';
import { formatMalaysiaDateTime } from '../activities/dateTime.js';
import { selectSdpDashboard } from './sdpDashboardSelectors.js';
import './sdp-dashboard.css';

function deskDate(iso) {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat('en-MY', { timeZone: 'Asia/Kuala_Lumpur', day: 'numeric', month: 'short' }).format(date);
  const time = new Intl.DateTimeFormat('en-MY', { timeZone: 'Asia/Kuala_Lumpur', hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  return `${day} · ${time}`.toUpperCase();
}

function Metric({ value, label, name, tone, icon }) {
  return <SdpCard kind="metric" tone={tone} data-metric={name} aria-label={`${value} ${label}`}><div className="sdp-metric-main"><span className="sdp-metric-value">{value}</span><h2>{label}</h2></div><div className="sdp-metric-foot"><span>Sample data</span><Icon name={icon} /></div></SdpCard>;
}

export function SdpDashboardPage({ data, actor, headingRef, nowIso }) {
  // The same boundary clock as activity details, scheduled only for the next start.
  const nextStart = selectSdpDashboard(data, nowIso || new Date().toISOString()).nextActivity?.starts_at;
  const clock = useActivityClock(nextStart);
  const summary = selectSdpDashboard(data, nowIso || new Date(Math.max(clock, Date.now())).toISOString());
  const { nextActivity, attentionReports } = summary;
  return <div className="sdp-dashboard">
    <SdpCard kind="welcome"><h1 ref={headingRef} tabIndex={-1} className="sdp-welcome-band">SDP workspace — Elmina</h1><div className="sdp-welcome-body"><SdpMotif name="elmina" /><p>Welcome, {data.profiles.find(row => row.id === actor.id)?.display_name || 'Staff Member'}.<br />Neighbourhood operations are ready.</p></div></SdpCard>
    <div className="sdp-dashboard-metrics"><Metric name="open" value={summary.openCount} label="Open reports" tone="cherry" icon="report" /><Metric name="progress" value={summary.inProgressCount} label="In progress" tone="gold" icon="clock" /><Metric name="upcoming" value={summary.upcomingCount} label="Upcoming activities" tone="vanilla" icon="calendar" /></div>
    <SdpCard kind="panel" className="sdp-attention"><h2>Needs attention</h2><div className="sdp-dashboard-reports">
      {attentionReports.map((report, index) => {
        const facility = data.facilities.find(row => row.id === report.facility_id);
        return <SdpCard key={report.id} kind="report" className={index === 0 ? 'sdp-report-priority' : ''}>
          {index === 0 && <><span className="sdp-priority-label" aria-describedby="sdp-priority-meaning">Priority</span><span hidden id="sdp-priority-meaning">First in this local unresolved report queue; this is not a stored urgency level.</span></>}
          <div className="sdp-report-row">{index === 0 && <SdpMotif name="streetlight" />}<div><h3><a href={`#sdp/reports/${encodeURIComponent(report.id)}`}>{report.title || facility?.name || 'Location unavailable'}</a></h3><p><Icon name="location" /> {facility?.name || 'Location unavailable'}</p><p className="sdp-report-preview"><strong>Sample data:</strong> {report.description}</p></div></div>
          {index === 0 && <SdpActionLink className="sdp-report-action" href="#sdp/reports" frameShape="sticker">Review reports <span className="sdp-arrow" aria-hidden="true">↗</span></SdpActionLink>}
        </SdpCard>;
      })}
      {!attentionReports.length && <><p>No reports need attention.</p><SdpActionLink href="#sdp/reports">Review reports</SdpActionLink></>}
    </div></SdpCard>
    <SdpCard kind="event"><h2 className="sdp-card-label">Upcoming event</h2><div className="sdp-event-body"><SdpMotif name="calendar" /><div>{nextActivity ? <><h3><a href="#sdp/activities" aria-label={`Manage activities: ${nextActivity.title}`}>{nextActivity.title}</a></h3><p><time dateTime={nextActivity.starts_at} title={`${formatMalaysiaDateTime(nextActivity.starts_at)} · Malaysia time`}>{deskDate(nextActivity.starts_at)}</time></p><p className="sdp-report-preview"><strong>Sample data:</strong> {nextActivity.description}</p></> : <><h3>No upcoming activities</h3><a href="#sdp/activities">Manage activities</a></>}</div></div></SdpCard>
    <div className="sdp-dashboard-shortcuts"><SdpCard kind="shortcut" tone="gold"><a className="sdp-shortcut-link" href="#sdp/activities"><div><h3>Manage activities</h3><p>Organize and schedule events.</p></div><SdpMotif name="community" /></a></SdpCard><SdpCard kind="shortcut"><a className="sdp-shortcut-link" href="#sdp/world"><div><h3>World editor</h3><p>Update community assets.</p></div><SdpMotif name="world" /></a></SdpCard></div>
  </div>;
}
