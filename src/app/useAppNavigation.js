import { useCallback, useEffect, useRef, useState } from 'react';
import { buildRoute, parseRoute } from './routes.js';

export function useAppNavigation({ initialHash, confirmDiscard }) {
  const [route, setRoute] = useState(() => parseRoute(initialHash));
  const accepted = useRef(buildRoute(initialHash));
  const index = useRef(Number.isInteger(window.history.state?.kobiIndex) ? window.history.state.kobiIndex : 0);
  const restoring = useRef(null);
  const approvedTraversal = useRef(null);
  const guard = useRef(null);
  const registerGuard = useCallback(value => { guard.current = value; return () => { if (guard.current === value) guard.current = null; }; }, []);
  const apply = useCallback((target, onAccepted) => {
    const hash = buildRoute(target);
    if (hash !== accepted.current) {
      index.current++;
      window.history.pushState({ kobiIndex: index.current }, '', hash);
    }
    accepted.current = hash;
    setRoute(parseRoute(hash));
    onAccepted?.();
  }, []);
  const requestNavigation = useCallback((target, onAccepted) => {
    const hash = buildRoute(target);
    if (hash === accepted.current && !onAccepted) return;
    const current = guard.current;
    if (current?.isPending) return;
    if (current?.isDirty) {
      confirmDiscard(() => { current.discard?.(); guard.current = null; apply(hash, onAccepted); });
    } else apply(hash, onAccepted);
  }, [apply, confirmDiscard]);
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, kobiIndex: index.current }, '', accepted.current);
    const changed = () => {
      const requested = window.location.hash || '#home';
      let targetIndex = window.history.state?.kobiIndex;
      if (!Number.isInteger(targetIndex) || (targetIndex === index.current && requested !== accepted.current)) {
        targetIndex = index.current + 1;
        window.history.replaceState({ ...window.history.state, kobiIndex: targetIndex }, '');
      }
      if (restoring.current && targetIndex === index.current) {
        const afterRestore = restoring.current;
        restoring.current = null;
        afterRestore();
        return;
      }
      const accept = () => { accepted.current = requested; index.current = targetIndex; setRoute(parseRoute(requested)); };
      if (approvedTraversal.current === targetIndex) { approvedTraversal.current = null; accept(); return; }
      if (requested === accepted.current) { index.current = targetIndex; return; }
      const current = guard.current;
      if (!current?.isDirty && !current?.isPending) { accept(); return; }
      // Restore the actual entry, preserving both Back and Forward destinations.
      restoring.current = () => {
        if (current.isPending) return;
        confirmDiscard(() => {
          current.discard?.(); guard.current = null;
          approvedTraversal.current = targetIndex;
          window.history.go(targetIndex - index.current);
        });
      };
      window.history.go(index.current - targetIndex);
    };
    const unload = event => { if (guard.current?.isDirty || guard.current?.isPending) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('hashchange', changed); window.addEventListener('beforeunload', unload);
    return () => { window.removeEventListener('hashchange', changed); window.removeEventListener('beforeunload', unload); };
  }, [confirmDiscard]);
  return { route, requestNavigation, registerGuard };
}
