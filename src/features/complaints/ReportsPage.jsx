import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, ActionLink } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { FeedbackState } from '../../components/ui/Feedback.jsx';
import { FolderCard, ReportStickerIcon, SteppedFieldFrame } from './components/FolderCard.jsx';
import { CarouselCard } from './components/CarouselCard.jsx';
import { selectFacilities, selectVisibleComplaints } from './complaintSelectors.js';
import { useCommandForm } from '../../app/useCommandForm.js';
import { newDemoId } from '../../lib/demoStore.js';
import { attachmentMetadata, createPhotoSelectionValidator, demoPhotos } from '../../lib/demoPhotos.js';

const FOLDERS = [
  { id: 'report', label: 'Report', index: 0 },
  { id: 'received', label: 'Received', index: 1 },
  { id: 'in_progress', label: 'In progress', index: 2 },
  { id: 'resolved', label: 'Resolved', index: 3 },
];

function parseReportDescription(raw) {
  if (!raw || typeof raw !== 'string') return { title: 'Facility issue', description: '' };
  const idx = raw.indexOf(' — ');
  if (idx !== -1) {
    return {
      title: raw.slice(0, idx).trim() || 'Facility issue',
      description: raw.slice(idx + 3).trim(),
    };
  }
  return {
    title: 'Facility issue',
    description: raw.trim(),
  };
}

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (!Number.isFinite(d.getTime())) return isoString;
    return d.toLocaleDateString('en-MY', {
      timeZone: 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

function formatRefId(id) {
  if (!id) return '#cmp-01';
  const clean = id.replace(/[^a-zA-Z0-9]/g, '');
  return `#cmp-${clean.slice(-4).toLowerCase()}`;
}

function ResolutionEvidenceIllustration({ large = false }) {
  const width = large ? 240 : 72;
  const height = large ? 150 : 54;
  return (
    <svg
      className="sandbox-evidence-thumb"
      width={width}
      height={height}
      viewBox="0 0 72 54"
      role="img"
      aria-label="Maintenance resolution evidence: component inspected, repaired and verified"
      shapeRendering="crispEdges"
    >
      <rect width="72" height="54" fill="var(--color-vanilla)" />
      <rect x="4" y="4" width="64" height="46" fill="var(--color-sand)" />
      <rect x="8" y="28" width="56" height="16" fill="var(--color-wine)" />
      <rect x="10" y="30" width="52" height="12" fill="var(--color-gold)" />
      <rect x="10" y="34" width="52" height="2" fill="var(--color-wine)" />
      <rect x="18" y="24" width="8" height="6" fill="var(--color-wine)" />
      <rect x="20" y="26" width="4" height="2" fill="var(--color-vanilla)" />
      <rect x="46" y="24" width="8" height="6" fill="var(--color-wine)" />
      <rect x="48" y="26" width="4" height="2" fill="var(--color-vanilla)" />
      <rect x="50" y="8" width="14" height="12" fill="var(--color-wine)" />
      <rect x="52" y="10" width="10" height="8" fill="var(--color-cherry)" />
      <path d="M54 14h2v2h4v-4h2v6h-8z" fill="var(--color-vanilla)" />
    </svg>
  );
}

export function ReportsPage(props) {
  if (props.actor?.role !== 'resident') {
    return (
      <FeedbackState title="Resident demo view required">
        <Button onClick={() => props.session?.setView('resident')}>Switch to resident demo</Button>
      </FeedbackState>
    );
  }
  return <ResidentReportsPage {...props} />;
}

function ResidentReportsPage({
  data,
  actor,
  store,
  snapshot,
  registerGuard,
  notify,
  navigate,
  showPhoto,
  route,
}) {

  const facilities = selectFacilities(data);
  const initialFacilityId = (route?.facilityId && facilities.some(f => f.id === route.facilityId))
    ? route.facilityId
    : facilities[0]?.id || '';

  const [selectedFacilityId, setSelectedFacilityId] = useState(initialFacilityId);
  const [activeFolderIndex, setActiveFolderIndex] = useState(0);

  // Form states for Folder 0 (Report)
  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPending, setPhotoPending] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [localFormError, setLocalFormError] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState('');

  // Facility switch confirmation when draft is dirty
  const [pendingFacilityId, setPendingFacilityId] = useState(null);

  // Expandable dated history state
  const [expandedHistoryIds, setExpandedHistoryIds] = useState({});

  // Active evidence preview modal
  const [activeEvidenceRecord, setActiveEvidenceRecord] = useState(null);

  const fileInputRef = useRef(null);
  const validator = useRef(null);
  if (!validator.current) validator.current = createPhotoSelectionValidator();

  const selectedFacility = facilities.find(item => item.id === selectedFacilityId) || facilities[0];
  const pendingFacility = pendingFacilityId ? facilities.find(item => item.id === pendingFacilityId) : null;

  const hasUnfinishedInput = Boolean(titleValue.trim() || descValue.trim() || photo);

  // Sync route facility param if arriving via deep-link
  useEffect(() => {
    if (route?.facilityId && facilities.some(f => f.id === route.facilityId)) {
      setSelectedFacilityId(route.facilityId);
      setActiveFolderIndex(0);
    } else if (route?.name === 'report-new') {
      setActiveFolderIndex(0);
    }
  }, [route?.facilityId, route?.name, facilities]);

  // Command form integration for complaints.create
  const form = useCommandForm({
    store,
    snapshot,
    registerGuard,
    busy: photoPending,
    dirty: hasUnfinishedInput,
    onDiscard: () => {
      handleRemovePhoto();
      setTitleValue('');
      setDescValue('');
      setLocalFormError('');
      setFeedbackBanner('');
    },
    onSuccess: last => {
      notify?.('Report saved on this browser.');
      setTitleValue('');
      setDescValue('');
      setPhoto(null);
      setLocalFormError('');
      if (route?.name === 'report-new') {
        navigate(`reports/${last?.entityId}`);
        return;
      }
      setFeedbackBanner(
        `Report ${formatRefId(last?.entityId)} saved in demo storage for ${selectedFacility?.name || 'facility'}.`
      );
    },
  });

  function focusVisibleTabForFolder(folderIndex) {
    const folder = FOLDERS[folderIndex];
    if (!folder) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`reports-tab-${folder.id}`);
      el?.focus();
    });
  }

  function handleSelectFolder(folderId, folderIndex) {
    const wasVerticalTabActive = document.activeElement?.id === `reports-tab-${folderId}-vertical`;
    setActiveFolderIndex(folderIndex);
    if (wasVerticalTabActive) {
      focusVisibleTabForFolder(folderIndex);
    }
  }

  function handleTabKeyDown(event, folderIndex) {
    let nextIndex = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (folderIndex + 1) % FOLDERS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (folderIndex - 1 + FOLDERS.length) % FOLDERS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = FOLDERS.length - 1;
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
    setLocalFormError('');
  }

  function handleConfirmDiscardAndSwitch() {
    if (!pendingFacilityId) return;
    handleRemovePhoto();
    setTitleValue('');
    setDescValue('');
    setLocalFormError('');
    setFeedbackBanner('');
    setSelectedFacilityId(pendingFacilityId);
    setPendingFacilityId(null);
  }

  function handleCancelFacilitySwitch() {
    setPendingFacilityId(null);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setPhotoPending(true);
    setPhotoError('');

    const result = await validator.current.validate(file);
    if (!result) return;
    setPhotoPending(false);

    if (result.error) {
      setPhotoError(result.error.message || 'Choose a JPEG, PNG or WebP image under 5 MB.');
      return;
    }

    const nextPhoto = {
      id: globalThis.crypto.randomUUID(),
      kind: 'report',
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      file,
      objectUrl: URL.createObjectURL(file),
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    };

    demoPhotos.put(nextPhoto.id, file);
    setPhoto(nextPhoto);
    setPhotoError('');
  }

  function handleRemovePhoto() {
    if (photo) {
      if (photo.objectUrl) URL.revokeObjectURL(photo.objectUrl);
      demoPhotos.delete(photo.id);
    }
    setPhoto(null);
    setPhotoError('');
    setPreviewOpen(false);
  }

  function handleSubmitReport(event) {
    event.preventDefault();
    const cleanTitle = titleValue.trim();
    const cleanDesc = descValue.trim();

    if (!cleanDesc) {
      setLocalFormError('Enter a description before sending.');
      document.getElementById('problem-desc-input')?.focus();
      return;
    }

    const cleanPayloadDescription = cleanTitle ? `${cleanTitle} — ${cleanDesc}` : cleanDesc;
    if (cleanPayloadDescription.length < 10) {
      setLocalFormError('Describe the issue using at least 10 characters.');
      document.getElementById('problem-desc-input')?.focus();
      return;
    }

    if (!selectedFacility) {
      setLocalFormError('Choose an available facility.');
      return;
    }

    setLocalFormError('');
    form.submit('complaints.create', {
      id: newDemoId(),
      facilityId: selectedFacility.id,
      description: cleanPayloadDescription,
      attachment: attachmentMetadata(photo),
    });
  }

  function toggleHistory(recordId) {
    setExpandedHistoryIds(prev => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  }

  // Filter complaints scoped to the currently selected facility and actor
  const receivedComplaints = selectVisibleComplaints(data, selectedFacility?.id, 'received', actor);
  const inProgressComplaints = selectVisibleComplaints(data, selectedFacility?.id, 'in_progress', actor);
  const resolvedComplaints = selectVisibleComplaints(data, selectedFacility?.id, 'resolved', actor);

  return (
    <div className="reports-page-bleed" id="reports-view-root">
      {/* Accessible facility select for keyboard / screen readers / test selectors */}
      <label htmlFor="facility-accessible-select" className="sr-only">Facility</label>
      <select
        id="facility-accessible-select"
        className="sandbox-accessible-control"
        value={selectedFacility?.id || ''}
        onChange={event => handleRequestFacilityChange(event.target.value)}
      >
        {facilities.map(f => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      {/* Facility Selection Carousel */}
      <CarouselCard
        facilities={facilities}
        selectedId={selectedFacility?.id}
        onSelectFacility={handleRequestFacilityChange}
      />

      {/* 4-Folder Assembly (Report -> Received -> In progress -> Resolved) */}
      <section
        className="sandbox-folder-assembly"
        aria-label="Report folders"
      >
        <div role="tablist" aria-label="Report folders" className="sr-only" />
        {FOLDERS.map(folder => {
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
              totalFolders={FOLDERS.length}
              state={folderState}
              active={isOpen}
              showRightTab
              rightTabSequenced
              fullBleed
              hasLeftRail={hasLeftRail}
              topTabId={`reports-tab-${folder.id}`}
              panelId={`reports-panel-${folder.id}`}
              onSelectTopTab={handleSelectFolder}
              onSelectRightTab={handleSelectFolder}
              onTabKeyDown={handleTabKeyDown}
            >
              {/* ---------------- 0. REPORT FOLDER ---------------- */}
              {folder.id === 'report' && (
                <div className="sandbox-report-sheet-content">
                  <div className="sandbox-sheet-title-row">
                    <div className="sandbox-sheet-heading-block">
                      <h2 className="sandbox-sheet-title">REPORT A PROBLEM</h2>
                      <p className="sandbox-facility-context-bar">
                        {selectedFacility?.name?.toUpperCase() || 'FACILITY'}
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
                        htmlFor="problem-title-input"
                        className="sandbox-field-label"
                      >
                        Problem title
                      </label>
                      <SteppedFieldFrame>
                        <input
                          id="problem-title-input"
                          type="text"
                          className="sandbox-input"
                          placeholder="Short summary of the problem"
                          value={titleValue}
                          onChange={event => setTitleValue(event.target.value)}
                        />
                      </SteppedFieldFrame>
                    </div>

                    <div className="sandbox-field">
                      <label
                        htmlFor="problem-desc-input"
                        className="sandbox-field-label"
                      >
                        Description
                      </label>
                      <SteppedFieldFrame>
                        <textarea
                          id="problem-desc-input"
                          className="sandbox-textarea"
                          rows={2}
                          placeholder="Describe what is damaged or unsafe..."
                          value={descValue}
                          onChange={event => {
                            setDescValue(event.target.value);
                            if (localFormError) setLocalFormError('');
                          }}
                          aria-invalid={Boolean(localFormError && (!descValue.trim() || descValue.trim().length < 10)) ? 'true' : undefined}
                          required
                        />
                      </SteppedFieldFrame>
                    </div>

                    <div className="sandbox-photo-row">
                      <span className="sandbox-field-label" id="report-photo-label">
                        Report photo (optional)
                      </span>
                      <input
                        ref={fileInputRef}
                        id="report-photo-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sandbox-accessible-control"
                        aria-label="Report photo (optional)"
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
                            {photo.objectUrl && (
                              <img
                                src={photo.objectUrl}
                                alt="Selected report photo"
                                className="sandbox-photo-thumb"
                                style={{
                                  width: 44,
                                  height: 44,
                                  objectFit: 'cover',
                                  border: '2px solid var(--color-wine)',
                                  flex: 'none',
                                }}
                              />
                            )}
                            <Icon name="image" />
                            <span>
                              <strong>{photo.file_name}</strong> ({photo.sizeLabel} · Preview only)
                            </span>
                          </div>
                          <div className="sandbox-photo-actions">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                if (showPhoto) {
                                  showPhoto(attachmentMetadata(photo) || photo);
                                } else {
                                  setPreviewOpen(true);
                                }
                              }}
                            >
                              Preview photo
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
                              Remove photo
                            </Button>
                          </div>
                        </div>
                      )}

                      {photoPending && <p role="status">Checking image…</p>}

                      {photoError && (
                        <p className="field-error" role="alert">
                          <Icon name="warning" />
                          <span>{photoError}</span>
                        </p>
                      )}
                    </div>

                    {(localFormError || form.error) && (
                      <p className="field-error" role="alert">
                        <Icon name="warning" />
                        <span>{localFormError || form.error?.message}</span>
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
                            View in Received ({receivedComplaints.length}) →
                          </Button>
                          {selectedFacility && (
                            <ActionLink
                              href={`#map?facility=${encodeURIComponent(selectedFacility.id)}`}
                              icon="map"
                            >
                              View on map
                            </ActionLink>
                          )}
                        </div>
                      </div>
                    )}

                    {form.awaitingRecovery && (
                      <div className="form-actions">
                        <Button onClick={form.retry}>Retry storage</Button>
                        <Button variant="quiet" onClick={() => form.clearPending()}>
                          Discard pending change
                        </Button>
                      </div>
                    )}

                    <div className="sandbox-submit-wrap">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={photoPending || form.awaitingRecovery}
                      >
                        Send report
                      </Button>
                    </div>

                    <p className="sandbox-demo-caption">
                      Demo only · Saved on this browser
                    </p>
                  </form>
                </div>
              )}

              {/* ---------------- 1. RECEIVED FOLDER ---------------- */}
              {folder.id === 'received' && (
                <div className="sandbox-report-sheet-content">
                  <div className="sandbox-sheet-title-row">
                    <div className="sandbox-sheet-heading-block">
                      <h2 className="sandbox-sheet-title">RECEIVED REPORTS</h2>
                      <p className="sandbox-facility-context-bar">
                        {selectedFacility?.name?.toUpperCase() || 'FACILITY'} · {receivedComplaints.length} AWAITING ACTION
                      </p>
                    </div>
                    <ReportStickerIcon />
                  </div>

                  {receivedComplaints.length === 0 ? (
                    <div className="sandbox-empty-state">
                      <h3 className="sandbox-empty-title">
                        NO RECEIVED REPORTS FOR {selectedFacility?.name?.toUpperCase()}
                      </h3>
                      <p className="sandbox-empty-copy">
                        No reports are currently awaiting initial review for {selectedFacility?.name}.
                        You can submit a simulated report in the Report folder.
                      </p>
                    </div>
                  ) : (
                    <div className="sandbox-records-list">
                      {receivedComplaints.map(item => {
                        const parsed = parseReportDescription(item.description);
                        const hasPhoto = Boolean(item.photo_path);
                        return (
                          <article key={item.id} className="sandbox-record-card">
                            <div className="sandbox-record-top">
                              <div className="sandbox-record-badges">
                                <span className="sandbox-ref-pill">
                                  REF {formatRefId(item.id)}
                                </span>
                                <span className="sandbox-status-pill">
                                  RECEIVED · AWAITING ACTION
                                </span>
                              </div>
                              <ActionLink
                                variant="text"
                                href={`#reports/${item.id}`}
                                className="sandbox-source-tag"
                              >
                                View full record →
                              </ActionLink>
                            </div>

                            <h3 className="sandbox-record-title">{parsed.title}</h3>
                            <p className="sandbox-record-desc">{parsed.description}</p>

                            <div className="sandbox-record-dates">
                              <span>Submitted: {formatDate(item.created_at)}</span>
                              {hasPhoto && (
                                <button
                                  type="button"
                                  className="action-link"
                                  style={{ padding: 0, textDecoration: 'underline' }}
                                  onClick={() => {
                                    const att = data.attachments?.find(
                                      a => `demo-attachment:${a.id}` === item.photo_path
                                    );
                                    if (att && showPhoto) showPhoto(att);
                                  }}
                                >
                                  Photo attached
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}

                  <p className="sandbox-resident-note">
                    Resident view · Status changes are managed by SDP staff.
                  </p>
                </div>
              )}

              {/* ---------------- 2. IN PROGRESS FOLDER ---------------- */}
              {folder.id === 'in_progress' && (
                <div className="sandbox-report-sheet-content">
                  <div className="sandbox-sheet-title-row">
                    <div className="sandbox-sheet-heading-block">
                      <h2 className="sandbox-sheet-title">IN PROGRESS</h2>
                      <p className="sandbox-facility-context-bar">
                        {selectedFacility?.name?.toUpperCase() || 'FACILITY'} · {inProgressComplaints.length} ACTIVE WORK
                      </p>
                    </div>
                    <ReportStickerIcon />
                  </div>

                  {inProgressComplaints.length === 0 ? (
                    <div className="sandbox-empty-state">
                      <h3 className="sandbox-empty-title">
                        NO IN-PROGRESS WORK FOR {selectedFacility?.name?.toUpperCase()}
                      </h3>
                      <p className="sandbox-empty-copy">
                        There are no active maintenance tasks recorded for {selectedFacility?.name} right now.
                      </p>
                    </div>
                  ) : (
                    <div className="sandbox-records-list">
                      {inProgressComplaints.map(item => {
                        const parsed = parseReportDescription(item.description);
                        const updates = data.complaint_updates?.filter(u => u.complaint_id === item.id) || [];
                        const latestUpdate = updates.at(-1);
                        const isExpanded = Boolean(expandedHistoryIds[item.id]);
                        const historyId = `history-${item.id}`;

                        return (
                          <article key={item.id} className="sandbox-record-card">
                            <div className="sandbox-record-top">
                              <div className="sandbox-record-badges">
                                <span className="sandbox-ref-pill">
                                  REF {formatRefId(item.id)}
                                </span>
                                <span className="sandbox-status-pill is-in-progress">
                                  IN PROGRESS
                                </span>
                              </div>
                              <ActionLink
                                variant="text"
                                href={`#reports/${item.id}`}
                                className="sandbox-source-tag"
                              >
                                View full record →
                              </ActionLink>
                            </div>

                            <h3 className="sandbox-record-title">{parsed.title}</h3>
                            <p className="sandbox-record-desc">{parsed.description}</p>

                            <div className="sandbox-record-dates">
                              <span>Submitted: {formatDate(item.created_at)}</span>
                              <span>Updated: {formatDate(item.updated_at)}</span>
                            </div>

                            {latestUpdate && (
                              <div className="sandbox-record-callout is-gold">
                                <span className="sandbox-record-callout-label">
                                  LATEST WORK UPDATE · {formatDate(latestUpdate.created_at)}
                                </span>
                                <p className="sandbox-record-callout-body">
                                  {latestUpdate.note}
                                </p>
                              </div>
                            )}

                            {updates.length > 0 && (
                              <>
                                <button
                                  type="button"
                                  className="sandbox-history-toggle"
                                  aria-expanded={isExpanded}
                                  aria-controls={historyId}
                                  onClick={() => toggleHistory(item.id)}
                                >
                                  <span>
                                    {isExpanded
                                      ? `HIDE DATED HISTORY (${updates.length})`
                                      : `VIEW DATED HISTORY (${updates.length})`}
                                  </span>
                                  <span aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
                                </button>

                                {isExpanded && (
                                  <ol
                                    id={historyId}
                                    className="sandbox-history-list"
                                    aria-label={`Dated history for ${formatRefId(item.id)}`}
                                  >
                                    {updates.map(upd => (
                                      <li key={upd.id} className="sandbox-history-item">
                                        <div className="sandbox-history-head">
                                          <span>{formatDate(upd.created_at)}</span>
                                          <span>{upd.status?.toUpperCase() || 'UPDATE'}</span>
                                        </div>
                                        <p className="sandbox-history-note">{upd.note}</p>
                                      </li>
                                    ))}
                                  </ol>
                                )}
                              </>
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

              {/* ---------------- 3. RESOLVED FOLDER ---------------- */}
              {folder.id === 'resolved' && (
                <div className="sandbox-report-sheet-content">
                  <div className="sandbox-sheet-title-row">
                    <div className="sandbox-sheet-heading-block">
                      <h2 className="sandbox-sheet-title">RESOLVED REPORTS</h2>
                      <p className="sandbox-facility-context-bar">
                        {selectedFacility?.name?.toUpperCase() || 'FACILITY'} · {resolvedComplaints.length} COMPLETED
                      </p>
                    </div>
                    <ReportStickerIcon />
                  </div>

                  {resolvedComplaints.length === 0 ? (
                    <div className="sandbox-empty-state">
                      <h3 className="sandbox-empty-title">
                        NO RESOLVED REPORTS FOR {selectedFacility?.name?.toUpperCase()}
                      </h3>
                      <p className="sandbox-empty-copy">
                        No completed maintenance records are listed for {selectedFacility?.name} yet.
                      </p>
                    </div>
                  ) : (
                    <div className="sandbox-records-list">
                      {resolvedComplaints.map(item => {
                        const parsed = parseReportDescription(item.description);
                        const updates = data.complaint_updates?.filter(u => u.complaint_id === item.id) || [];
                        const resolvedUpdate = [...updates].reverse().find(u => u.status === 'resolved') || updates.at(-1);
                        const isExpanded = Boolean(expandedHistoryIds[item.id]);
                        const historyId = `history-${item.id}`;

                        return (
                          <article key={item.id} className="sandbox-record-card">
                            <div className="sandbox-record-top">
                              <div className="sandbox-record-badges">
                                <span className="sandbox-ref-pill">
                                  REF {formatRefId(item.id)}
                                </span>
                                <span className="sandbox-status-pill is-resolved">
                                  RESOLVED
                                </span>
                              </div>
                              <ActionLink
                                variant="text"
                                href={`#reports/${item.id}`}
                                className="sandbox-source-tag"
                              >
                                View full record →
                              </ActionLink>
                            </div>

                            <h3 className="sandbox-record-title">{parsed.title}</h3>
                            <p className="sandbox-record-desc">{parsed.description}</p>

                            <div className="sandbox-record-dates">
                              <span>Completed: {formatDate(item.updated_at)}</span>
                              <span>Submitted: {formatDate(item.created_at)}</span>
                            </div>

                            {resolvedUpdate?.note && (
                              <div className="sandbox-record-callout">
                                <span className="sandbox-record-callout-label">
                                  RESOLUTION NOTE
                                </span>
                                <p className="sandbox-record-callout-body">
                                  {resolvedUpdate.note}
                                </p>
                              </div>
                            )}

                            <div className="sandbox-evidence-card">
                              <span className="sandbox-record-callout-label">
                                COMPLETION EVIDENCE
                              </span>
                              <div className="sandbox-evidence-row">
                                <ResolutionEvidenceIllustration />
                                <div className="sandbox-evidence-meta">
                                  <p className="sandbox-evidence-caption">
                                    Maintenance repair verified and signed off
                                  </p>
                                  <div>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => setActiveEvidenceRecord(item)}
                                    >
                                      Inspect evidence
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {updates.length > 0 && (
                              <>
                                <button
                                  type="button"
                                  className="sandbox-history-toggle"
                                  aria-expanded={isExpanded}
                                  aria-controls={historyId}
                                  onClick={() => toggleHistory(item.id)}
                                >
                                  <span>
                                    {isExpanded
                                      ? `HIDE DATED HISTORY (${updates.length})`
                                      : `VIEW DATED HISTORY (${updates.length})`}
                                  </span>
                                  <span aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
                                </button>

                                {isExpanded && (
                                  <ol
                                    id={historyId}
                                    className="sandbox-history-list"
                                    aria-label={`Dated history for ${formatRefId(item.id)}`}
                                  >
                                    {updates.map(upd => (
                                      <li key={upd.id} className="sandbox-history-item">
                                        <div className="sandbox-history-head">
                                          <span>{formatDate(upd.created_at)}</span>
                                          <span>{upd.status?.toUpperCase() || 'UPDATE'}</span>
                                        </div>
                                        <p className="sandbox-history-note">{upd.note}</p>
                                      </li>
                                    ))}
                                  </ol>
                                )}
                              </>
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

      {/* Confirmation Dialog: Unsaved draft when switching facility */}
      {pendingFacility && (
        <div
          className="sandbox-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-dialog-title"
        >
          <div className="sandbox-modal-card">
            <div className="sandbox-modal-head">
              <h2 id="discard-dialog-title">Discard unfinished report?</h2>
              <IconButton
                icon="close"
                label="Cancel facility change"
                onClick={handleCancelFacilitySwitch}
              />
            </div>
            <p>
              You have unsent report input for <strong>{selectedFacility?.name}</strong>.
              Switching to <strong>{pendingFacility?.name}</strong> will discard your current draft.
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

      {/* Photo Preview Modal */}
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
            {photo.objectUrl && (
              <img
                src={photo.objectUrl}
                alt={`Selected report attachment ${photo.file_name}`}
                className="sandbox-photo-preview-img"
              />
            )}
            <p className="helper">Preview only — local demo attachment.</p>
            <Button variant="quiet" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Completion Evidence Modal */}
      {activeEvidenceRecord && (
        <div
          className="sandbox-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-modal-title"
        >
          <div className="sandbox-modal-card">
            <div className="sandbox-modal-head">
              <h2 id="evidence-modal-title">
                Completion evidence · {formatRefId(activeEvidenceRecord.id)}
              </h2>
              <IconButton
                icon="close"
                label="Close completion evidence preview"
                onClick={() => setActiveEvidenceRecord(null)}
              />
            </div>
            <ResolutionEvidenceIllustration large />
            <p>
              <strong>{parseReportDescription(activeEvidenceRecord.description).title}</strong>
              <br />
              Maintenance repair inspected and confirmed safe by SDP team.
            </p>
            <p className="helper">
              Completed: {formatDate(activeEvidenceRecord.updated_at)} · Certified resolution record.
            </p>
            <div className="sandbox-modal-actions">
              <Button variant="secondary" onClick={() => setActiveEvidenceRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
