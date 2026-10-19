const RESIDENT = '00000000-0000-4000-8000-000000000002';
const STAFF = '00000000-0000-4000-8000-000000000003';
export function createDemoSession(initialView = 'resident') {
  let snapshot = Object.freeze({ view: initialView === 'sdp' ? 'sdp' : 'resident' });
  const listeners = new Set();
  return {
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
    getActor: () => snapshot.view === 'sdp' ? { id: STAFF, role: 'staff' } : { id: RESIDENT, role: 'resident' },
    setView: view => { if (!['resident', 'sdp'].includes(view) || view === snapshot.view) return; snapshot = Object.freeze({ view }); listeners.forEach(listener => listener()); },
  };
}
