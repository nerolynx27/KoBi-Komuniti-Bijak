import { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { FacilitySheet } from './FacilitySheet.jsx';
import { resolveFacilityObject, selectPublicObject } from './worldSelectors.js';
import './world.css';
const labels = { house: 'House', hall: 'Hall', park: 'Garden', lamp: 'Lamp', bench: 'Bench', tree: 'Tree', recycling: 'Recycle' };
const icons = { house: 'map', hall: 'location', park: 'leaf', lamp: 'location', bench: 'location', tree: 'leaf', recycling: 'recycle' };
export function TemporaryMap({ data, route = {}, openModal, closeModal, navigate, onSelect, selectedObjectId, ghost, compact = false }) {
  const [zoom, setZoom] = useState(1), [selection, setSelection] = useState(null);
  const viewport = useRef(null), controls = useRef({});
  const selected = selectedObjectId === undefined ? selection : selectedObjectId;
  const focused = route.facilityId ? resolveFacilityObject(data, route.facilityId) : null;
  useEffect(() => {
    if (!focused) return;
    setSelection(focused.objectId); controls.current[focused.objectId]?.focus();
    const view = viewport.current;
    if (view) { view.scrollLeft = Math.max(0, (focused.x + focused.width / 2) / 32 * view.scrollWidth - view.clientWidth / 2); view.scrollTop = Math.max(0, (focused.y + focused.height / 2) / 24 * view.scrollHeight - view.clientHeight / 2); }
  }, [focused]);
  function select(object) {
    setSelection(object.objectId);
    if (onSelect) { onSelect(object); return; }
    const publicObject = selectPublicObject(data, object.objectId);
    openModal({ title: publicObject.name, mode: 'sheet', content: <FacilitySheet object={publicObject} navigate={navigate} closeModal={closeModal} /> });
  }
  return <div className="section-stack temporary-map"><section className="schematic-card"><div className="section-heading"><div><span className="eyebrow">Sample neighbourhood</span><h2>Places we share</h2></div><span className="schematic-scale" aria-live="polite">{Math.round(zoom * 100)}%</span></div>
    <div className="schematic-controls"><IconButton icon="minus" label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))} /><IconButton icon="plus" label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .25))} /><Button size="sm" icon="reset-view" onClick={() => { setZoom(1); if (viewport.current) { viewport.current.scrollLeft = 0; viewport.current.scrollTop = 0; } }}>Reset view</Button></div>
    <div className="schematic-viewport" ref={viewport}><svg className="schematic" style={{ width: `${zoom * 100}%` }} viewBox="0 0 640 480" role="img" aria-label="Temporary neighbourhood schematic, 32 by 24 tiles. Select a place using the buttons below."><defs><pattern id="tile-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" className="schematic-grid" /></pattern></defs><rect width="640" height="480" className="schematic-ground" /><rect x="0" y="205" width="640" height="50" className="schematic-path" /><rect x="290" y="0" width="50" height="480" className="schematic-path" /><rect width="640" height="480" fill="url(#tile-grid)" />{data.layout.map(object => <g key={object.objectId} className={object.objectId === selected ? 'schematic-object is-selected' : 'schematic-object'}><rect x={object.x * 20} y={object.y * 20} width={object.width * 20} height={object.height * 20} /><text x={object.x * 20 + object.width * 10} y={object.y * 20 - 7} textAnchor="middle">{labels[object.assetKey]}</text></g>)}{ghost && <g className={`schematic-ghost ${ghost.valid ? 'is-valid' : 'is-invalid'}`}><rect x={ghost.x * 20} y={ghost.y * 20} width={ghost.width * 20} height={ghost.height * 20} /><text x={ghost.x * 20} y={ghost.y * 20 - 6}>Preview</text></g>}</svg></div><p className="map-caption"><Icon name="map" />Temporary schematic · final pixel artwork and worker routes come later.</p>
    </section>
    {route.facilityId && !focused && <p className="field-error" role="alert">This location is no longer available. Choose another place below.</p>}
    <section className="section-stack"><div className="section-heading"><h2>{compact ? 'Select a component' : 'Explore your places'}</h2><span className="helper">{data.layout.length} places</span></div><div className="place-list">{data.layout.map(object => { const item = selectPublicObject(data, object.objectId); return <button ref={element => { controls.current[object.objectId] = element; }} key={object.objectId} type="button" className={`place-button ${selected === object.objectId ? 'is-selected' : ''}`} aria-pressed={selected === object.objectId} onClick={() => select(object)}><span className="place-symbol"><Icon name={icons[object.assetKey]} /></span><span><strong>{item.name}</strong><span className="helper">{item.facilityId ? ({ normal: 'Normal', reported: 'Reported', repairing: 'Work in progress' })[item.state] : 'Decorative'}{item.activities.length ? ` · ${item.activities.length} ${item.activities.length === 1 ? 'activity' : 'activities'}` : ''}</span></span><Icon name="chevron-right" /></button>; })}</div></section></div>;
}
