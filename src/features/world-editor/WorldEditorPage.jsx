import { useRef, useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Feedback.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { newDemoId } from '../../lib/demoStore.js';
import { TemporaryMap } from '../world/TemporaryMap.jsx';
import { ComponentCatalog } from './ComponentCatalog.jsx';
import { componentCatalog } from './componentCatalog.js';
import { PlacementForm } from './PlacementForm.jsx';
import { ObjectPanel } from './ObjectPanel.jsx';
import { validatePlacement } from './layoutValidation.js';
import './editor.css';
export function WorldEditorPage(props) {
  const { data, store, snapshot, registerGuard, notify, openModal, closeModal, confirmAction, navigate, openReset } = props;
  const [mode, setMode] = useState('view'), [selectedId, setSelectedId] = useState(null), [preview, setPreview] = useState(null);
  const panel = useRef(null), addButton = useRef(null), selectionRevision = useRef(null);
  const selected = data.layout.find(row => row.objectId === selectedId);
  const form = useCommandForm({ store, snapshot, registerGuard, dirty: Boolean(preview), onDiscard: () => setPreview(null), onSuccess: last => {
    const object = store.getSnapshot().data.layout.find(row => row.objectId === last.entityId);
    setPreview(null); setSelectedId(object?.objectId || null); selectionRevision.current = store.getSnapshot().revision; setMode('select'); notify(last.type === 'world.remove' ? 'Component removed. Saved on this browser.' : 'Layout saved on this browser.');
    requestAnimationFrame(() => (object ? panel.current : addButton.current)?.focus());
  } });
  const validation = preview ? validatePlacement(data.layout, preview, { excludeObjectId: preview.mode === 'moving' ? preview.objectId : undefined }) : null;
  function cancelPreview() { form.clearPending(); setPreview(null); setMode('select'); requestAnimationFrame(() => addButton.current?.focus()); }
  function catalog() {
    openModal({ title: 'Component catalog', mode: 'sheet', content: <ComponentCatalog onSelect={item => {
      closeModal(); const objectId = `object-${newDemoId()}`;
      setPreview({ ...item, objectId, facilityId: item.decorative ? null : `${item.assetKey}-${newDemoId()}`, x: 0, y: 0, mode: 'placing', expectedRevision: snapshot.revision }); setMode('placing');
      requestAnimationFrame(() => document.querySelector('.placement-form input')?.focus());
    }} /> });
  }
  function savePreview() {
    if (!preview || !validation.valid) return;
    if (preview.mode === 'moving') form.submit('world.move', { objectId: preview.objectId, x: preview.x, y: preview.y, expectedRevision: preview.expectedRevision });
    else form.submit('world.add', { objectId: preview.objectId, facilityId: preview.facilityId, assetKey: preview.assetKey, x: preview.x, y: preview.y, expectedRevision: preview.expectedRevision });
  }
  return <div className="section-stack"><Card><h2>Shape the neighbourhood</h2><p>Arrange seven available components on a 32 × 24 tile schematic. These are provisional footprints. Final artwork, hit areas and worker access routes will be validated later.</p></Card>
    <div className="editor-toolbar">{mode === 'view' ? <Button variant="primary" onClick={() => setMode('select')}>Enter editor</Button> : <><Button icon="catalog" disabled={Boolean(preview)} onClick={catalog}><span ref={element => { addButton.current = element?.closest('button'); }}>Add component</span></Button><Button aria-pressed={mode === 'select'} disabled={Boolean(preview)} onClick={() => { setMode('select'); setSelectedId(null); }}>Select</Button><Button variant="quiet" onClick={() => { if (preview) { confirmAction({ title: 'Discard changes?', description: 'Your placement or move preview will be discarded. Saved layout changes remain.', confirmLabel: 'Discard changes', cancelLabel: 'Keep editing', onConfirm: () => { cancelPreview(); setMode('view'); return true; } }); } else setMode('view'); }}>Exit editor</Button></>}<Button variant="danger" icon="reset-demo" onClick={openReset}>Reset demo</Button></div>
    {preview && <PlacementForm preview={preview} setPreview={setPreview} validation={validation} onConfirm={savePreview} onCancel={cancelPreview} locked={form.awaitingRecovery} error={form.error} retry={form.retry} clearPending={form.clearPending} awaitingRecovery={form.awaitingRecovery} />}
    {!preview && selected && mode !== 'view' && <div ref={panel} tabIndex={-1}><ObjectPanel object={selected} data={data} disabled={form.awaitingRecovery} onClose={() => setSelectedId(null)} onMove={() => { const item = componentCatalog.find(row => row.assetKey === selected.assetKey); setPreview({ ...item, ...selected, mode: 'moving', expectedRevision: selectionRevision.current }); setMode('moving'); }} onRemove={() => confirmAction({ title: `Remove ${componentCatalog.find(row => row.assetKey === selected.assetKey).label.toLowerCase()}?`, description: 'The component and its unreferenced facility will be removed from the local demo.', confirmLabel: 'Remove component', onCancel: () => form.clearPending(), onConfirm: () => form.submit('world.remove', { objectId: selected.objectId, expectedRevision: selectionRevision.current }) })} /></div>}
    {form.error && !preview && <p className="field-error" role="alert">{form.error.message}</p>}
    <TemporaryMap {...props} compact selectedObjectId={selectedId} ghost={preview ? { ...preview, valid: validation.valid } : null} onSelect={object => { if (mode === 'view') { notify('Enter editor to select a component.'); return; } if (!preview) { setSelectedId(object.objectId); selectionRevision.current = snapshot.revision; requestAnimationFrame(() => panel.current?.focus()); } }} />
    <Button variant="quiet" onClick={() => navigate('sdp')}>Back to workspace</Button>
  </div>;
}


