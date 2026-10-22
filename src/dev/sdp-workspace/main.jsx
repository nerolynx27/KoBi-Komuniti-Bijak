import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './SdpWorkspaceApp.jsx';
import { createDemoStore } from '../../lib/demoStore.js';
import { createDemoSession } from '../../app/demoSession.js';
import { demoPhotos } from '../../lib/demoPhotos.js';
import '../../styles/tokens.css';
import '../../styles/app.css';
import '../../styles/components.css';
import '../../styles/reports-folders.css';
import '../../styles/activities-board.css';
import '../../styles/paper-textures.css';

const SdpComponentsSpecimen = import.meta.env.DEV ? lazy(() => import('./SdpComponentsSpecimen.jsx')) : null;
const root = createRoot(document.getElementById('root'));
if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('specimen') === 'cards-buttons') {
  root.render(<StrictMode><Suspense fallback={<p role="status">Loading SDP components…</p>}><SdpComponentsSpecimen /></Suspense></StrictMode>);
} else {
  startWorkspace();
}

function startWorkspace() {
  // Keep the rework's records separate even if opened on the main app's origin.
  const storageKey = 'kobi.sdp-workspace.v1';
  if (!window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search + '#sdp');
  const session = createDemoSession('sdp');
  const store = createDemoStore({ getItem: () => window.localStorage.getItem(storageKey), setItem: (_key, value) => window.localStorage.setItem(storageKey, value) }, { getDemoActor: session.getActor, resolveAttachment: id => demoPhotos.get(id) });
  if (window.location.hash.startsWith('#sdp') || (!window.location.hash && store.getSnapshot().data.preferences.rememberWorkspace && store.getSnapshot().data.preferences.workspace === 'sdp')) session.setView('sdp');
  window.addEventListener('storage', event => { if (event.key === storageKey) store.checkExternalChange(); });
  root.render(<StrictMode><App store={store} session={session} /></StrictMode>);
}

