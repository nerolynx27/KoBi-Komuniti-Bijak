import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { Card, FeedbackState, StatusBadge } from '../../components/ui/Feedback.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { selectParticipation } from './activitySelectors.js';
import { formatMalaysiaDateTime } from './dateTime.js';

export function useActivityClock(startsAt) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const delay = Date.parse(startsAt) - Date.now();
    const timer = delay > 0 ? setTimeout(refresh, Math.min(delay, 2147483647)) : null;
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('focus', refresh); };
  }, [startsAt, now]);
  return now;
}

export function ActivityDetail({ data, route, activity: supplied, preview = false, actor, session, store, snapshot, registerGuard, notify, navigate, back, confirmAction }) {
  const activity = supplied || data.activities.find(row => row.id === route?.id && row.status !== 'draft');
  const now = useActivityClock(activity?.starts_at);
  const form = useCommandForm({ store, snapshot, registerGuard: preview ? undefined : registerGuard, dirty: !preview && ['activities.join', 'activities.leave'].includes(snapshot.pendingOperation?.type), onSuccess: last => notify?.(last.type === 'activities.join' ? 'Joined activity. Saved on this browser.' : 'Left activity. Saved on this browser.') });
  if (!activity) return <FeedbackState title="Activity unavailable"><Button onClick={() => navigate('activities')}>Back to activities</Button></FeedbackState>;
  const participation = selectParticipation(data, activity.id, actor?.id);
  const closed = now >= Date.parse(activity.starts_at);
  const location = data.facilities.find(row => row.id === activity.facility_id);
  return <div className="section-stack">
    {preview && <p className="helper" role="status">Unsaved preview · No changes have been saved.</p>}
    <Card><span className="eyebrow">{activity.category === 'recycling' ? 'Recycling' : 'Community'} · Sample data</span><h2>{activity.title}</h2><StatusBadge status={activity.status} />{!preview && participation.joined && <StatusBadge status="joined" />}<p>{activity.description}</p></Card>
    <Card><h2>Activity information</h2><dl><dt>Starts</dt><dd>{formatMalaysiaDateTime(activity.starts_at)}</dd><dt>Ends</dt><dd>{formatMalaysiaDateTime(activity.ends_at)}</dd><dt>Time zone</dt><dd>Malaysia time (UTC+08:00)</dd><dt>Location</dt><dd>{location?.name || 'Location unavailable'}</dd><dt>Instructions</dt><dd>{activity.instructions || 'No extra instructions.'}</dd>{!preview && <><dt>Participants</dt><dd>{participation.participant_count} joined</dd></>}</dl></Card>
    {!preview && <>
      {closed ? <><Button disabled>{participation.joined ? 'Leave activity' : 'Join activity'}</Button><p role="status">Participation is closed because this activity has started.</p></> : actor?.role !== 'resident' ? <><p>Use the resident demo view to join this activity.</p><Button onClick={() => session.setView('resident')}>Switch to resident demo</Button></> : participation.joined ? <Button variant="quiet" disabled={form.awaitingRecovery} onClick={() => confirmAction({ title: `Leave ${activity.title}?`, description: 'Your place in this demo activity will be removed.', confirmLabel: 'Leave activity', onCancel: () => form.clearPending(), onConfirm: () => form.submit('activities.leave', { id: activity.id }) })}>Leave activity</Button> : activity.status === 'published' ? <Button variant="primary" disabled={form.awaitingRecovery} onClick={() => form.submit('activities.join', { id: activity.id })}>Join activity</Button> : <p role="status">This activity was cancelled. Joining is closed.</p>}
      {form.error && <p role="alert" className="field-error">{form.error.message}</p>}
      {form.awaitingRecovery && <div className="form-actions"><Button onClick={form.retry}>Retry storage</Button><Button variant="quiet" onClick={() => form.clearPending()}>Discard pending change</Button></div>}
      <div className="form-actions"><Button onClick={() => navigate(`map?facility=${encodeURIComponent(activity.facility_id)}`)}>View on map</Button><Button variant="quiet" onClick={() => back('activities')}>Back to activities</Button></div>
    </>}
  </div>;
}
