import { useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { FeedbackState, StatusBadge } from '../../components/ui/Feedback.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { newDemoId } from '../../lib/demoStore.js';
import { ActivityDetail, useActivityClock } from './ActivityDetail.jsx';
import { parseMalaysiaDateTime, toMalaysiaDateTimeFields } from './dateTime.js';
import './activities.css';

function fieldsFor(activity) {
  const start = toMalaysiaDateTimeFields(activity?.starts_at), end = toMalaysiaDateTimeFields(activity?.ends_at);
  return { title: activity?.title || '', description: activity?.description || '', instructions: activity?.instructions || '', category: activity?.category || 'community', facility_id: activity?.facility_id || '', startDate: start.date, startTime: start.time, endDate: end.date, endTime: end.time };
}

export function ActivityForm(props) {
  const { data, route, store, snapshot, registerGuard, navigate, back, notify, openModal, confirmAction } = props;
  const current = data.activities.find(row => row.id === route.id);
  const [id] = useState(() => route.id || newDemoId());
  const [baseline, setBaseline] = useState(() => ({ activity: current, fields: fieldsFor(current), version: current?.version ?? null }));
  const [values, setValues] = useState(baseline.fields), [dateErrors, setDateErrors] = useState({});
  const dirty = JSON.stringify(values) !== JSON.stringify(baseline.fields);
  const now = useActivityClock(current?.starts_at);
  const locked = current?.status === 'cancelled' || (current && now >= Date.parse(current.starts_at));
  const form = useCommandForm({ store, snapshot, registerGuard, dirty: dirty || snapshot.pendingOperation?.type === 'activities.save', onSuccess: () => { notify('Activity saved on this browser.'); navigate('sdp/activities'); } });
  if (route.id && !current) return <FeedbackState title="Activity unavailable"><Button onClick={() => navigate('sdp/activities')}>Back to activities</Button></FeedbackState>;
  function update(key) { return event => { setValues(previous => ({ ...previous, [key]: event.target.value })); setDateErrors({}); }; }
  function activityValues(status) {
    const start = parseMalaysiaDateTime(values.startDate, values.startTime), end = parseMalaysiaDateTime(values.endDate, values.endTime);
    const errors = {};
    if (start.error) errors.starts_at = start.error.message;
    else if (Date.parse(start.data) <= Date.now()) errors.starts_at = 'Choose a start time in the future.';
    if (end.error) errors.ends_at = end.error.message;
    else if (start.data && Date.parse(end.data) <= Date.parse(start.data)) errors.ends_at = 'Choose an end time after the start.';
    setDateErrors(errors);
    if (Object.keys(errors).length) { requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus()); return null; }
    return { title: values.title, description: values.description, instructions: values.instructions, category: values.category, facility_id: values.facility_id, starts_at: start.data, ends_at: end.data, status };
  }
  function save(status) { const output = activityValues(status); if (output) form.submit('activities.save', { id, expectedVersion: baseline.version, values: output }); }
  function reload() {
    const proceed = () => {
      form.clearPending();
      if (!store.refresh()) return { error: store.getSnapshot().error || { message: 'The saved activity could not be reloaded.' } };
      const fresh = store.getSnapshot().data.activities.find(row => row.id === id);
      const fields = fieldsFor(fresh); setBaseline({ activity: fresh, fields, version: fresh?.version ?? null }); setValues(fields); setDateErrors({}); return true;
    };
    if (dirty) confirmAction({ title: 'Reload activity?', description: 'Your unsaved changes will be discarded and the latest saved activity loaded.', confirmLabel: 'Reload activity', onConfirm: proceed });
    else proceed();
  }
  const errors = { ...form.error?.fields, ...dateErrors };
  const disabled = locked || form.awaitingRecovery;
  return <div className="section-stack activity-form"><p className="page-intro">Local demo activity · All dates and times use Malaysia time (UTC+08:00).</p>{current && <StatusBadge status={current.status} />}{locked && <p role="status">{current.status === 'cancelled' ? 'Cancelled activities are read-only.' : 'This activity has started. Activity details are read-only.'}</p>}
    <form className="form-stack" noValidate onSubmit={event => { event.preventDefault(); save(current?.status === 'published' ? 'published' : 'draft'); }}>
      <FormField label="Title" required maxLength={100} value={values.title} disabled={disabled} onChange={update('title')} error={errors.title} helper="5–100 characters." />
      <FormField label="Description" as="textarea" rows={5} required maxLength={2000} value={values.description} disabled={disabled} onChange={update('description')} error={errors.description} helper="10–2000 characters." />
      <FormField label="Category" as="select" required value={values.category} disabled={disabled} onChange={update('category')} error={errors.category}><option value="community">Community</option><option value="recycling">Recycling</option></FormField>
      <FormField label="Location" as="select" required value={values.facility_id} disabled={disabled} onChange={update('facility_id')} error={errors.facility_id}><option value="">Choose a location</option>{data.facilities.filter(row => ['park', 'hall', 'recycling'].includes(row.type)).map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</FormField>
      <div className="activity-date-fields"><FormField label="Start date" type="date" required value={values.startDate} disabled={disabled} onChange={update('startDate')} error={errors.starts_at} helper="Malaysia time" /><FormField label="Start time" type="time" required value={values.startTime} disabled={disabled} onChange={update('startTime')} helper="Malaysia time" /></div>
      <div className="activity-date-fields"><FormField label="End date" type="date" required value={values.endDate} disabled={disabled} onChange={update('endDate')} error={errors.ends_at} helper="Malaysia time" /><FormField label="End time" type="time" required value={values.endTime} disabled={disabled} onChange={update('endTime')} helper="Malaysia time" /></div>
      <FormField label="Instructions" as="textarea" rows={3} maxLength={1000} value={values.instructions} disabled={disabled} onChange={update('instructions')} error={errors.instructions} helper="Optional · up to 1000 characters." />
      {form.error && <p role="alert" className="field-error">{form.error.message}</p>}
      {form.error?.code === 'CONFLICT' && <Button onClick={reload}>Reload activity</Button>}
      {form.awaitingRecovery && <div className="form-actions"><Button onClick={form.retry}>Retry storage</Button><Button variant="quiet" onClick={() => form.clearPending()}>Discard pending change</Button></div>}
      <div className="form-actions">{!locked && <><Button type="submit" variant={current?.status === 'published' ? 'primary' : 'secondary'} disabled={disabled}>{current?.status === 'published' ? 'Save changes' : 'Save draft'}</Button>{current?.status !== 'published' && <Button variant="primary" disabled={disabled} onClick={() => save('published')}>Publish activity</Button>}</>}<Button disabled={form.awaitingRecovery} onClick={() => { const output = locked ? current : activityValues(current?.status || 'draft'); if (output) openModal({ title: 'Activity preview', content: <ActivityDetail {...props} activity={{ ...output, id }} preview /> }); }}>Preview activity</Button><Button variant="quiet" onClick={() => back('sdp/activities')}>{locked ? 'Back to activities' : 'Cancel'}</Button></div>
    </form>
  </div>;
}

