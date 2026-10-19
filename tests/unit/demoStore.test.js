import { describe, expect, it } from 'vitest';
import { createDemoStore, createSampleData, STORAGE_KEY } from '../../src/lib/demoStore.js';

function memoryStorage(initial = null) {
  let raw = initial;
  return { getItem: () => raw, setItem: (key, value) => { raw = value; } };
}

describe('local demo data safety', () => {
  it('creates independent deterministic samples with valid stable references', () => {
    const a = createSampleData();
    expect(a).toEqual(createSampleData());
    a.preferences.rememberWorkspace = false;
    expect(createSampleData().preferences.rememberWorkspace).toBe(true);
    expect(a.complaints[0].facility_id).toBe('lamp-01');
  });

  it('saves a preference and restores it in a new store', () => {
    const storage = memoryStorage();
    const store = createDemoStore(storage);
    expect(store.setRememberWorkspace(false)).toBe(true);
    expect(createDemoStore(storage).getSnapshot().data.preferences.rememberWorkspace).toBe(false);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)).version).toBe(2);
  });

  it.each(['{bad', JSON.stringify({ version: 99, data: {} }), JSON.stringify({ version: 1, data: {} })])('retains unreadable storage until a confirmed reset: %s', (raw) => {
    const storage = memoryStorage(raw);
    const store = createDemoStore(storage);
    expect(store.getSnapshot().error).toBeTruthy();
    expect(store.setRememberWorkspace(false)).toBe(false);
    store.retry();
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    expect(store.reset()).toBe(true);
    expect(store.getSnapshot().error).toBe(null);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)).data.complaints).toHaveLength(2);
  });

  it('rejects invalid records and dangling facility references', () => {
    for (const change of [data => { data.complaints[0].status = 'deleted'; }, data => { data.complaints[0].facility_id = 'missing'; }, data => { data.layout[0].x = -1; }, data => { data.profiles[0].password = 'never store'; }]) {
      const data = createSampleData();
      change(data);
      const storage = memoryStorage(JSON.stringify({ version: 1, data }));
      expect(createDemoStore(storage).getSnapshot().error?.code).toBe('invalid');
    }
  });

  it('does not commit preferences or reset state when a write fails; retry can recover', () => {
    const storage = memoryStorage();
    const store = createDemoStore(storage);
    store.setRememberWorkspace(false);
    const original = storage.setItem;
    storage.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
    expect(store.setRememberWorkspace(true)).toBe(false);
    expect(store.getSnapshot().data.preferences.rememberWorkspace).toBe(false);
    expect(store.reset()).toBe(false);
    expect(store.getSnapshot().data.preferences.rememberWorkspace).toBe(false);
    storage.setItem = original;
    expect(store.retry()).toBe(true);
    expect(store.getSnapshot().error).toBe(null);
    expect(store.getSnapshot().data.preferences.rememberWorkspace).toBe(true);
  });

  it('handles unavailable reads without erasing data or claiming persistence', () => {
    const store = createDemoStore({ getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } });
    expect(store.getSnapshot().persistence).toBe('unavailable');
    expect(store.getSnapshot().error.code).toBe('unavailable');
    expect(store.reset()).toBe(false);
  });
});

