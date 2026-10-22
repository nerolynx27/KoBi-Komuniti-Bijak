import { Card } from '../../components/ui/Feedback.jsx';
import { ActionLink } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { statusLabels } from '../../content/uiText.js';
import { formatMalaysiaDateTime } from '../activities/dateTime.js';
import { useActivityClock } from '../activities/ActivityDetail.jsx';
import { selectDashboardSummary } from './dashboardSelectors.js';
import { DashboardWorldEntry, BulletinArtwork } from './DashboardWorldEntry.jsx';
import './dashboard.css';

function RepairMotif() {
  return <svg className="bulletin-repair" viewBox="0 0 64 72" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    <g fill="none" stroke="var(--border-strong)" strokeWidth="2"><path d="M5 65V13h3V9h5V6h12v4H13v4H9v51M2 65h12v5H2zM22 10h12v4h-3v4h-8v-4h-3v-4" /><path d="M27 35l5 5 3-3-4-6h7l4 6v7l18 18-5 5-18-18h-7l-6-5v-7z" /></g>
    <path fill="var(--accent-decorative)" stroke="var(--border-strong)" strokeWidth="2" d="M25 66l-4-4 22-22 4 4zM45 38l9-12 3 3-9 12z" />
    <path fill="var(--action-primary)" d="M18 22h2v4h-2zM26 23h2v5h-2zM34 21h2v4h-2z" />
  </svg>;
}

export function DashboardPage({ data, actor, headingRef }) {
  const midnight = Math.floor((Date.now() + 28800000) / 86400000) * 86400000 + 86400000 - 28800000;
  const nextStart = data.activities.filter(activity => activity.township_id === data.township.id && activity.status === 'published' && Date.parse(activity.starts_at) > Date.now()).reduce((time, activity) => Math.min(time, Date.parse(activity.starts_at)), midnight);
  const now = useActivityClock(new Date(nextStart).toISOString());
  const summary = selectDashboardSummary(data, actor, new Date(now).toISOString());
  const activity = summary.upcomingActivity, update = summary.latestReportUpdate;
  const facilityName = id => data.facilities.find(facility => facility.id === id)?.name || 'Location unavailable';
  const date = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(now));
  return <div className="bulletin">
    <div className="bulletin-masthead"><h1 ref={headingRef} tabIndex={-1}>The neighbourhood bulletin</h1><div className="bulletin-dateline"><time dateTime={new Date(now).toISOString()}>{date}</time><span>{data.township.name}</span></div></div>
    <section className="bulletin-story" aria-labelledby="bulletin-story-title">
      <Card className="bulletin-story-image"><BulletinArtwork src="/assets/dashboard/bulletin-cleanup.png" label="Activity" width={634} height={604} /></Card>
      <div className="bulletin-story-copy"><h2 id="bulletin-story-title">{activity?.title || 'No upcoming activities'}</h2>
        <p>{activity?.description || 'Check back for the next neighbourhood gathering.'} <span>Sample data</span></p>
        {activity && <div className="bulletin-story-meta"><time dateTime={activity.starts_at}>{formatMalaysiaDateTime(activity.starts_at)}</time><p>{facilityName(activity.facility_id)}</p></div>}
        <ActionLink href={activity ? `#activities/${activity.id}` : '#activities'} variant="strong" frameShape="ticket" size="sm">{activity ? 'View activity' : 'Browse activities'}</ActionLink>
      </div>
    </section>
    <Card className="bulletin-update" aria-labelledby="bulletin-update-title"><h2 id="bulletin-update-title">Your latest update</h2>
      {update ? <a className="bulletin-update-link" href={`#reports/${update.report.id}`}><RepairMotif /><div><h3>{facilityName(update.report.facility_id)}</h3><p className="bulletin-update-status">{statusLabels[update.report.status].label}</p><p>{update.latestAction?.note || 'Report received. No maintenance update yet.'}</p><span className="bulletin-sample">Sample data</span></div></a>
        : <div className="bulletin-empty-update"><p>No report updates yet</p><ActionLink href="#reports" variant="text" size="sm">View reports</ActionLink></div>}
    </Card>
    <DashboardWorldEntry />
    <div className="bulletin-shortcuts">
      {[['reports', 'My reports', summary.reportTotal, 'report'], ['activities', 'My activities', summary.joinedActivityTotal, 'activity']].map(([route,label,count,icon]) => <Card key={route} folded><a href={`#${route}`} aria-label={`${label}: ${count}`}><Icon name={icon} /><div><span className="bulletin-shortcut-label">{label}<strong>{count}</strong></span><span className="bulletin-sample">Sample data</span></div></a></Card>)}
    </div>
  </div>;
}
