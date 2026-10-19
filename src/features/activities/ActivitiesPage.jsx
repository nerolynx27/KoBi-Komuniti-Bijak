import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { Card, FeedbackState, StatusBadge } from '../../components/ui/Feedback.jsx';
import { selectActivities, selectParticipation } from './activitySelectors.js';
import { formatMalaysiaDateTime } from './dateTime.js';

export function ActivitiesPage({ data, actor, store, snapshot, filters, setFilter }) {
  const filter = filters.activities;
  const rows = selectActivities(data, { ...actor, role: 'resident' }, filter);
  return <div className="section-stack"><p className="page-intro">Discover community and recycling activities. Sample data.</p><div className="filter-row" aria-label="Activity filters">{['all', 'community', 'recycling', 'joined'].map(value => <Button size="sm" key={value} variant={filter === value ? 'primary' : 'quiet'} aria-pressed={filter === value} onClick={() => setFilter('activities', value)}>{value[0].toUpperCase() + value.slice(1)}</Button>)}</div><Button disabled={Boolean(snapshot.pendingOperation)} onClick={() => store.refresh()}>Refresh activities</Button>{snapshot.pendingOperation && <p className="helper">Retry or discard the pending change before refreshing.</p>}<p role="status">{rows.length} {rows.length === 1 ? 'activity' : 'activities'}</p>{rows.length ? <div className="record-list">{rows.map(activity => { const membership = selectParticipation(data, activity.id, actor.id); return <Card key={activity.id} className="record-row"><h2><ActionLink href={`#activities/${activity.id}`} variant="text">{activity.title}</ActionLink></h2><StatusBadge status={activity.status} />{membership.joined && <StatusBadge status="joined" />}<p>{activity.category === 'recycling' ? 'Recycling' : 'Community'} · {membership.participant_count} joined</p><p className="record-meta">{formatMalaysiaDateTime(activity.starts_at)} · Malaysia time</p></Card>; })}</div> : <FeedbackState title="No activities here yet">Try another filter or refresh activities.</FeedbackState>}</div>;
}
