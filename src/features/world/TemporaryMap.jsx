import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { FacilitySheet } from './FacilitySheet.jsx';
import { ApprovedMap } from './ApprovedMap.jsx';
import { resolveFacilityObject, selectPublicObject } from './worldSelectors.js';
import './world.css';

const icons = {
  house: 'map',
  hall: 'location',
  park: 'leaf',
  lamp: 'location',
  bench: 'location',
  tree: 'leaf',
  recycling: 'recycle',
};

export function TemporaryMap({
  data,
  route = {},
  openModal,
  closeModal,
  navigate,
  onSelect,
  selectedObjectId,
  ghost,
  compact = false,
}) {
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState(null);
  const [hoveredObjectId, setHoveredObjectId] = useState(null);
  const [locateId, setLocateId] = useState(null);
  const viewport = useRef(null), controls = useRef({}), backButton = useRef(null);
  const dragStateRef = useRef({ active: false, moved: false });
  const selected = selectedObjectId === undefined ? selection : selectedObjectId;
  const focused = route.facilityId ? resolveFacilityObject(data, route.facilityId) : null;
  const resident = data.profiles.find(p => p.role === 'resident');
  const userHomeObject = data.layout.find(o => o.objectId === resident?.home_object_id || (resident?.home_facility_id && o.facilityId === resident.home_facility_id));
  const fitWidth = Math.max(0, Math.min(size.width, (size.height - (compact ? 0 : 176)) * 4 / 3));
  const mapWidth = fitWidth * zoom, mapHeight = mapWidth * 3 / 4;
  const stageWidth = Math.max(size.width, mapWidth), stageHeight = Math.max(size.height, mapHeight);

  useEffect(() => {
    const view = viewport.current;
    const observer = new ResizeObserver(() => setSize({ width: view.clientWidth, height: view.clientHeight }));
    observer.observe(view);
    if (!compact && !route.facilityId) backButton.current?.querySelector('button')?.focus({ preventScroll: true });
    return () => observer.disconnect();
  }, [compact, route.facilityId]);

  useEffect(() => {
    if (!focused) return;
    setSelection(focused.objectId); setLocateId({ objectId: focused.objectId });
  }, [focused]);

  useLayoutEffect(() => {
    const view = viewport.current;
    const target = locateId && controls.current[locateId.objectId];
    if (!view || !size.width) return;
    if (target) {
      const rect = target.getBoundingClientRect(), frame = view.getBoundingClientRect();
      view.scrollLeft += rect.x + rect.width / 2 - frame.x - frame.width / 2;
      view.scrollTop += rect.y + rect.height / 2 - frame.y - frame.height / 2;
      target.focus({ preventScroll: true });
    } else {
      view.scrollLeft = (stageWidth - size.width) / 2;
      view.scrollTop = (stageHeight - size.height) / 2;
    }
  }, [zoom, size, locateId, stageWidth, stageHeight]);

  function handleZoomIn() { setLocateId(null); setZoom(value => Math.min(3, value + 0.25)); }
  function handleZoomOut() { setLocateId(null); setZoom(value => Math.max(1, value - 0.25)); }
  function handleResetView() {
    setLocateId(null); setZoom(1);
    viewport.current?.scrollTo(0, 0);
  }
  function handleFindMyHouse() {
    if (!userHomeObject) return;
    setZoom(value => Math.max(value, 1.75));
    setSelection(userHomeObject.objectId); setLocateId({ objectId: userHomeObject.objectId });
  }
  function handlePointerDown(e) {
    if (e.button !== 0 || dragStateRef.current.active) return;
    dragStateRef.current = { active: true, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY,
      startScrollLeft: viewport.current.scrollLeft, startScrollTop: viewport.current.scrollTop, moved: false };
  }
  function handlePointerMove(e) {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
    if (Math.hypot(dx, dy) <= 4 && !drag.moved) return;
    drag.moved = true; setIsDragging(true);
    viewport.current.setPointerCapture(e.pointerId);
    viewport.current.scrollLeft = drag.startScrollLeft - dx;
    viewport.current.scrollTop = drag.startScrollTop - dy;
  }
  function handlePointerUp(e) {
    const drag = dragStateRef.current;
    if (drag.pointerId !== e.pointerId) return;
    drag.active = false; setIsDragging(false);
    if (viewport.current.hasPointerCapture(e.pointerId)) viewport.current.releasePointerCapture(e.pointerId);
  }

  function select(object) {
    setSelection(object.objectId);
    if (onSelect) {
      onSelect(object);
      return;
    }
    const publicObject = selectPublicObject(data, object.objectId);
    if (openModal) {
      openModal({
        title: publicObject.name,
        mode: 'sheet',
        content: <FacilitySheet object={publicObject} navigate={navigate} closeModal={closeModal} />,
      });
    }
  }

  function handleObjectClick(object) {
    select(object);
  }

  return (
    <div className={`section-stack temporary-map ${compact ? 'editor-map' : 'resident-map'}`}>
      {!compact && <div className="map-back" ref={backButton}><Button icon="back" size="sm" onClick={() => navigate('home')}>Back</Button></div>}
      <section className={compact ? 'schematic-card' : 'map-experience'} aria-label="Sample neighbourhood map">        {!compact && <svg className="map-world-background" aria-hidden="true"><rect width="100%" height="100%" fill="url(#assem-grass-pattern)" /></svg>}
        {compact && <div className="section-heading"><h2>Places we share</h2></div>}
        <div className="schematic-controls" role="group" aria-label="Map controls">
          <Button size="sm" variant="primary" disabled={!userHomeObject} onClick={handleFindMyHouse}>Find my house</Button>
          <IconButton icon="plus" label="Zoom in" disabled={zoom >= 3} onClick={handleZoomIn} />
          <IconButton icon="minus" label="Zoom out" disabled={zoom <= 1} onClick={handleZoomOut} />
          <Button size="sm" onClick={handleResetView}>Reset view</Button>
        </div>
        <span className="schematic-scale sr-only" role="status">{Math.round(zoom * 100)}%</span>
        <div
          className={`schematic-viewport approved-map-viewport ${isDragging ? 'is-dragging' : ''}`}
          ref={viewport} data-draggable="true"
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
          onClickCapture={event => { if (dragStateRef.current.moved && event.detail > 0) { event.stopPropagation(); dragStateRef.current.moved = false; } }}
        >
          <div className="map-stage" style={{ width: stageWidth, height: stageHeight }}>
            <div className="schematic-canvas-container" style={{ width: mapWidth || '100%', height: mapHeight || 'auto', position: 'absolute', left: (stageWidth - mapWidth) / 2, top: (stageHeight - mapHeight) / 2 }}>
              <ApprovedMap data={data} selected={selected} hovered={hoveredObjectId} onSelect={handleObjectClick} onHover={setHoveredObjectId} controls={controls} ghost={ghost} />
            </div>
          </div>
        </div>
      </section>

      {route.facilityId && !focused && (
        <p className="field-error" role="alert">
          This location is no longer available.
        </p>
      )}

      {/* Place selection button list for World Editor */}
      {compact && (
        <section className="section-stack">
          <div className="section-heading">
            <h2>Select a component</h2>
            <span className="helper">{(data?.layout || []).length} places</span>
          </div>
          <div className="place-list">
            {(data?.layout || []).map(object => {
              const item = selectPublicObject(data, object.objectId);
              if (!item) return null;
              return (
                <button
                  ref={element => {
                    controls.current[object.objectId] = element;
                  }}
                  key={object.objectId}
                  type="button"
                  className={`place-button ${selected === object.objectId ? 'is-selected' : ''}`}
                  aria-pressed={selected === object.objectId}
                  onClick={() => select(object)}
                >
                  <span className="place-symbol">
                    <Icon name={icons[object.assetKey] || 'location'} />
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <span className="helper">
                      {item.facilityId
                        ? ({ normal: 'Normal', reported: 'Reported', repairing: 'Work in progress' })[item.state]
                        : 'Decorative'}
                      {item.activities.length
                        ? ` Â· ${item.activities.length} ${item.activities.length === 1 ? 'activity' : 'activities'}`
                        : ''}
                    </span>
                  </span>
                  <Icon name="chevron-right" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
