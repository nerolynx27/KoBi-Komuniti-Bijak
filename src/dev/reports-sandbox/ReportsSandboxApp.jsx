import { useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import {
  FolderCard,
  ReportStickerIcon,
  SteppedFieldFrame,
} from './components/FolderCard.jsx';
import { CarouselCard } from './components/CarouselCard.jsx';
import {
  SandboxBottomNav,
  SandboxBurgerDrawer,
  SandboxHeader,
} from './components/SandboxNav.jsx';
import {
  INITIAL_SANDBOX_RECORDS,
  SANDBOX_FACILITIES,
  SANDBOX_FOLDERS,
  SANDBOX_PERSONAS,
  SANDBOX_STORAGE_KEY,
} from './sandboxData.js';

function loadSandboxRecords() {
  try {
    const raw = localStorage.getItem(SANDBOX_STORAGE_KEY);
    if (!raw) return INITIAL_SANDBOX_RECORDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SANDBOX_RECORDS;
  } catch {
    return INITIAL_SANDBOX_RECORDS;
  }
}

function saveSandboxRecords(records) {
  try {
    localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors in sandbox
  }
}

function SampleMaintenanceEvidenceSvg({ type = 'playground-fix', large = false }) {
  const width = large ? 240 : 72;
  const height = large ? 150 : 54;
  return (
    <svg
      className="sandbox-evidence-thumb"
      width={width}
      height={height}
      viewBox="0 0 72 54"
      role="img"
      aria-label={
        type === 'hall-fix'
          ? 'Sample maintenance evidence illustration: brass noticeboard latch fitted'
          : 'Sample maintenance evidence illustration: playground timber step sealed and bolted'
      }
      shapeRendering="crispEdges"
    >
      <rect width="72" height="54" fill="var(--color-vanilla)" />
      <rect x="4" y="4" width="64" height="46" fill="var(--color-sand)" />
      {type === 'hall-fix' ? (
        <g>
          {/* Noticeboard frame & new brass latch */}
          <rect x="10" y="8" width="52" height="38" fill="var(--color-wine)" />
          <rect x="12" y="10" width="48" height="34" fill="var(--color-vanilla)" />
          <rect x="16" y="14" width="18" height="12" fill="var(--color-sand)" />
          <rect x="38" y="14" width="18" height="12" fill="var(--color-gold)" />
          {/* Brass turn-latch detail */}
          <rect x="52" y="24" width="10" height="8" fill="var(--color-wine)" />
          <rect x="54" y="26" width="6" height="4" fill="var(--color-gold)" />
          <rect x="16" y="30" width="30" height="4" fill="var(--color-cherry)" />
        </g>
      ) : (
        <g>
          {/* Refinished timber border & anchor bolts */}
          <rect x="8" y="28" width="56" height="16" fill="var(--color-wine)" />
          <rect x="10" y="30" width="52" height="12" fill="var(--color-gold)" />
          <rect x="10" y="34" width="52" height="2" fill="var(--color-wine)" />
          {/* Two replacement anchor bolts */}
          <rect x="18" y="24" width="8" height="6" fill="var(--color-wine)" />
          <rect x="20" y="26" width="4" height="2" fill="var(--color-vanilla)" />
          <rect x="46" y="24" width="8" height="6" fill="var(--color-wine)" />
          <rect x="48" y="26" width="4" height="2" fill="var(--color-vanilla)" />
          {/* Checkmark stamp */}
          <rect x="50" y="8" width="14" height="12" fill="var(--color-wine)" />
          <rect x="52" y="10" width="10" height="8" fill="var(--color-cherry)" />
          <path d="M54 14h2v2h4v-4h2v6h-8z" fill="var(--color-vanilla)" />
        </g>
      )}
    </svg>
  );
}

export default function ReportsSandboxApp() {
  const [records, setRecords] = useState(() => loadSandboxRecords());
  const [selectedFacilityId, setSelectedFacilityId] = useState('playground-a');
  const [activeFolderIndex, setActiveFolderIndex] = useState(0);

  // Burger menu & app persona state
  const [menuOpen, setMenuOpen] = useState(false);
  const [personaIndex, setPersonaIndex] = useState(0);
  const [workspaceMode, setWorkspaceMode] = useState('resident');
  const [rememberWorkspace, setRememberWorkspace] = useState(true);

  // Report folder form state (preserved across folder switching)
  const [titleValue, setTitleValue] = useState('Broken swing seat');
  const [descValue, setDescValue] = useState(
    'One swing seat is damaged and cannot be used safely.'
  );
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState('');

  // Facility change confirmation when form has unsent input
  const [pendingFacilityId, setPendingFacilityId] = useState(null);

  // Expandable dated history state keyed by record ID
  const [expandedHistoryIds, setExpandedHistoryIds] = useState({
    'sbx-rep-102': true,
  });

  // Evidence modal state for Resolved records
  const [activeEvidenceRecord, setActiveEvidenceRecord] = useState(null);

  const fileInputRef = useRef(null);

  const activePersona = SANDBOX_PERSONAS[personaIndex] || SANDBOX_PERSONAS[0];

  const selectedFacility =
    SANDBOX_FACILITIES.find(item => item.id === selectedFacilityId) ||
    SANDBOX_FACILITIES[0];

  const pendingFacility = pendingFacilityId
    ? SANDBOX_FACILITIES.find(item => item.id === pendingFacilityId)
    : null;

  const hasUnfinishedInput = Boolean(
    titleValue.trim() || descValue.trim() || photo
  );

  // Filter records belonging to the selected facility
  const facilityRecords = records.filter(
    item => item.facilityId === selectedFacility.id
  );
  const receivedRecords = facilityRecords.filter(
    item => item.status === 'received'
  );
  const inProgressRecords = facilityRecords.filter(
    item => item.status === 'in_progress'
  );
  const resolvedRecords = facilityRecords.filter(
    item => item.status === 'resolved'
  );

  function focusVisibleTabForFolder(folderIndex) {
    const folder = SANDBOX_FOLDERS[folderIndex];
    if (!folder) return;
    requestAnimationFrame(() => {
      const targetId = `sandbox-tab-${folder.id}`;
      const el = document.getElementById(targetId);
      el?.focus();
    });
  }

  function handleSelectFolder(folderId, folderIndex) {
    const wasVerticalTabActive =
      document.activeElement?.id === `sandbox-tab-${folderId}-vertical`;
    setActiveFolderIndex(folderIndex);
    if (wasVerticalTabActive) {
      focusVisibleTabForFolder(folderIndex);
    }
  }

  function handleTabKeyDown(event, folderIndex) {
    let nextIndex = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (folderIndex + 1) % SANDBOX_FOLDERS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex =
        (folderIndex - 1 + SANDBOX_FOLDERS.length) % SANDBOX_FOLDERS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = SANDBOX_FOLDERS.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveFolderIndex(nextIndex);
      focusVisibleTabForFolder(nextIndex);
    }
  }

  function handleRequestFacilityChange(nextFacilityId) {
    if (nextFacilityId === selectedFacilityId) return;
    if (hasUnfinishedInput) {
      setPendingFacilityId(nextFacilityId);
      return;
    }
    setSelectedFacilityId(nextFacilityId);
    setFeedbackBanner('');
    setFormError('');
  }

  function handleConfirmDiscardAndSwitch() {
    if (!pendingFacilityId) return;
    if (photo?.objectUrl) URL.revokeObjectURL(photo.objectUrl);
    setTitleValue('');
    setDescValue('');
    setPhoto(null);
    setPhotoError('');
    setFormError('');
    setFeedbackBanner('');
    setSelectedFacilityId(pendingFacilityId);
    setPendingFacilityId(null);
  }

  function handleCancelFacilitySwitch() {
    setPendingFacilityId(null);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Choose a JPEG, PNG or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Choose an image smaller than 5 MB.');
      return;
    }
    if (photo?.objectUrl) URL.revokeObjectURL(photo.objectUrl);
    const objectUrl = URL.createObjectURL(file);
    setPhoto({
      name: file.name,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      objectUrl,
      isSample: false,
    });
    setPhotoError('');
  }

  function handleRemovePhoto() {
    if (photo?.objectUrl) URL.revokeObjectURL(photo.objectUrl);
    setPhoto(null);
    setPhotoError('');
    setPreviewOpen(false);
  }

  function handleSubmitReport(event) {
    event.preventDefault();
    const cleanTitle = titleValue.trim();
    const cleanDesc = descValue.trim();
    if (!cleanTitle || !cleanDesc) {
      setFormError('Enter both a problem title and a description before sending.');
      return;
    }

    const nextRefNumber = 210 + records.length;
    const reference = `KB-${nextRefNumber}`;
    const newRecord = {
      id: `sbx-rep-${Date.now()}`,
      reference,
      facilityId: selectedFacility.id,
      title: cleanTitle,
      description: cleanDesc,
      status: 'received',
      submittedAt: '19 Oct 2026, 1:05 pm',
      photoName: photo?.name || null,
      sample: false,
      updates: [
        {
          id: `upd-${Date.now()}`,
          date: '19 Oct 2026, 1:05 pm',
          actor: `${activePersona.name} (Simulated sandbox submission)`,
          status: 'received',
          note: 'Saved in isolated sandbox browser storage. Awaiting SDP review.',
        },
      ],
    };

    const nextRecords = [newRecord, ...records];
    setRecords(nextRecords);
    saveSandboxRecords(nextRecords);

    if (photo?.objectUrl) URL.revokeObjectURL(photo.objectUrl);
    setTitleValue('');
    setDescValue('');
    setPhoto(null);
    setPhotoError('');
    setFormError('');
    setFeedbackBanner(
      `Simulated report ${reference} saved in sandbox browser storage for ${selectedFacility.name}.`
    );
  }

  function handleSwitchAccount() {
    const nextIdx = (personaIndex + 1) % SANDBOX_PERSONAS.length;
    const nextPersona = SANDBOX_PERSONAS[nextIdx];
    setPersonaIndex(nextIdx);
    setWorkspaceMode(nextPersona.workspace);
  }

  function handleSelectWorkspace(nextWorkspace) {
    setWorkspaceMode(nextWorkspace);
    if (nextWorkspace === 'sdp') {
      const sdpIdx = SANDBOX_PERSONAS.findIndex(p => p.workspace === 'sdp');
      if (sdpIdx !== -1) setPersonaIndex(sdpIdx);
    } else if (activePersona.workspace === 'sdp') {
      setPersonaIndex(0);
    }
  }

  function handleJumpToMyReports() {
    setActiveFolderIndex(1);
    setMenuOpen(false);
  }

  function handleResetSandboxData() {
    try {
      localStorage.removeItem(SANDBOX_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    if (photo?.objectUrl) URL.revokeObjectURL(photo.objectUrl);
    setRecords(INITIAL_SANDBOX_RECORDS);
    setSelectedFacilityId('playground-a');
    setActiveFolderIndex(0);
    setPersonaIndex(0);
    setWorkspaceMode('resident');
    setTitleValue('Broken swing seat');
    setDescValue('One swing seat is damaged and cannot be used safely.');
    setPhoto(null);
    setPhotoError('');
    setFormError('');
    setFeedbackBanner('Demo records and draft reset to default sample state.');
    setMenuOpen(false);
  }

  function toggleHistory(recordId) {
    setExpandedHistoryIds(prev => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  }

  return (
    <div className="sandbox-shell" id="sandbox-top">
      <a className="skip-link" href="#sandbox-main">
        Skip to content
      </a>

      <SandboxHeader
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen(prev => !prev)}
      />

      <SandboxBurgerDrawer
        open={menuOpen}
        activePersona={activePersona}
        onSwitchAccount={handleSwitchAccount}
        workspaceMode={workspaceMode}
        onSelectWorkspace={handleSelectWorkspace}
        onSelectSdpDestination={destLabel => {
          setFeedbackBanner(`SDP workspace shortcut selected: ${destLabel}`);
          setMenuOpen(false);
        }}
        myReportsCount={receivedRecords.length}
        onJumpToMyReports={handleJumpToMyReports}
        rememberWorkspace={rememberWorkspace}
        onToggleRememberWorkspace={() => setRememberWorkspace(prev => !prev)}
        onResetDemoData={handleResetSandboxData}
      />

      <main id="sandbox-main" className="sandbox-landing-main">
        {/* Page Title */}
        <h1 className="sandbox-page-title">REPORTS</h1>

        {/* Facility Carousel */}
        <CarouselCard
          facilities={SANDBOX_FACILITIES}
          selectedId={selectedFacilityId}
          onSelectFacility={handleRequestFacilityChange}
        />

        {/* Full-Width Four-Folder Assembly (Report -> Received -> In progress -> Resolved) */}
        <section
          className="sandbox-folder-assembly"
          aria-label="Facility report folders"
        >
          <div role="tablist" aria-label="Report folders" className="sr-only" />
          {SANDBOX_FOLDERS.map(folder => {
            const folderState =
              folder.index < activeFolderIndex
                ? 'slid-away'
                : folder.index === activeFolderIndex
                  ? 'open'
                  : 'behind';
            const isOpen = folder.index === activeFolderIndex;
            const hasLeftRail = activeFolderIndex > 0 && isOpen;

            return (
              <FolderCard
                key={folder.id}
                id={folder.id}
                label={folder.label}
                folderIndex={folder.index}
                totalFolders={SANDBOX_FOLDERS.length}
                state={folderState}
                active={isOpen}
                showRightTab
                rightTabSequenced
                fullBleed
                hasLeftRail={hasLeftRail}
                topTabId={`sandbox-tab-${folder.id}`}
                panelId={`sandbox-panel-${folder.id}`}
                onSelectTopTab={handleSelectFolder}
                onSelectRightTab={handleSelectFolder}
                onTabKeyDown={handleTabKeyDown}
              >
                {/* 1. REPORT FOLDER */}
                {folder.id === 'report' && (
                  <div className="sandbox-report-sheet-content">
                    <div className="sandbox-sheet-title-row">
                      <div className="sandbox-sheet-heading-block">
                        <h2 className="sandbox-sheet-title">REPORT A PROBLEM</h2>
                        <p className="sandbox-facility-context-bar">
                          {selectedFacility.name.toUpperCase()}
                        </p>
                      </div>
                      <ReportStickerIcon />
                    </div>

                    <form
                      className="sandbox-report-form"
                      onSubmit={handleSubmitReport}
                      noValidate
                    >
                      <div className="sandbox-field">
                        <label
                          htmlFor="sbx-problem-title"
                          className="sandbox-field-label"
                        >
                          PROBLEM TITLE
                        </label>
                        <SteppedFieldFrame>
                          <input
                            id="sbx-problem-title"
                            type="text"
                            className="sandbox-input"
                            placeholder="Short summary of the problem"
                            value={titleValue}
                            onChange={event => setTitleValue(event.target.value)}
                            required
                          />
                        </SteppedFieldFrame>
                      </div>

                      <div className="sandbox-field">
                        <label
                          htmlFor="sbx-problem-desc"
                          className="sandbox-field-label"
                        >
                          DESCRIPTION
                        </label>
                        <SteppedFieldFrame>
                          <textarea
                            id="sbx-problem-desc"
                            className="sandbox-textarea"
                            rows={2}
                            placeholder="Describe what is damaged or unsafe..."
                            value={descValue}
                            onChange={event => setDescValue(event.target.value)}
                            required
                          />
                        </SteppedFieldFrame>
                      </div>

                      <div className="sandbox-photo-row">
                        <span className="sandbox-field-label" id="sbx-photo-label">
                          PHOTO (OPTIONAL)
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          aria-labelledby="sbx-photo-label"
                          onChange={handleFileChange}
                        />

                        {!photo ? (
                          <button
                            type="button"
                            className="sandbox-add-photo-link"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Icon name="camera" />
                            <span>Add photo</span>
                          </button>
                        ) : (
                          <div className="sandbox-photo-attached">
                            <div className="sandbox-photo-meta">
                              <Icon name="image" />
                              <span>
                                <strong>{photo.name}</strong> ({photo.sizeLabel}{' '}
                                · Preview only)
                              </span>
                            </div>
                            <div className="sandbox-photo-actions">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setPreviewOpen(true)}
                              >
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Replace photo
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                icon="trash"
                                onClick={handleRemovePhoto}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}

                        {photoError && (
                          <p className="field-error" role="alert">
                            <Icon name="warning" />
                            <span>{photoError}</span>
                          </p>
                        )}
                      </div>

                      {formError && (
                        <p className="field-error" role="alert">
                          <Icon name="warning" />
                          <span>{formError}</span>
                        </p>
                      )}

                      {feedbackBanner && (
                        <div className="sandbox-save-notice" role="status">
                          <span>{feedbackBanner}</span>
                          <div className="sandbox-save-notice-actions">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSelectFolder('received', 1)}
                            >
                              View in Received ({receivedRecords.length})
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="sandbox-submit-wrap">
                        <Button type="submit" variant="primary" fullWidth>
                          SEND REPORT
                        </Button>
                      </div>

                      <p className="sandbox-demo-caption">
                        Demo only · Saved on this browser
                      </p>
                    </form>
                  </div>
                )}

                {/* 2. RECEIVED FOLDER */}
                {folder.id === 'received' && (
                  <div className="sandbox-report-sheet-content">
                    <div className="sandbox-sheet-title-row">
                      <div className="sandbox-sheet-heading-block">
                        <h2 className="sandbox-sheet-title">RECEIVED REPORTS</h2>
                        <p className="sandbox-facility-context-bar">
                          {selectedFacility.name.toUpperCase()} ·{' '}
                          {receivedRecords.length} AWAITING ACTION
                        </p>
                      </div>
                      <ReportStickerIcon />
                    </div>

                    {receivedRecords.length === 0 ? (
                      <div className="sandbox-empty-state">
                        <h3 className="sandbox-empty-title">
                          NO RECEIVED REPORTS FOR {selectedFacility.name.toUpperCase()}
                        </h3>
                        <p className="sandbox-empty-copy">
                          No reports are currently awaiting initial review for{' '}
                          {selectedFacility.name}. You can submit a simulated
                          report in the Report folder.
                        </p>
                      </div>
                    ) : (
                      <div className="sandbox-records-list">
                        {receivedRecords.map(item => (
                          <article key={item.id} className="sandbox-record-card">
                            <div className="sandbox-record-top">
                              <div className="sandbox-record-badges">
                                <span className="sandbox-ref-pill">
                                  REF {item.reference}
                                </span>
                                <span className="sandbox-status-pill">
                                  RECEIVED · AWAITING ACTION
                                </span>
                              </div>
                              <span className="sandbox-source-tag">
                                {item.sample
                                  ? 'Sample record'
                                  : 'Simulated submission · Sandbox'}
                              </span>
                            </div>

                            <h3 className="sandbox-record-title">{item.title}</h3>
                            <p className="sandbox-record-desc">{item.description}</p>

                            <div className="sandbox-record-dates">
                              <span>Submitted: {item.submittedAt}</span>
                              {item.photoName && (
                                <span>Attached photo: {item.photoName}</span>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    )}

                    <p className="sandbox-resident-note">
                      Resident view · Status changes are managed by SDP staff.
                    </p>
                  </div>
                )}

                {/* 3. IN PROGRESS FOLDER */}
                {folder.id === 'in_progress' && (
                  <div className="sandbox-report-sheet-content">
                    <div className="sandbox-sheet-title-row">
                      <div className="sandbox-sheet-heading-block">
                        <h2 className="sandbox-sheet-title">IN PROGRESS</h2>
                        <p className="sandbox-facility-context-bar">
                          {selectedFacility.name.toUpperCase()} ·{' '}
                          {inProgressRecords.length} ACTIVE WORK
                        </p>
                      </div>
                      <ReportStickerIcon />
                    </div>

                    {inProgressRecords.length === 0 ? (
                      <div className="sandbox-empty-state">
                        <h3 className="sandbox-empty-title">
                          NO IN-PROGRESS WORK FOR {selectedFacility.name.toUpperCase()}
                        </h3>
                        <p className="sandbox-empty-copy">
                          There are no active maintenance tasks recorded for{' '}
                          {selectedFacility.name} right now.
                        </p>
                      </div>
                    ) : (
                      <div className="sandbox-records-list">
                        {inProgressRecords.map(item => {
                          const isExpanded = Boolean(expandedHistoryIds[item.id]);
                          const historyId = `sbx-history-${item.id}`;
                          return (
                            <article key={item.id} className="sandbox-record-card">
                              <div className="sandbox-record-top">
                                <div className="sandbox-record-badges">
                                  <span className="sandbox-ref-pill">
                                    REF {item.reference}
                                  </span>
                                  <span className="sandbox-status-pill is-in-progress">
                                    IN PROGRESS
                                  </span>
                                </div>
                                <span className="sandbox-source-tag">
                                  Sample record
                                </span>
                              </div>

                              <h3 className="sandbox-record-title">{item.title}</h3>
                              <p className="sandbox-record-desc">
                                {item.description}
                              </p>

                              <div className="sandbox-record-dates">
                                <span>Submitted: {item.submittedAt}</span>
                                <span>Updated: {item.updatedAt}</span>
                              </div>

                              <div className="sandbox-record-callout is-gold">
                                <span className="sandbox-record-callout-label">
                                  LATEST WORK UPDATE · {item.updatedAt}
                                </span>
                                <p className="sandbox-record-callout-body">
                                  {item.latestUpdate}
                                </p>
                              </div>

                              <button
                                type="button"
                                className="sandbox-history-toggle"
                                aria-expanded={isExpanded}
                                aria-controls={historyId}
                                onClick={() => toggleHistory(item.id)}
                              >
                                <span>
                                  {isExpanded
                                    ? `HIDE DATED HISTORY (${item.updates.length})`
                                    : `VIEW DATED HISTORY (${item.updates.length})`}
                                </span>
                                <span aria-hidden="true">
                                  {isExpanded ? '▲' : '▼'}
                                </span>
                              </button>

                              {isExpanded && (
                                <ol
                                  id={historyId}
                                  className="sandbox-history-list"
                                  aria-label={`Dated history for ${item.reference}`}
                                >
                                  {item.updates.map(upd => (
                                    <li
                                      key={upd.id}
                                      className="sandbox-history-item"
                                    >
                                      <div className="sandbox-history-head">
                                        <span>{upd.date}</span>
                                        <span>{upd.actor}</span>
                                      </div>
                                      <p className="sandbox-history-note">
                                        {upd.note}
                                      </p>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}

                    <p className="sandbox-resident-note">
                      Resident view · Work updates are posted by SDP maintenance teams.
                    </p>
                  </div>
                )}

                {/* 4. RESOLVED FOLDER */}
                {folder.id === 'resolved' && (
                  <div className="sandbox-report-sheet-content">
                    <div className="sandbox-sheet-title-row">
                      <div className="sandbox-sheet-heading-block">
                        <h2 className="sandbox-sheet-title">RESOLVED REPORTS</h2>
                        <p className="sandbox-facility-context-bar">
                          {selectedFacility.name.toUpperCase()} ·{' '}
                          {resolvedRecords.length} COMPLETED
                        </p>
                      </div>
                      <ReportStickerIcon />
                    </div>

                    {resolvedRecords.length === 0 ? (
                      <div className="sandbox-empty-state">
                        <h3 className="sandbox-empty-title">
                          NO RESOLVED REPORTS FOR {selectedFacility.name.toUpperCase()}
                        </h3>
                        <p className="sandbox-empty-copy">
                          No completed maintenance records are listed for{' '}
                          {selectedFacility.name} yet.
                        </p>
                      </div>
                    ) : (
                      <div className="sandbox-records-list">
                        {resolvedRecords.map(item => {
                          const isExpanded = Boolean(expandedHistoryIds[item.id]);
                          const historyId = `sbx-history-${item.id}`;
                          return (
                            <article key={item.id} className="sandbox-record-card">
                              <div className="sandbox-record-top">
                                <div className="sandbox-record-badges">
                                  <span className="sandbox-ref-pill">
                                    REF {item.reference}
                                  </span>
                                  <span className="sandbox-status-pill is-resolved">
                                    RESOLVED
                                  </span>
                                </div>
                                <span className="sandbox-source-tag">
                                  Sample record
                                </span>
                              </div>

                              <h3 className="sandbox-record-title">{item.title}</h3>
                              <p className="sandbox-record-desc">
                                {item.description}
                              </p>

                              <div className="sandbox-record-dates">
                                <span>Completed: {item.completedAt}</span>
                                <span>Submitted: {item.submittedAt}</span>
                              </div>

                              <div className="sandbox-record-callout">
                                <span className="sandbox-record-callout-label">
                                  RESOLUTION NOTE
                                </span>
                                <p className="sandbox-record-callout-body">
                                  {item.resolutionNote}
                                </p>
                              </div>

                              <div className="sandbox-evidence-card">
                                <span className="sandbox-record-callout-label">
                                  SAMPLE COMPLETION EVIDENCE
                                </span>
                                <div className="sandbox-evidence-row">
                                  <SampleMaintenanceEvidenceSvg
                                    type={item.evidenceType}
                                  />
                                  <div className="sandbox-evidence-meta">
                                    <p className="sandbox-evidence-caption">
                                      {item.evidenceLabel}
                                    </p>
                                    <div>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                          setActiveEvidenceRecord(item)
                                        }
                                      >
                                        Inspect evidence
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="sandbox-history-toggle"
                                aria-expanded={isExpanded}
                                aria-controls={historyId}
                                onClick={() => toggleHistory(item.id)}
                              >
                                <span>
                                  {isExpanded
                                    ? `HIDE DATED HISTORY (${item.updates.length})`
                                    : `VIEW DATED HISTORY (${item.updates.length})`}
                                </span>
                                <span aria-hidden="true">
                                  {isExpanded ? '▲' : '▼'}
                                </span>
                              </button>

                              {isExpanded && (
                                <ol
                                  id={historyId}
                                  className="sandbox-history-list"
                                  aria-label={`Dated history for ${item.reference}`}
                                >
                                  {item.updates.map(upd => (
                                    <li
                                      key={upd.id}
                                      className="sandbox-history-item"
                                    >
                                      <div className="sandbox-history-head">
                                        <span>{upd.date}</span>
                                        <span>{upd.actor}</span>
                                      </div>
                                      <p className="sandbox-history-note">
                                        {upd.note}
                                      </p>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}

                    <p className="sandbox-resident-note">
                      Resident view · Completed reports include SDP resolution notes and evidence.
                    </p>
                  </div>
                )}
              </FolderCard>
            );
          })}
        </section>
      </main>

      {/* Unsaved form draft confirmation dialog when switching facilities */}
      {pendingFacility && (
        <div
          className="sandbox-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sbx-discard-dialog-title"
        >
          <div className="sandbox-modal-card">
            <div className="sandbox-modal-head">
              <h2 id="sbx-discard-dialog-title">Discard unfinished report?</h2>
              <IconButton
                icon="close"
                label="Cancel facility change"
                onClick={handleCancelFacilitySwitch}
              />
            </div>
            <p>
              You have unsent report input for{' '}
              <strong>{selectedFacility.name}</strong>. Switching to{' '}
              <strong>{pendingFacility.name}</strong> will discard your current
              draft.
            </p>
            <div className="sandbox-modal-actions">
              <Button variant="secondary" onClick={handleCancelFacilitySwitch}>
                Keep editing
              </Button>
              <Button variant="danger" onClick={handleConfirmDiscardAndSwitch}>
                Discard changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Attached photo preview modal */}
      {previewOpen && photo && (
        <div
          className="sandbox-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Selected photo preview"
        >
          <div className="sandbox-modal-card">
            <div className="sandbox-modal-head">
              <h2>Photo preview</h2>
              <IconButton
                icon="close"
                label="Close photo preview"
                onClick={() => setPreviewOpen(false)}
              />
            </div>
            <img
              src={photo.objectUrl}
              alt={`Selected report attachment ${photo.name}`}
              className="sandbox-photo-preview-img"
            />
            <p className="helper">Preview only — local sandbox attachment.</p>
            <Button variant="quiet" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Sample completion evidence preview modal */}
      {activeEvidenceRecord && (
        <div
          className="sandbox-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sbx-evidence-modal-title"
        >
          <div className="sandbox-modal-card">
            <div className="sandbox-modal-head">
              <h2 id="sbx-evidence-modal-title">
                Sample evidence · {activeEvidenceRecord.reference}
              </h2>
              <IconButton
                icon="close"
                label="Close sample evidence preview"
                onClick={() => setActiveEvidenceRecord(null)}
              />
            </div>
            <SampleMaintenanceEvidenceSvg
              type={activeEvidenceRecord.evidenceType}
              large
            />
            <p>
              <strong>{activeEvidenceRecord.title}</strong> —{' '}
              {activeEvidenceRecord.evidenceLabel}
            </p>
            <p className="helper">
              Completed: {activeEvidenceRecord.completedAt} · Sample maintenance
              evidence (Sandbox preview).
            </p>
            <div className="sandbox-modal-actions">
              <Button
                variant="secondary"
                onClick={() => setActiveEvidenceRecord(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <SandboxBottomNav active="reports" />
    </div>
  );
}
