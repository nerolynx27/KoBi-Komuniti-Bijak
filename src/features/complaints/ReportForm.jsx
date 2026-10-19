import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { FeedbackState } from '../../components/ui/Feedback.jsx';
import { PhotoPicker } from '../../components/ui/PhotoPicker.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { newDemoId } from '../../lib/demoStore.js';
import { attachmentMetadata, demoPhotos } from '../../lib/demoPhotos.js';

export function ReportForm(props) {
  if (props.actor.role !== 'resident') return <FeedbackState title="Resident demo view required"><Button onClick={() => props.session.setView('resident')}>Switch to resident demo</Button></FeedbackState>;
  return <ResidentReportForm {...props} />;
}

function ResidentReportForm({ data, route, store, snapshot, registerGuard, notify, navigate, back, showPhoto }) {
  const facilities = data.facilities.filter(item => item.reportable && item.township_id === data.township.id);
  const initialFacility = facilities.some(item => item.id === route.facilityId) ? route.facilityId : '';
  const [id] = useState(newDemoId);
  const [facilityId, setFacility] = useState(initialFacility), [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null), [busy, setBusy] = useState(false), [errors, setErrors] = useState({});
  const photoRef = useRef(null), element = useRef(null);
  function changePhoto(next) { if (photoRef.current) demoPhotos.delete(photoRef.current.id); photoRef.current = next; setPhoto(next); }
  useEffect(() => () => { const current = photoRef.current; if (current && !store.getSnapshot().data.attachments.some(item => item.id === current.id)) demoPhotos.delete(current.id); }, [store]);
  const form = useCommandForm({ store, snapshot, registerGuard, busy, dirty: facilityId !== initialFacility || Boolean(description || photo), onDiscard: () => changePhoto(null), onSuccess: last => { notify('Report saved on this browser.'); navigate(`reports/${last.entityId}`); } });
  const locked = busy || form.awaitingRecovery;
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!facilities.some(item => item.id === facilityId)) next.facilityId = 'Choose an available facility.';
    if (description.trim().length < 10 || description.trim().length > 1000) next.description = 'Use 10–1000 characters.';
    setErrors(next);
    if (Object.keys(next).length) { element.current.elements.namedItem(Object.keys(next)[0])?.focus(); return; }
    form.submit('complaints.create', { id, facilityId, description, attachment: attachmentMetadata(photo) });
  }
  return <form ref={element} className="form-stack" noValidate onSubmit={submit}>
    <p className="page-intro">Describe a problem at a neighbourhood facility. This local demo does not send a real report.</p>
    <FormField as="select" name="facilityId" label="Facility" required value={facilityId} disabled={locked} error={errors.facilityId || form.error?.fields?.facilityId} onChange={event => { setFacility(event.target.value); setErrors(current => ({ ...current, facilityId: null })); }}><option value="">Choose a facility</option>{facilities.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</FormField>
    <FormField as="textarea" name="description" label="Description" required rows={5} value={description} disabled={locked} helper="Use 10–1000 characters. Do not include private contact details." error={errors.description || form.error?.fields?.description} onChange={event => { setDescription(event.target.value); setErrors(current => ({ ...current, description: null })); }} />
    <PhotoPicker label="Report photo (optional)" value={photo} onChange={changePhoto} kind="report" disabled={locked} error={form.error?.fields?.attachment} onPreview={showPhoto} onBusyChange={setBusy} />
    {form.error && <p role="alert" className="field-error">{form.error.message}</p>}
    {form.awaitingRecovery && <div className="form-actions"><Button onClick={form.retry}>Retry storage</Button><Button variant="quiet" onClick={() => form.clearPending()}>Discard pending change</Button></div>}
    <div className="form-actions"><Button variant="primary" type="submit" disabled={locked}>Send report</Button><Button variant="quiet" disabled={busy} onClick={() => back('reports')}>Cancel</Button></div>
  </form>;
}
