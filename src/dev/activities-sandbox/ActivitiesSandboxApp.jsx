import { useRef, useState } from 'react';
import {
  SandboxBottomNav,
  SandboxBurgerDrawer,
  SandboxHeader,
} from '../reports-sandbox/components/SandboxNav.jsx';
import {
  INITIAL_GALLERY_ITEMS,
  SANDBOX_PERSONAS,
  filterSandboxActivities,
  joinSandboxActivity,
  leaveSandboxActivity,
  loadSandboxActivities,
  resetSandboxActivities,
  saveSandboxActivities,
} from './activitiesSandboxData.js';
import { NoticeBoard } from './components/NoticeBoard.jsx';
import { ActivityDetailModal } from './components/ActivityDetailModal.jsx';
import { PolaroidGalleryCarousel } from './components/PolaroidGalleryCarousel.jsx';
import { GalleryPreviewModal } from './components/GalleryPreviewModal.jsx';

export default function ActivitiesSandboxApp() {
  const [activities, setActivities] = useState(() => loadSandboxActivities());
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeActivityId, setActiveActivityId] = useState(null);
  const [selectedPolaroidId, setSelectedPolaroidId] = useState('gal-2');
  const [previewPolaroidId, setPreviewPolaroidId] = useState(null);

  // Burger drawer & demo persona state
  const [menuOpen, setMenuOpen] = useState(false);
  const [personaIndex, setPersonaIndex] = useState(0);
  const [workspaceMode, setWorkspaceMode] = useState('resident');
  const [rememberWorkspace, setRememberWorkspace] = useState(true);
  const [statusNotice, setStatusNotice] = useState('');

  const lastTriggerRef = useRef(null);

  const activePersona = SANDBOX_PERSONAS[personaIndex] || SANDBOX_PERSONAS[0];
  const filteredActivities = filterSandboxActivities(activities, activeFilter);
  const joinedCount = activities.filter(item => item.joined).length;

  const activeActivity = activeActivityId
    ? activities.find(item => item.id === activeActivityId) || null
    : null;

  const activeGalleryItem = previewPolaroidId
    ? INITIAL_GALLERY_ITEMS.find(item => item.id === previewPolaroidId) || null
    : null;

  function restoreTriggerFocus() {
    const triggerEl = lastTriggerRef.current;
    if (triggerEl && typeof triggerEl.focus === 'function') {
      requestAnimationFrame(() => {
        triggerEl.focus();
      });
    }
  }

  function handleSelectActivity(activity, triggerEl) {
    lastTriggerRef.current = triggerEl || document.activeElement;
    setPreviewPolaroidId(null);
    setActiveActivityId(activity.id);
  }

  function handleCloseActivityModal() {
    setActiveActivityId(null);
    restoreTriggerFocus();
  }

  function handleJoinActivity(activityId) {
    setActivities(prev => {
      const next = joinSandboxActivity(prev, activityId);
      saveSandboxActivities(next);
      return next;
    });
    const joinedItem = activities.find(item => item.id === activityId);
    if (joinedItem) {
      setStatusNotice(`Joined "${joinedItem.title}". Saved in this browser.`);
    }
  }

  function handleLeaveActivity(activityId) {
    setActivities(prev => {
      const next = leaveSandboxActivity(prev, activityId);
      saveSandboxActivities(next);
      return next;
    });
    const leftItem = activities.find(item => item.id === activityId);
    if (leftItem) {
      setStatusNotice(`Left "${leftItem.title}". Spot reopened.`);
    }
  }

  function handleSelectPolaroid(item, triggerEl) {
    lastTriggerRef.current = triggerEl || document.activeElement;
    setActiveActivityId(null);
    setSelectedPolaroidId(item.id);
    setPreviewPolaroidId(item.id);
  }

  function handleCloseGalleryPreview() {
    setPreviewPolaroidId(null);
    restoreTriggerFocus();
  }

  function handleSwitchAccount() {
    const nextIdx = (personaIndex + 1) % SANDBOX_PERSONAS.length;
    const nextPersona = SANDBOX_PERSONAS[nextIdx];
    setPersonaIndex(nextIdx);
    setStatusNotice(
      `Switched demo account to ${nextPersona.name} (${nextPersona.roleLabel}).`
    );
  }

  function handleResetDemoData() {
    const fresh = resetSandboxActivities();
    setActivities(fresh);
    setActiveFilter('all');
    setActiveActivityId(null);
    setPreviewPolaroidId(null);
    setSelectedPolaroidId('gal-2');
    setMenuOpen(false);
    setStatusNotice('Demo activities reset to initial 2026 notice board state.');
  }

  return (
    <div className="act-sandbox-shell" id="sandbox-top">
      {/* Shared App Header matching original app & Reports section */}
      <SandboxHeader
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen(prev => !prev)}
      />

      <SandboxBurgerDrawer
        open={menuOpen}
        activePersona={activePersona}
        onSwitchAccount={handleSwitchAccount}
        workspaceMode={workspaceMode}
        onSelectWorkspace={mode => {
          setWorkspaceMode(mode);
          setStatusNotice(
            mode === 'sdp'
              ? 'SDP Workspace selected (Staff activity management preview).'
              : 'Resident View selected.'
          );
        }}
        onSelectSdpDestination={dest => {
          setStatusNotice(`Selected SDP shortcut: ${dest}`);
          setMenuOpen(false);
        }}
        myReportsCount={joinedCount}
        onJumpToMyReports={() => {
          setActiveFilter('joined');
          setMenuOpen(false);
        }}
        rememberWorkspace={rememberWorkspace}
        onToggleRememberWorkspace={() => setRememberWorkspace(prev => !prev)}
        onResetDemoData={handleResetDemoData}
      />

      <main className="act-sandbox-main">
        <h1 className="sandbox-page-title">ACTIVITIES</h1>

        {statusNotice && (
          <div className="act-status-toast" role="status" aria-live="polite">
            <span className="act-status-toast-text">{statusNotice}</span>
            <button
              type="button"
              className="act-status-toast-dismiss"
              aria-label="Dismiss status notice"
              onClick={() => setStatusNotice('')}
            >
              OK
            </button>
          </div>
        )}

        {/* 2026 Notice Board with Colour-Classified Pinned Notes */}
        <NoticeBoard
          activities={filteredActivities}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSelectActivity={handleSelectActivity}
        />

        {/* Hanging Polaroid Line Carousel */}
        <PolaroidGalleryCarousel
          items={INITIAL_GALLERY_ITEMS}
          selectedId={selectedPolaroidId}
          onSelectPolaroid={handleSelectPolaroid}
        />
      </main>

      {/* Pinned Note Pop-Out Activity Detail Modal */}
      <ActivityDetailModal
        activity={activeActivity}
        onClose={handleCloseActivityModal}
        onJoin={handleJoinActivity}
        onLeave={handleLeaveActivity}
      />

      {/* Set 1 Gallery Polaroid Tapped Modal (CLOSE PREVIEW) */}
      <GalleryPreviewModal
        item={activeGalleryItem}
        onClose={handleCloseGalleryPreview}
      />

      {/* Shared Pixel Stickers Bottom Navigation */}
      <SandboxBottomNav
        active="activities"
        onSelectNav={navId => {
          if (navId !== 'activities') {
            setStatusNotice(
              `Bottom navigation: "${navId.toUpperCase()}" tab tapped in isolated Activities Sandbox.`
            );
          }
        }}
      />
    </div>
  );
}
