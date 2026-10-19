import { PhotoPreview } from './PhotoPreview.jsx';
import { StatusBadge } from './Feedback.jsx';

export function Timeline({ updates = [], profiles, data, showPhoto }) {
  const actors = profiles || data?.profiles || [];
  const ordered = updates.map((update, index) => ({ ...update, index })).sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at) || a.index - b.index);
  return <ol className="report-timeline" aria-label="Report history">{ordered.map(update => <li key={update.id}>
    <StatusBadge status={update.status} />
    <p><time dateTime={update.created_at}>{new Date(update.created_at).toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kuala_Lumpur', hour12: true })}</time> · {actors.find(actor => actor.id === update.actor_id)?.display_name || 'Demo account'}</p>
    <p>{update.note}</p>
    {update.evidence_path && <PhotoPreview attachment={update.evidence_path} data={data} onEnlarge={showPhoto} />}
  </li>)}</ol>;
}
