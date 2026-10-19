import { useState } from 'react';
import { demoPhotos, useObjectUrl } from '../../lib/demoPhotos.js';
import { Button } from './Button.jsx';
import { uiText } from '../../content/uiText.js';
import './photo-controls.css';

export function PhotoPreview({ attachment, data, onEnlarge }) {
  const id = typeof attachment === 'string' ? attachment.replace(/^demo-attachment:/, '') : attachment?.id;
  const metadata = typeof attachment === 'object' ? attachment : data?.attachments?.find(item => item.id === id);
  const file = demoPhotos.get(id);
  const url = useObjectUrl(file);
  const [failedUrl, setFailedUrl] = useState(null);
  if (!attachment) return null;
  if (file && !url) return <p role="status">Preparing photo preview…</p>;
  return <figure className="photo-preview">
    {url && failedUrl !== url ? <>
      <img src={url} alt={metadata?.kind === 'resolution' ? 'Selected resolution evidence' : 'Selected report photo'} onError={() => setFailedUrl(url)} />
      {onEnlarge && <Button size="sm" onClick={() => onEnlarge(metadata || attachment)}>Preview photo</Button>}
      <figcaption>{metadata?.file_name}<span>{uiText.previewOnly}</span></figcaption>
    </> : <figcaption>{metadata?.file_name && <span>{metadata.file_name}</span>}{uiText.previewUnavailable}</figcaption>}
  </figure>;
}
