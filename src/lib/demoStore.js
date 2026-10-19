import { storageMessages } from '../content/uiText.js';
import { createSampleData } from './demoSamples.js';
import { readDemoEnvelope, validateDemoData } from './demoSchema.js';
import { applyDemoCommand, commandError } from './demoCommands.js';

export { createSampleData } from './demoSamples.js';
export const STORAGE_KEY = 'kobi.demo.v1';
const freeze = value => {
  Object.values(value).forEach(child => { if (child && typeof child === 'object' && !Object.isFrozen(child)) freeze(child); });
  return Object.freeze(value);
};
export const newDemoId = () => globalThis.crypto.randomUUID();
export function createDemoStore(storage, options = {}) {
  const now = () => new Date(options.now ? options.now() : Date.now()).toISOString();
  const newId = options.newId || newDemoId;
  let snapshot = Object.freeze({ data: freeze(createSampleData()), revision: 0, error: null, persistence: 'unavailable', pendingOperation: null, lastOperation: null });
  let baseline = null, blocked = false, pending = null;
  const listeners = new Set();
  const publish = changes => { snapshot = Object.freeze({ ...snapshot, ...changes }); listeners.forEach(listener => listener()); };
  function storageFailure() {
    const error = { code: 'STORAGE_UNAVAILABLE', message: storageMessages.write };
    publish({ error, persistence: 'unavailable', pendingOperation: pending ? { operationId: pending.command.operationId, type: pending.command.type, baseRevision: pending.command.baseRevision } : null });
    return { data: null, error };
  }
  function load() {
    let raw;
    try { raw = storage.getItem(STORAGE_KEY); } catch {
      blocked = true; publish({ error: { code: 'unavailable', message: storageMessages.unavailable }, persistence: 'unavailable' }); return false;
    }
    baseline = raw;
    const parsed = raw === null ? { data: { data: createSampleData(now()), revision: 0, migrated: true }, error: null } : readDemoEnvelope(raw);
    if (parsed.error) {
      blocked = true; const version = parsed.error.code === 'UNSUPPORTED_VERSION';
      publish({ error: { code: version ? 'version' : 'invalid', message: storageMessages[version ? 'version' : 'invalid'] }, persistence: 'recovery' }); return false;
    }
    const envelope = { version: 2, revision: parsed.data.revision, data: parsed.data.data };
    if (parsed.data.migrated) {
      try { const next = JSON.stringify(envelope); storage.setItem(STORAGE_KEY, next); baseline = next; }
      catch { blocked = true; storageFailure(); return false; }
    }
    blocked = false; pending = null;
    publish({ data: freeze(envelope.data), revision: envelope.revision, error: null, persistence: 'saved', pendingOperation: null }); return true;
  }
  function commit(prepared, retrying = false) {
    const { command, actor, timestamp } = prepared;
    if (command.type !== 'demo.reset' || retrying) {
      let current;
      try { current = storage.getItem(STORAGE_KEY); } catch { pending = prepared; return storageFailure(); }
      if (current !== prepared.baseline || command.baseRevision !== snapshot.revision) {
        const result = commandError('CONFLICT', 'This browser data changed in another tab. Reload and review before saving.');
        blocked = true;
        publish({ error: result.error, persistence: 'recovery' }); return result;
      }
    }
    const outcome = applyDemoCommand(snapshot.data, command, { actor, timestamp, now: now(), revision: snapshot.revision, newId, resolveAttachment: options.resolveAttachment || (() => null) });
    if (outcome.error) { publish({ error: outcome.error }); return outcome; }
    const { nextData, result, entityId, changed } = outcome.data;
    const validation = validateDemoData(nextData);
    if (!validation.valid) return commandError('VALIDATION_ERROR', 'The change contains invalid demo records.', { schema: validation.issues.join(' ') });
    if (!changed) {
      pending = null; publish({ error: null, pendingOperation: null, lastOperation: { operationId: command.operationId, type: command.type, entityId, revision: snapshot.revision } });
      return { data: result, error: null };
    }
    const revision = snapshot.revision + 1;
    const raw = JSON.stringify({ version: 2, revision, data: nextData });
    try { storage.setItem(STORAGE_KEY, raw); } catch { pending = prepared; return storageFailure(); }
    baseline = raw; blocked = false; pending = null;
    publish({ data: freeze(nextData), revision, error: null, persistence: 'saved', pendingOperation: null, lastOperation: { operationId: command.operationId, type: command.type, entityId, revision } });
    return { data: result, error: null };
  }
  function execute(command) {
    if (!command || typeof command.operationId !== 'string' || !command.operationId || !Number.isSafeInteger(command.baseRevision) || typeof command.type !== 'string' || !command.input || typeof command.input !== 'object' || Array.isArray(command.input)) return commandError('VALIDATION_ERROR', 'A valid operation and input fields are required.');
    if (pending && command.type !== 'demo.reset') return commandError('STORAGE_PENDING', 'Retry storage or discard the pending change before another save.');
    if (blocked && command.type !== 'demo.reset') return commandError('STORAGE_UNAVAILABLE', 'Recover browser storage before saving changes.');
    const actor = options.getDemoActor?.() || snapshot.data.profiles.find(profile => profile.role === 'resident');
    const prepared = { command: structuredClone(command), actor: actor ? { ...actor } : null, timestamp: now(), baseline };
    if (command.type === 'demo.reset') pending = null;
    return commit(prepared);
  }
  function retryPending(operationId) {
    if (!pending || pending.command.operationId !== operationId) return commandError('NOT_FOUND', 'There is no matching pending change.');
    return commit(pending, true);
  }
  function discardPending(operationId) {
    if (pending && pending.command.operationId !== operationId) return commandError('CONFLICT', 'A different change is awaiting recovery.');
    pending = null; publish({ error: null, pendingOperation: null, persistence: blocked ? 'recovery' : 'saved' }); return { data: { discarded: true }, error: null };
  }
  const run = (type, input = {}) => execute({ operationId: newId(), baseRevision: snapshot.revision, type, input }).error === null;
  load();
  return {
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
    execute, retryPending, discardPending,
    setRememberWorkspace: rememberWorkspace => run('preferences.setRememberWorkspace', { rememberWorkspace }),
    setWorkspace: workspace => run('preferences.setWorkspace', { workspace }),
    reset: () => run('demo.reset'),
    retry: () => pending ? retryPending(pending.command.operationId).error === null : load(),
    refresh: () => pending ? false : load(),
    checkExternalChange: () => {
      try { if (storage.getItem(STORAGE_KEY) === baseline) return false; } catch { /* Recovery explains storage failure. */ }
      blocked = true; publish({ error: { code: 'CONFLICT', message: 'Demo data changed in another tab. Reload to review the saved records.' }, persistence: 'recovery' }); return true;
    },
  };
}
