import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { createDemoStore } from './lib/demoStore.js';
import { createDemoSession } from './app/demoSession.js';
import { demoPhotos } from './lib/demoPhotos.js';
import './styles/tokens.css';
import './styles/app.css';
import './styles/components.css';
import './styles/reports-folders.css';
import './styles/activities-board.css';

// Accessing localStorage itself can throw, so defer it inside the adapter.
const session = createDemoSession();
const store = createDemoStore({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) }, { getDemoActor: session.getActor, resolveAttachment: id => demoPhotos.get(id) });
if (window.location.hash.startsWith('#sdp') || (!window.location.hash && store.getSnapshot().data.preferences.rememberWorkspace && store.getSnapshot().data.preferences.workspace === 'sdp')) session.setView('sdp');
window.addEventListener('storage', event => { if (event.key === 'kobi.demo.v1') store.checkExternalChange(); });
createRoot(document.getElementById('root')).render(<StrictMode><App store={store} session={session} /></StrictMode>);
