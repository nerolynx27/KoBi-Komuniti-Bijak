import { lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AppHeader } from '../../components/navigation/AppHeader.jsx';
import { BottomNav } from '../../components/navigation/BottomNav.jsx';
import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { FeedbackState, Toast } from '../../components/ui/Feedback.jsx';
import { ModalHost, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { PhotoPreview } from '../../components/ui/PhotoPreview.jsx';
import { uiText } from '../../content/uiText.js';
import { TemporaryMap } from '../../features/world/TemporaryMap.jsx';
import { ActivitiesPage } from '../../features/activities/ActivitiesPage.jsx';
import { ActivityDetail } from '../../features/activities/ActivityDetail.jsx';
import { ManageActivitiesPage } from '../../features/activities/ManageActivitiesPage.jsx';
import { ActivityForm } from '../../features/activities/ActivityForm.jsx';
import { WorldEditorPage } from '../../features/world-editor/WorldEditorPage.jsx';
import { ReportForm } from '../../features/complaints/ReportForm.jsx';
import { ReportList } from '../../features/complaints/ReportList.jsx';
import { ReportDetail } from '../../features/complaints/ReportDetail.jsx';
import { StaffReportsPage } from '../../features/complaints/StaffReportsPage.jsx';
import { AccountPages } from '../../features/account/AccountPages.jsx';
import { ProfilePage } from '../../features/account/ProfilePage.jsx';
import { SettingsPage } from '../../features/account/SettingsPage.jsx';
import { useAppNavigation } from '../../app/useAppNavigation.js';
import { demoPhotos } from '../../lib/demoPhotos.js';
import { DashboardPage } from '../../features/dashboard/DashboardPage.jsx';
import { FrameStyleProvider } from '../../components/ui/FrameStyle.jsx';
import { SdpDashboardPage } from './SdpDashboardPage.jsx';
import { SdpBottomNav } from '../../components/sdp/SdpBottomNav.jsx';
import './sdp-dashboard.css';
const DesignSystemPage = import.meta.env.DEV ? lazy(() => import('../../dev/DesignSystemPage.jsx')) : null;
const PresentationStudio = lazy(() => import('../../slides/PresentationStudio.jsx').then(m => ({ default: m.PresentationStudio })));

export default function SdpWorkspaceApp({ store, session }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const persona = useSyncExternalStore(session.subscribe, session.getSnapshot);
  const { data, error, persistence } = snapshot;
  const [modal, setModal] = useState(null), [modalError, setModalError] = useState(''), [toast, setToast] = useState('');
  const [resetEpoch, setResetEpoch] = useState(0);
  const [filters, setFilters] = useState({ reports: 'all', activities: 'all', staffReports: 'all', manageActivities: 'all' });
  const heading = useRef(null), firstRoute = useRef(true), modalOp = useRef(null), origins = useRef({});
  const notify = useCallback(message => setToast(message), []);
  const closeModal = useCallback(() => { if (modalOp.current && store.getSnapshot().pendingOperation?.operationId === modalOp.current) store.discardPending(modalOp.current); modal?.onCancel?.(); setModal(modal?.returnModal || null); setModalError(''); modalOp.current = null; }, [modal, store]);
  const openModal = useCallback(descriptor => { setModalError(''); setModal(current => ({ ...descriptor, returnModal: current })); }, []);
  const confirmAction = useCallback(descriptor => openModal({ ...descriptor, mode: 'dialog', confirm: true }), [openModal]);
  const confirmDiscard = useCallback(proceed => confirmAction({ title: 'Discard changes?', description: 'Your unsaved text and selected photo will be discarded.', confirmLabel: 'Discard changes', cancelLabel: 'Keep editing', onConfirm: () => { setModal(null); proceed(); return true; } }), [confirmAction]);
  const initialHash = window.location.hash || (data.preferences.rememberWorkspace && data.preferences.workspace === 'sdp' ? '#sdp' : '#home');
  const { route: parsedRoute, requestNavigation, registerGuard } = useAppNavigation({ initialHash, confirmDiscard });
  const route = parsedRoute.name === 'design-system' && !import.meta.env.DEV ? { ...parsedRoute, name: 'not-found', title: 'Page not found' } : parsedRoute;
  const navigate = useCallback((target, onAccepted) => { origins.current[typeof target === 'string' ? target.replace(/^#/, '') : target.path] = route.path; requestNavigation(target, onAccepted); }, [requestNavigation, route.path]);
  const enterStaff = () => navigate('sdp', () => { session.setView('sdp'); if (data.preferences.rememberWorkspace) store.setWorkspace('sdp'); });
  const exitStaff = () => navigate('home', () => { session.setView('resident'); if (data.preferences.rememberWorkspace) store.setWorkspace('resident'); });
  const home = route.name === 'home';
  const fullMap = route.name === 'map';
  const devPage = import.meta.env.DEV && route.name === 'design-system';
  const account = ['sign-in', 'create-account'].includes(route.name);
  const staff = route.staff;
  const actor = session.getActor();
  // Entering an SDP URL selects its open demo persona; this grants no real access.
  useEffect(() => { if (route.staff) session.setView('sdp'); else if (route.name === 'home' || route.name === 'map') session.setView('resident'); }, [route.staff, route.name, session]);
  useEffect(() => {
    document.title = `${route.title} · KoBi`;
    if (firstRoute.current) { firstRoute.current = false; return; }
    if (route.name !== 'map' || !route.facilityId) { heading.current?.focus(); window.scrollTo({ top: 0 }); }
  }, [route.path, route.title, route.name, route.facilityId]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 6000); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (snapshot.lastOperation && snapshot.lastOperation.operationId === modalOp.current) { modalOp.current = null; setModal(null); setModalError(''); }
  }, [snapshot.lastOperation]);
  useEffect(() => {
    if (snapshot.lastOperation?.type !== 'demo.reset') return;
    demoPhotos.clear(); registerGuard(null); setResetEpoch(current => current + 1); setModal(null); setModalError('');
    setFilters({ reports: 'all', activities: 'all', staffReports: 'all', manageActivities: 'all' }); notify(uiText.resetSuccess);
    requestAnimationFrame(() => heading.current?.focus());
  }, [snapshot.lastOperation, registerGuard, notify]);
  function openReset() {
    confirmAction({ title: uiText.resetTitle, description: `${uiText.resetBody} Unsaved input and photo previews will also be cleared.`, confirmLabel: uiText.reset, loadingLabel: uiText.resetting,
      onCancel: () => { const pending = store.getSnapshot().pendingOperation; if (pending?.type === 'demo.reset') store.discardPending(pending.operationId); },
      onConfirm: () => { if (!store.reset()) return { error: store.getSnapshot().error }; return true; } });
  }
  function openSignOut() {
    requestNavigation(route.path, () => confirmAction({ title: 'Sign out of the demo?', description: 'Saved records remain in this browser. Unsaved input and photo previews are cleared.', confirmLabel: 'Sign out', onConfirm: () => { const pending = store.getSnapshot().pendingOperation; if (pending) store.discardPending(pending.operationId); demoPhotos.clear(); session.setView('resident'); registerGuard(null); setModal(null); navigate('sign-in'); notify('Signed out of the demo view.'); return true; } }));
  }
  function confirmCurrent() {
    const active = modal;
    const result = modalOp.current && store.getSnapshot().pendingOperation?.operationId === modalOp.current ? store.retryPending(modalOp.current) : active?.onConfirm?.();
    if (result === false || result?.error) { setModalError(result?.error?.message || store.getSnapshot().error?.message || 'The change was not saved.'); modalOp.current = store.getSnapshot().pendingOperation?.operationId || null; }
    else { setModal(current => current === active ? current?.returnModal || null : current); setModalError(''); }
  }
  if (route.name === 'presentation') {
    return (
      <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--color-vanilla)', background: 'var(--color-wine)', minHeight: '100vh', fontFamily: 'var(--font-heading)' }}>LOADING PRESENTATION STUDIO…</div>}>
        <PresentationStudio
          key={`${route.deck || 'deck-a'}:${route.slide || 0}`}
          initialDeck={route.deck || 'deck-a'}
          initialSlide={route.slide || 0}
          onExit={() => navigate('map')}
        />
      </Suspense>
    );
  }
  const common = { data, snapshot, store, actor, session, persona, navigate, registerGuard, notify, openModal, closeModal, confirmAction,
    showPhoto: attachment => openModal({ title: 'Photo preview', mode: 'dialog', content: <PhotoPreview attachment={attachment} data={data} />, dismissible: true }),
    filters, setFilter: (name, value) => setFilters(current => ({ ...current, [name]: value })), openReset, openSignOut, enterStaff,
    back: fallback => navigate(origins.current[route.path] || fallback), route,
  };
  const workspaceOptions = <><p>Open local demo workspace. View switching does not provide staff authorization.</p><div className="sdp-utility-actions"><Button onClick={exitStaff} variant="quiet">Exit SDP workspace</Button><Button onClick={openReset} icon="reset-demo">Reset demo</Button>{import.meta.env.DEV && <ActionLink href="#design-system" variant="text">Development specimen</ActionLink>}</div></>;
  let view;
  if (home) view = <DashboardPage {...common} headingRef={heading} />;
  else if (route.name === 'map') view = <TemporaryMap {...common} />;
  else if (route.name === 'reports') view = <ReportList {...common} />;
  else if (route.name === 'report-new') view = route.facilityId ? <ReportList {...common} /> : <ReportForm key={`${route.path}:${route.facilityId || ''}`} {...common} />;
  else if (route.name === 'report-detail') view = <ReportDetail key={route.id} {...common} />;
  else if (route.name === 'staff-reports') view = <StaffReportsPage {...common} />;
  else if (route.name === 'staff-report-detail') view = <ReportDetail key={route.id} {...common} staff />;
  else if (route.name === 'activities') view = <ActivitiesPage {...common} />;
  else if (route.name === 'activity-detail') view = <ActivityDetail key={route.id} {...common} />;
  else if (route.name === 'manage-activities') view = <ManageActivitiesPage {...common} />;
  else if (route.name === 'activity-new' || route.name === 'activity-edit') view = <ActivityForm key={route.id || 'new'} {...common} />;
  else if (route.name === 'world-editor') view = <WorldEditorPage {...common} />;
  else if (route.name === 'profile') view = <ProfilePage key={actor.id} {...common} />;
  else if (route.name === 'settings') view = <SettingsPage {...common} />;
  else if (account) view = <AccountPages key={route.name} {...common} registration={route.name === 'create-account'} />;
  else if (route.name === 'sdp') view = <SdpDashboardPage data={data} actor={actor} headingRef={heading} />;
  else if (devPage) view = <Suspense fallback={<p role="status">Loading specimen…</p>}><DesignSystemPage /></Suspense>;
  else view = <FeedbackState title={route.name === 'not-found' ? 'This page is unavailable' : 'This view is being connected'}><ActionLink href="#home">Return to Home</ActionLink></FeedbackState>;
  return <FrameStyleProvider value={home ? 'gateway' : 'current'}><div className={`app-shell ${fullMap ? 'map-shell' : ''} ${fullMap || route.name === 'world-editor' ? 'world-texture-free' : ''} ${home ? 'bulletin-shell' : ''} ${!staff && !devPage ? 'resident-shell' : ''} ${staff ? 'staff-shell sdp-workspace-shell' : ''} ${route.name === 'sdp' ? 'sdp-dispatch-shell' : ''} ${devPage ? 'dev-shell' : ''} ${account ? 'account-shell' : ''}`} onClick={event => {
    const link = event.target.closest('a[href^="#"]'); if (!link || link.getAttribute('href') === '#main-content' || event.ctrlKey || event.metaKey) return; event.preventDefault(); navigate(link.getAttribute('href'));
  }}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); heading.current?.focus(); }}>Skip to content</a>
    {!fullMap && <AppHeader
      variant={!devPage ? 'bulletin' : 'current'}
      staff={staff}
      actor={actor}
      session={session}
      data={data}
      store={store}
      navigate={navigate}
      openReset={openReset}
      notify={notify}
    />}
    <main id="main-content" className="main-content">
      {fullMap && <h1 className="sr-only" ref={heading} tabIndex={-1}>Neighbourhood map</h1>}
      {!home && !fullMap && route.name !== 'sdp' && <div className={`page-heading ${route.name === 'reports' ? 'reports-page-heading' : route.name === 'activities' ? 'activities-page-heading' : ''}`}>
        <div>
          {route.name !== 'reports' && route.name !== 'activities' && <span className="eyebrow">{staff ? 'SDP demo workspace' : account ? 'Welcome to KoBi' : data.township.name}</span>}
          <h1 ref={heading} tabIndex={-1} className={route.name === 'reports' ? 'reports-page-title-banner' : route.name === 'activities' ? 'activities-page-title-banner' : ''}>{route.title}</h1>
        </div>
      </div>}
      {(error || persistence === 'recovery') && <div className="storage-recovery"><FeedbackState error title={uiText.storageTitle}>{error?.message || 'Reload the saved demo records before continuing.'}</FeedbackState><div className="form-actions"><Button onClick={() => { if (store.retry()) notify('Pending data saved on this browser.'); }}>{uiText.retry}</Button>{snapshot.pendingOperation && <Button variant="quiet" onClick={() => store.discardPending(snapshot.pendingOperation.operationId)}>Discard pending change</Button>}<Button disabled={Boolean(snapshot.pendingOperation)} onClick={() => store.refresh()}>Reload saved data</Button><Button onClick={openReset} icon="reset-demo">{uiText.reset}</Button></div></div>}

      <div className="view-stack" key={resetEpoch}>{view}</div>
      {!fullMap && staff && route.name !== 'sdp' && <details className="sdp-utilities"><summary>Workspace options</summary>{workspaceOptions}</details>}
      {!fullMap && !staff && <footer className="local-footer">{import.meta.env.DEV && <ActionLink href="#design-system" variant="text" size="sm">Development specimen</ActionLink>}</footer>}
    </main>
    {!fullMap && staff && <SdpBottomNav active={route.path.startsWith('sdp/reports') ? 'reports' : route.path.startsWith('sdp/activities') ? 'activities' : route.path.startsWith('sdp/world') ? 'world' : 'workspace'} />}
    {!fullMap && !staff && !devPage && !account && <BottomNav active={route.nav} />}
    <ModalHost open={Boolean(modal)} title={modal?.title} description={modal?.description} mode={modal?.mode || 'dialog'} onClose={closeModal} dismissible={modal?.dismissible !== false}>{modal?.confirm ? <ConfirmDialog confirmLabel={modalOp.current ? 'Retry storage' : modal.confirmLabel} cancelLabel={modal.cancelLabel} loadingLabel={modal.loadingLabel} onCancel={closeModal} onConfirm={confirmCurrent} error={modalError} /> : <>{modal?.content}<div className="paint-space"><Button variant="quiet" onClick={closeModal} data-initial-focus>Close</Button></div></>}</ModalHost>
    <Toast>{toast}</Toast>
  </div></FrameStyleProvider>;
}

