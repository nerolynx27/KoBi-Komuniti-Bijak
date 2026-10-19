import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Card } from '../../components/ui/Feedback.jsx';
import { PhotoPicker } from '../../components/ui/PhotoPicker.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { newDemoId } from '../../lib/demoStore.js';
import { attachmentMetadata, demoPhotos } from '../../lib/demoPhotos.js';

export function ReportActionForm({ report, store, snapshot, registerGuard, notify, showPhoto, confirmAction }) {
  const [version, setVersion] = useState(report.version), [status, setStatus] = useState(report.status);
  const [updateId, setUpdateId] = useState(newDemoId), [note, setNote] = useState(''), [photo, setPhoto] = useState(null), [busy, setBusy] = useState(false), [errors, setErrors] = useState({});
  const element = useRef(null), photoRef = useRef(null);
  const dirty = Boolean(note || photo);
  function changePhoto(next) { if (photoRef.current && !store.getSnapshot().data.attachments.some(item => item.id === photoRef.current.id)) demoPhotos.delete(photoRef.current.id); photoRef.current = next; setPhoto(next); }
  useEffect(() => () => { const current = photoRef.current; if (current && !store.getSnapshot().data.attachments.some(item => item.id === current.id)) demoPhotos.delete(current.id); }, [store]);
  const form = useCommandForm({ store, snapshot, registerGuard, busy, dirty, onDiscard: () => changePhoto(null), onSuccess: () => {
    photoRef.current = null; setPhoto(null); setNote(''); setErrors({}); setUpdateId(newDemoId());
    const saved = store.getSnapshot().data.complaints.find(item => item.id === report.id);
    setVersion(saved.version); setStatus(saved.status); notify('Report action saved on this browser.');
  } });
  const stale = version !== report.version;
  const nextStatus = status === 'received' ? 'in_progress' : status === 'in_progress' ? 'resolved' : null;
  const locked = busy || form.awaitingRecovery;
  function reload() {
    const apply = () => { form.clearPending(); changePhoto(null); setNote(''); setErrors({}); setVersion(report.version); setStatus(report.status); setUpdateId(newDemoId()); return true; };
    if (dirty) confirmAction({ title: 'Reload report?', description: 'Discard your unsaved action note and evidence photo and use the current saved report.', confirmLabel: 'Reload report', onConfirm: apply });
    else apply();
  }
  function submit(event) {
    event.preventDefault(); const next = {};
    if (note.trim().length < 5 || note.trim().length > 1000) next.note = 'Use 5–1000 characters.';
    if (nextStatus === 'resolved' && !photo) next.attachment = 'Select resolution evidence.';
    setErrors(next);
    if (Object.keys(next).length) { element.current.querySelector(next.note ? '[name="note"]' : 'input[type="file"]')?.focus(); return; }
    form.submit('complaints.transition', { id: report.id, expectedVersion: version, nextStatus, note, updateId, attachment: attachmentMetadata(photo) });
  }
  if (!nextStatus && !stale) return <Card><h2>Resolution complete</h2><p>This report is resolved. Its history remains available above.</p></Card>;
  return <Card><h2>{nextStatus === 'in_progress' ? 'Start work' : 'Mark resolved'}</h2><form ref={element} className="form-stack" noValidate onSubmit={submit}>
    <FormField as="textarea" name="note" label="Action note" required rows={4} helper="Use 5–1000 characters." value={note} disabled={locked} error={errors.note || form.error?.fields?.note} onChange={event => setNote(event.target.value)} />
    {nextStatus === 'resolved' && <PhotoPicker label="Resolution evidence" required value={photo} onChange={changePhoto} kind="resolution" disabled={locked} error={errors.attachment || form.error?.fields?.attachment} onPreview={showPhoto} onBusyChange={setBusy} />}
    {form.error && <p role="alert" className="field-error">{form.error.message}</p>}
    {stale && <p role="alert">This report changed. Reload it before saving your action. Your draft is retained.</p>}
    {form.awaitingRecovery && <div className="form-actions"><Button onClick={form.retry}>Retry storage</Button><Button variant="quiet" onClick={() => form.clearPending()}>Discard pending change</Button></div>}
    <div className="form-actions"><Button variant="primary" type="submit" disabled={locked || stale || !nextStatus}>{nextStatus === 'in_progress' ? 'Start work' : 'Mark resolved'}</Button>{(stale || form.error?.code === 'CONFLICT') && <Button disabled={locked} onClick={reload}>Reload report</Button>}</div>
  </form></Card>;
}
