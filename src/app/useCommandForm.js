import { useCallback, useEffect, useRef, useState } from 'react';
import { newDemoId } from '../lib/demoStore.js';

// A form owns one operation through direct or global retry completion.
export function useCommandForm({ store, snapshot, registerGuard, dirty, busy = false, onSuccess, onDiscard }) {
  const [error, setError] = useState(null);
  const operation = useRef(null), completed = useRef(null);
  const success = useRef(onSuccess), discard = useRef(onDiscard);
  useEffect(() => { success.current = onSuccess; discard.current = onDiscard; });
  const finish = useCallback(last => {
    if (!last || last.operationId !== operation.current || completed.current === last.operationId) return;
    completed.current = last.operationId; operation.current = null; setError(null); registerGuard?.(null); success.current?.(last);
  }, [registerGuard]);
  useEffect(() => { finish(snapshot.lastOperation); }, [snapshot.lastOperation, finish]);
  const clearPending = useCallback(({ discardDraft = false } = {}) => {
    if (operation.current && store.getSnapshot().pendingOperation?.operationId === operation.current) store.discardPending(operation.current);
    operation.current = null; setError(null); if (discardDraft) discard.current?.();
  }, [store]);
  const awaitingRecovery = Boolean(snapshot.pendingOperation && snapshot.pendingOperation.operationId === operation.current);
  useEffect(() => registerGuard?.({ isDirty: dirty || busy || awaitingRecovery, isPending: busy, discard: () => clearPending({ discardDraft: true }) }), [dirty, busy, awaitingRecovery, registerGuard, clearPending]);
  function submit(type, input) {
    if (busy) return { data: null, error: { code: 'PENDING', message: 'Wait for the selected photo to finish checking.' } };
    if (operation.current && store.getSnapshot().pendingOperation?.operationId === operation.current) { const pendingError = { code: 'STORAGE_PENDING', message: 'Retry storage or discard the pending change before editing this save.' }; setError(pendingError); return { data: null, error: pendingError }; }
    const id = newDemoId(); operation.current = id;
    const result = store.execute({ operationId: id, baseRevision: store.getSnapshot().revision, type, input });
    if (result.error) { setError(result.error); if (!store.getSnapshot().pendingOperation) operation.current = null; if (result.error.fields) requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus()); }
    else finish(store.getSnapshot().lastOperation);
    return result;
  }
  function retry() { if (!operation.current) return; const result = store.retryPending(operation.current); if (result.error) setError(result.error); else finish(store.getSnapshot().lastOperation); }
  return { error, setError, submit, retry, clearPending, awaitingRecovery };
}
