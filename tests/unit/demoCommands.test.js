import { describe, expect, it } from 'vitest';
import { createDemoStore, STORAGE_KEY } from '../../src/lib/demoStore.js';

function setup() {
  let raw = null, fail = false;
  const storage = { getItem: () => raw, setItem: (_key, value) => { if (fail) throw new Error('Full'); raw = value; } };
  const store = createDemoStore(storage);
  return { store, storage, fail: value => { fail = value; }, replace: value => { raw = value; } };
}
const preference = (store, operationId, rememberWorkspace) => ({ operationId, baseRevision: store.getSnapshot().revision, type: 'preferences.setRememberWorkspace', input: { rememberWorkspace } });

describe('atomic command recovery', () => {
  it('rejects malformed command envelopes without throwing or writing', () => {
    const s = setup(); const before = s.storage.getItem(STORAGE_KEY);
    for (const input of [null, [], 'bad']) expect(s.store.execute({ operationId: 'bad', baseRevision: 0, type: 'profile.updateName', input }).error.code).toBe('VALIDATION_ERROR');
    expect(s.store.execute({ operationId: 'bad', baseRevision: 0, input: {} }).error.code).toBe('VALIDATION_ERROR');
    expect(s.storage.getItem(STORAGE_KEY)).toBe(before);
  });
  it('does not publish a failed candidate and blocks unrelated writes until retry/discard', () => {
    const s = setup();
    const before = s.store.getSnapshot();
    s.fail(true);
    expect(s.store.execute(preference(s.store, 'op-one', false)).error.code).toBe('STORAGE_UNAVAILABLE');
    expect(s.store.getSnapshot().data).toBe(before.data);
    expect(s.store.getSnapshot().revision).toBe(before.revision);
    expect(s.store.execute(preference(s.store, 'op-two', false)).error.code).toBe('STORAGE_PENDING');
    s.fail(false);
    expect(s.store.retryPending('op-one').error).toBeNull();
    expect(s.store.getSnapshot().data.preferences.rememberWorkspace).toBe(false);
    expect(s.store.getSnapshot().lastOperation.operationId).toBe('op-one');
    expect(JSON.parse(s.storage.getItem(STORAGE_KEY)).revision).toBe(before.revision + 1);
  });
  it('a discarded failed reset is never executed by a later generic retry', () => {
    const s = setup();
    s.store.setRememberWorkspace(false);
    s.fail(true);
    expect(s.store.execute({ operationId: 'reset-one', baseRevision: s.store.getSnapshot().revision, type: 'demo.reset', input: {} }).error).toBeTruthy();
    s.store.discardPending('reset-one');
    s.fail(false);
    expect(s.store.retry()).toBe(true);
    expect(s.store.getSnapshot().data.preferences.rememberWorkspace).toBe(false);
  });
  it('retry refuses an externally changed baseline instead of replaying a snapshot', () => {
    const s = setup();
    s.fail(true);
    s.store.execute(preference(s.store, 'pending', false));
    const changed = JSON.parse(s.storage.getItem(STORAGE_KEY));
    changed.revision += 1;
    changed.data.profiles[0].display_name = 'Another tab';
    s.replace(JSON.stringify(changed));
    s.fail(false);
    expect(s.store.retryPending('pending').error.code).toBe('CONFLICT');
    expect(JSON.parse(s.storage.getItem(STORAGE_KEY)).data.profiles[0].display_name).toBe('Another tab');
  });
  it('retains an operation when the baseline read fails and can retry it', () => {
    const s = setup(); const read = s.storage.getItem;
    s.storage.getItem = () => { throw new Error('Blocked'); };
    s.store.execute(preference(s.store, 'read-failed', false));
    expect(s.store.getSnapshot().pendingOperation?.operationId).toBe('read-failed');
    s.storage.getItem = read;
    expect(s.store.retryPending('read-failed').error).toBeNull();
    expect(s.store.getSnapshot().data.preferences.rememberWorkspace).toBe(false);
  });
  it('a failed reset retry also refuses newer externally stored records', () => {
    const s = setup(); s.fail(true); s.store.reset();
    const id = s.store.getSnapshot().pendingOperation.operationId;
    const changed = JSON.parse(s.storage.getItem(STORAGE_KEY)); changed.revision++;
    changed.data.profiles[0].display_name = 'Newer records'; s.replace(JSON.stringify(changed)); s.fail(false);
    expect(s.store.retryPending(id).error.code).toBe('CONFLICT');
    s.store.discardPending(id);
    expect(s.store.getSnapshot().persistence).toBe('recovery');
    expect(JSON.parse(s.storage.getItem(STORAGE_KEY)).data.profiles[0].display_name).toBe('Newer records');
  });
});
