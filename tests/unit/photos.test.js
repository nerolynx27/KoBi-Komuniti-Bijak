import { afterEach, expect, it, vi } from 'vitest';
import { attachmentMetadata, createPhotoSelectionValidator, demoPhotos, validatePhoto } from '../../src/lib/demoPhotos.js';

const file = (size = 1, type = 'image/png') => new File([new Uint8Array(size)], 'photo.png', { type });
afterEach(() => { demoPhotos.clear(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('checks exact size and MIME boundaries before decoding', async () => {
  const decode = vi.fn(async () => {});
  for (const size of [0, 5000001]) expect((await validatePhoto(file(size), { decode })).error).toBeTruthy();
  for (const type of ['image/svg+xml', 'image/heic', 'text/plain']) expect((await validatePhoto(file(1, type), { decode })).error).toBeTruthy();
  expect(decode).not.toHaveBeenCalled();
  for (const size of [1, 5000000]) expect((await validatePhoto(file(size), { decode })).error).toBeNull();
  for (const type of ['image/jpeg', 'image/png', 'image/webp']) expect((await validatePhoto(file(1, type), { decode })).error).toBeNull();
});
it('rejects corrupt images, fake files and decoder rejection', async () => {
  expect((await validatePhoto(file(), { decode: async () => { throw Error('corrupt'); } })).error).toBeTruthy();
  expect((await validatePhoto(file(), { decode: async () => false })).error).toBeTruthy();
  expect((await validatePhoto({ size: 1, type: 'image/png' }, { decode: async () => {} })).error).toBeTruthy();
});
it('only stages validated Files and returns metadata without bytes', async () => {
  const image = file();
  expect(() => demoPhotos.put('photo', image)).toThrow();
  await validatePhoto(image, { decode: async () => {} });
  demoPhotos.put('photo', image);
  expect(demoPhotos.get('demo-attachment:photo')).toBe(image);
  expect(attachmentMetadata({ id: 'photo', kind: 'report', file: image, file_name: image.name, mime_type: image.type, size_bytes: image.size })).toEqual({ id: 'photo', kind: 'report', file_name: 'photo.png', mime_type: 'image/png', size_bytes: 1 });
  demoPhotos.delete('photo'); expect(demoPhotos.get('photo')).toBeUndefined();
  demoPhotos.put('photo', image); demoPhotos.clear(); expect(demoPhotos.get('photo')).toBeUndefined();
});
it('ignores stale asynchronous decoding and can invalidate pending selection', async () => {
  const selection = createPhotoSelectionValidator(); let finish;
  const older = selection.validate(file(), { decode: () => new Promise(resolve => { finish = resolve; }) });
  const newer = await selection.validate(file(), { decode: async () => {} });
  finish(); expect(await older).toBeNull(); expect(newer.error).toBeNull();
  const pending = selection.validate(file(), { decode: () => new Promise(resolve => { finish = resolve; }) });
  selection.cancel(); finish(); expect(await pending).toBeNull();
});
it('the default browser decoder releases its temporary URL on success and failure', async () => {
  const created = vi.spyOn(URL, 'createObjectURL');
  const revoked = vi.spyOn(URL, 'revokeObjectURL');
  let broken = false;
  vi.stubGlobal('Image', class {
    naturalWidth = 1; naturalHeight = 1;
    async decode() { if (broken) throw Error('Broken image'); }
  });
  expect((await validatePhoto(file())).error).toBeNull();
  broken = true;
  expect((await validatePhoto(file())).error).toBeTruthy();
  expect(revoked.mock.calls.map(([url]) => url)).toEqual(created.mock.results.map(result => result.value));
});
