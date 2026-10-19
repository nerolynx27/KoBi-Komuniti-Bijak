import { useEffect, useId, useRef, useState } from 'react';
import { attachmentMetadata, createPhotoSelectionValidator, demoPhotos } from '../../lib/demoPhotos.js';
import { Button } from './Button.jsx';
import { PhotoPreview } from './PhotoPreview.jsx';
import './photo-controls.css';

export function PhotoPicker({ label = 'Photo', value, onChange, kind = 'report', error, required = false, disabled = false, onPreview, onBusyChange }) {
  const id = useId();
  const input = useRef(null);
  const validator = useRef(null);
  if (!validator.current) validator.current = createPhotoSelectionValidator();
  const [localError, setLocalError] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => { onBusyChange?.(pending); }, [pending, onBusyChange]);
  useEffect(() => { const current = validator.current; return () => current.cancel(); }, []);
  const message = localError || error;
  async function select(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPending(true); setLocalError('');
    const result = await validator.current.validate(file);
    if (!result) return;
    setPending(false);
    if (result.error) { setLocalError(result.error.message); return; }
    const next = { id: globalThis.crypto.randomUUID(), kind, file_name: file.name, mime_type: file.type, size_bytes: file.size, file };
    demoPhotos.put(next.id, file);
    onChange(next);
  }
  return <div className="form-field photo-picker" aria-busy={pending || undefined}>
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} aria-required={required} aria-invalid={Boolean(message) || undefined} aria-describedby={`${id}-helper${message ? ` ${id}-error` : ''}`} onChange={select} />
    <p className="helper" id={`${id}-helper`}>JPEG, PNG or WebP. Maximum 5 MB (5,000,000 bytes). Preview only — image will not remain after reload.</p>
    <div className="photo-actions"><Button size="sm" disabled={disabled} onClick={() => input.current.click()}>{value ? 'Replace photo' : 'Add photo'}</Button>
      {value && <Button size="sm" disabled={disabled} onClick={() => { validator.current.cancel(); setPending(false); setLocalError(''); onChange(null); }}>Remove photo</Button>}
    </div>
    {pending && <p role="status">Checking image…</p>}
    {value && <PhotoPreview attachment={attachmentMetadata(value)} onEnlarge={onPreview} />}
    {message && <p role="alert" className="field-error" id={`${id}-error`}>{message}</p>}
  </div>;
}
