import { useEffect, useState } from 'react';

const validated = new WeakSet();
const files = new Map();
const key = id => typeof id === 'string' ? id.replace(/^demo-attachment:/, '') : id;
const failure = message => ({ data: null, error: { code: 'VALIDATION_ERROR', message } });

async function decodeImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const image = new globalThis.Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('Empty image');
  } finally { URL.revokeObjectURL(url); }
}

export async function validatePhoto(file, { decode = decodeImage } = {}) {
  if (!(file instanceof globalThis.File)) return failure('Choose an image file.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return failure('Choose a JPEG, PNG or WebP image.');
  if (file.size < 1 || file.size > 5000000) return failure('Choose an image between 1 and 5,000,000 bytes (5 MB).');
  try { if (await decode(file) === false) throw new Error('Invalid image'); }
  catch { return failure('This image could not be opened. Choose another JPEG, PNG or WebP image.'); }
  validated.add(file);
  return { data: { file }, error: null };
}

export const demoPhotos = {
  put(id, file) {
    if (!id || !validated.has(file)) throw new Error('Only validated image files can be staged.');
    files.set(key(id), file);
  },
  get: id => files.get(key(id)),
  delete: id => files.delete(key(id)),
  clear: () => files.clear(),
};

export function attachmentMetadata(value) {
  if (!value) return null;
  const { id, kind, file_name, mime_type, size_bytes } = value;
  return { id, kind, file_name, mime_type, size_bytes };
}

export function createPhotoSelectionValidator() {
  let version = 0;
  return {
    cancel() { version++; },
    async validate(file, options) {
      const current = ++version;
      const result = await validatePhoto(file, options);
      return current === version ? result : null;
    },
  };
}

export function useObjectUrl(file) {
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return preview && preview.file === file ? preview.url : null;
}
