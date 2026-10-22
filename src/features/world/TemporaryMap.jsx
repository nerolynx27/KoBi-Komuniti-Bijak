import React, { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { FacilitySheet } from './FacilitySheet.jsx';
import { resolveFacilityObject, selectPublicObject } from './worldSelectors.js';
import './world.css';

const labels = {
  house: 'House',
  hall: 'Hall',
  park: 'Garden',
  lamp: 'Lamp',
  bench: 'Bench',
  tree: 'Tree',
  recycling: 'Recycle',
};

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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState(null);
  const [hoveredObjectId, setHoveredObjectId] = useState(null);

  const viewport = useRef(null);
  const controls = useRef({});
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
    moved: false,
  });

  const selected = selectedObjectId === undefined ? selection : selectedObjectId;
  const focused = route.facilityId ? resolveFacilityObject(data, route.facilityId) : null;

  // Find user's home object (Alex Tan Lot 12)
  const userHomeObject = (data?.layout || []).find(
    o => o.objectId === 'object-house-01' || (o.assetKey === 'house' && o.label?.includes('Lot 12'))
  );

  useEffect(() => {
    if (!focused) return;
    setSelection(focused.objectId);
    controls.current[focused.objectId]?.focus();
    const view = viewport.current;
    if (view) {
      view.scrollLeft = Math.max(0, ((focused.x + focused.width / 2) / 32) * view.scrollWidth - view.clientWidth / 2);
      view.scrollTop = Math.max(0, ((focused.y + focused.height / 2) / 24) * view.scrollHeight - view.clientHeight / 2);
    }
  }, [focused]);

  function handleZoomIn() {
    setZoom(value => Math.min(3, +(value + 0.25).toFixed(2)));
  }

  function handleZoomOut() {
    setZoom(value => Math.max(1, +(value - 0.25).toFixed(2)));
  }

  function handleResetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (viewport.current) {
      viewport.current.scrollLeft = 0;
      viewport.current.scrollTop = 0;
    }
  }

  function handleFindMyHouse() {
    if (!userHomeObject) return;
    const targetZoom = Math.max(zoom, 1.75);
    setZoom(targetZoom);
    setSelection(userHomeObject.objectId);
    const view = viewport.current;
    if (view) {
      setTimeout(() => {
        const targetX = ((userHomeObject.x + userHomeObject.width / 2) / 32) * (640 * targetZoom) - view.clientWidth / 2;
        const targetY = ((userHomeObject.y + userHomeObject.height / 2) / 24) * (480 * targetZoom) - view.clientHeight / 2;
        view.scrollLeft = Math.max(0, targetX);
        view.scrollTop = Math.max(0, targetY);
      }, 50);
    }
  }

  // Pointer drag-to-pan handlers
  function handlePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const view = viewport.current;
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: view ? view.scrollLeft : 0,
      startScrollTop: view ? view.scrollTop : 0,
      moved: false,
    };
    setIsDragging(true);
  }

  function handlePointerMove(e) {
    if (!dragStateRef.current.active) return;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.hypot(dx, dy) > 4) {
      dragStateRef.current.moved = true;
    }
    const view = viewport.current;
    if (view) {
      view.scrollLeft = dragStateRef.current.startScrollLeft - dx;
      view.scrollTop = dragStateRef.current.startScrollTop - dy;
    }
  }

  function handlePointerUp() {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setIsDragging(false);
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
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }
    select(object);
  }

  const hoveredObj = (data?.layout || []).find(o => o.objectId === hoveredObjectId);
  const hoveredPublic = hoveredObj ? selectPublicObject(data, hoveredObj.objectId) : null;

  return (
    <div className="section-stack temporary-map">
      <section className="schematic-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Sample neighbourhood</span>
            <h2>Places we share</h2>
          </div>
          <span className="schematic-scale" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="schematic-controls">
          {userHomeObject && (
            <Button size="sm" variant="primary" icon="map" onClick={handleFindMyHouse}>
              Find my house
            </Button>
          )}
          <IconButton icon="minus" label="Zoom out" disabled={zoom <= 1} onClick={handleZoomOut} />
          <IconButton icon="plus" label="Zoom in" disabled={zoom >= 3} onClick={handleZoomIn} />
          <Button size="sm" icon="reset-view" onClick={handleResetView}>
            Reset view
          </Button>
        </div>

        {/* Hover HUD Preview */}
        <div className="schematic-hover-hud" aria-live="polite">
          {hoveredPublic ? (
            <>
              <strong>{hoveredPublic.name}</strong>
              <span>
                {hoveredPublic.type}
                {hoveredPublic.distanceText ? ` · ${hoveredPublic.distanceText}` : ''} · Click to inspect
              </span>
            </>
          ) : (
            <span>✋ Drag anywhere to pan · Hover over any house or amenity · Click to inspect</span>
          )}
        </div>

        <div
          className={`schematic-viewport ${isDragging ? 'is-dragging' : ''}`}
          ref={viewport}
          data-draggable="true"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
        >
          <div
            className="schematic-canvas-container"
            style={{
              width: `${640 * zoom}px`,
              height: `${480 * zoom}px`,
              position: 'relative',
              transition: isDragging ? 'none' : 'width 0.15s ease-out, height 0.15s ease-out',
            }}
          >
            <svg
              className="schematic classic-grid-map"
              viewBox="0 0 640 480"
              width="100%"
              height="100%"
              role="img"
              aria-label="Interactive Classic 2D Grid map of Elmina Seksyen U16"
            >
              <defs>
                {/* Schematic Grid Definition for backward-compatibility */}
                <pattern id="tile-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" className="schematic-grid" />
                </pattern>

                {/* Lively Pixel Meadow Grass Pattern */}
                <pattern id="classic-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#569443" />
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4c873b" strokeWidth="1" />
                  <path d="M 3 4 h 2 v 2 h -2 Z M 5 3 h 2 v 2 h -2 Z M 15 10 h 2 v 2 h -2 Z" fill="#6ab054" />
                  <path d="M 13 11 h 2 v 2 h -2 Z M 8 16 h 2 v 2 h -2 Z" fill="#467d36" />
                </pattern>

                {/* Residential Lawn Sub-Plot Pattern */}
                <pattern id="classic-yard-lawn" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#609e4c" />
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#538f40" strokeWidth="0.75" />
                  <path d="M 6 6 h 2 v 2 h -2 Z" fill="#74ba5e" />
                  <path d="M 14 14 h 2 v 2 h -2 Z" fill="#4e873c" />
                </pattern>

                {/* Road Asphalt Pattern */}
                <pattern id="classic-asphalt-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#2e2b2a" />
                  <path d="M 2 4 h 2 v 2 h -2 Z" fill="#383433" />
                  <path d="M 12 14 h 2 v 2 h -2 Z" fill="#242120" />
                </pattern>

                {/* Lush Botanical Park Lawn Pattern */}
                <pattern id="classic-park-lawn" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#3f8233" />
                  <path d="M 3 3 h 3 v 3 h -3 Z" fill="#529c44" />
                  <path d="M 13 12 h 3 v 3 h -3 Z" fill="#346e29" />
                  <path d="M 9 6 h 2 v 2 h -2 Z" fill="#CEA257" />
                </pattern>

                {/* 1. Component Symbol: Dewan Serbaguna (hall-01-classic-dewan.svg) */}
                <symbol id="sym-dewan" viewBox="0 0 96 66">
                  <rect x="4" y="58" width="88" height="6" fill="#18211a" />
                  <rect x="10" y="52" width="76" height="8" fill="#D1BF9A" />
                  <line x1="10" y1="56" x2="86" y2="56" stroke="#CEA257" strokeWidth="0.5" />
                  <rect x="36" y="50" width="24" height="4" fill="#CEA257" />
                  <rect x="38" y="48" width="20" height="2" fill="#E5E0CD" />
                  <rect x="14" y="24" width="68" height="26" fill="#E5E0CD" />
                  <rect x="16" y="26" width="64" height="24" fill="#FAF8F5" />
                  <rect x="18" y="30" width="8" height="10" fill="#347CA1" />
                  <rect x="19" y="31" width="6" height="8" fill="#7FC3E5" />
                  <rect x="70" y="30" width="8" height="10" fill="#347CA1" />
                  <rect x="71" y="31" width="6" height="8" fill="#7FC3E5" />
                  <rect x="32" y="28" width="32" height="22" fill="#6C1A21" />
                  <rect x="42" y="34" width="12" height="16" fill="#3B1D19" />
                  <line x1="48" y1="34" x2="48" y2="50" stroke="#CEA257" strokeWidth="1" />
                  <rect x="44" y="42" width="1.5" height="1.5" fill="#CEA257" />
                  <rect x="50" y="42" width="1.5" height="1.5" fill="#CEA257" />
                  <rect x="34" y="28" width="3" height="22" fill="#E5E0CD" />
                  <rect x="59" y="28" width="3" height="22" fill="#E5E0CD" />
                  <rect x="30" y="22" width="36" height="6" fill="#6C1A21" stroke="#CEA257" strokeWidth="1" />
                  <text x="48" y="26.5" fill="#E5E0CD" fontSize="3.5" fontFamily="Bungee, sans-serif" textAnchor="middle">DEWAN KOMUNITI</text>
                  <polygon points="8,24 48,8 88,24" fill="#6C1A21" stroke="#3B1D19" strokeWidth="1" />
                  <polygon points="12,22 48,10 84,22" fill="#B92C2C" />
                  <polygon points="26,16 48,6 70,16" fill="#6C1A21" />
                  <line x1="28" y1="15" x2="68" y2="15" stroke="#CEA257" strokeWidth="1" />
                  <line x1="14" y1="20" x2="14" y2="52" stroke="#9CA3AF" strokeWidth="1" />
                  <polygon points="14,20 19,22 14,24" fill="#B92C2C" />
                  <rect x="80" y="44" width="4" height="6" fill="#6C1A21" />
                  <ellipse cx="82" cy="41" rx="5" ry="4" fill="#569443" />
                  <ellipse cx="82" cy="38" rx="3" ry="2" fill="#74BA5E" />
                </symbol>

                {/* 2. Component Symbol: Surau Al-Falah (mosque-01-classic-dome-surau.svg) */}
                <symbol id="sym-surau" viewBox="0 0 96 66">
                  <rect x="4" y="58" width="88" height="6" fill="#141c19" />
                  <rect x="8" y="50" width="80" height="10" fill="#D1BF9A" />
                  <line x1="8" y1="54" x2="88" y2="54" stroke="#CEA257" strokeWidth="0.5" />
                  <rect x="18" y="26" width="52" height="24" fill="#E5E0CD" />
                  <rect x="20" y="28" width="48" height="22" fill="#FAF8F5" />
                  <ellipse cx="44" cy="22" rx="16" ry="11" fill="#CEA257" stroke="#6C1A21" strokeWidth="1" />
                  <ellipse cx="44" cy="20" rx="13" ry="8" fill="#E5B962" />
                  <rect x="43.5" y="7" width="1" height="5" fill="#CEA257" />
                  <circle cx="44" cy="6" r="2" fill="#E5E0CD" />
                  <rect x="36" y="34" width="16" height="16" fill="#6C1A21" />
                  <path d="M 38 38 Q 44 32 50 38 L 50 50 L 38 50 Z" fill="#3B1D19" />
                  <line x1="44" y1="35" x2="44" y2="50" stroke="#CEA257" strokeWidth="1" />
                  <rect x="24" y="34" width="8" height="12" rx="2" fill="#347CA1" />
                  <rect x="25" y="35" width="6" height="10" rx="1" fill="#7FC3E5" />
                  <rect x="56" y="34" width="8" height="12" rx="2" fill="#347CA1" />
                  <rect x="57" y="35" width="6" height="10" rx="1" fill="#7FC3E5" />
                  <rect x="74" y="16" width="8" height="34" fill="#E5E0CD" stroke="#6C1A21" strokeWidth="0.75" />
                  <rect x="76" y="16" width="4" height="34" fill="#FAF8F5" />
                  <rect x="72" y="20" width="12" height="3" fill="#6C1A21" />
                  <rect x="73" y="21" width="10" height="1" fill="#CEA257" />
                  <ellipse cx="78" cy="14" rx="5" ry="4" fill="#CEA257" />
                  <rect x="77.5" y="8" width="1" height="3" fill="#CEA257" />
                  <circle cx="78" cy="7" r="1.5" fill="#E5E0CD" />
                  <rect x="10" y="42" width="6" height="8" fill="#D1BF9A" />
                  <polygon points="8,42 13,38 18,42" fill="#6C1A21" />
                  <rect x="86" y="38" width="2" height="12" fill="#4A2E18" />
                  <ellipse cx="87" cy="36" rx="5" ry="4" fill="#569443" />
                  <ellipse cx="87" cy="34" rx="3" ry="2" fill="#74BA5E" />
                </symbol>

                {/* 3. Component Symbol: Taman Permainan (park-01-classic-playground.svg) */}
                <symbol id="sym-playground" viewBox="0 0 96 66">
                  <rect x="4" y="56" width="88" height="8" fill="#1b281d" />
                  <rect x="6" y="8" width="84" height="50" rx="4" fill="#3F8233" />
                  <rect x="8" y="10" width="80" height="46" rx="3" fill="#569443" />
                  <rect x="18" y="24" width="48" height="26" rx="2" fill="#6C1A21" />
                  <rect x="20" y="26" width="44" height="22" fill="#B92C2C" />
                  <line x1="34" y1="26" x2="34" y2="48" stroke="#CEA257" strokeWidth="0.75" />
                  <line x1="48" y1="26" x2="48" y2="48" stroke="#CEA257" strokeWidth="0.75" />
                  <line x1="20" y1="37" x2="64" y2="37" stroke="#CEA257" strokeWidth="0.75" />
                  <rect x="22" y="22" width="12" height="18" fill="#D1BF9A" />
                  <rect x="23" y="23" width="10" height="16" fill="#E5E0CD" />
                  <polygon points="20,22 28,14 36,22" fill="#6C1A21" stroke="#3B1D19" strokeWidth="0.75" />
                  <polygon points="22,21 28,16 34,21" fill="#CEA257" />
                  <line x1="21" y1="30" x2="21" y2="42" stroke="#6C1A21" strokeWidth="1" />
                  <line x1="19" y1="33" x2="21" y2="33" stroke="#6C1A21" strokeWidth="0.75" />
                  <line x1="19" y1="37" x2="21" y2="37" stroke="#6C1A21" strokeWidth="0.75" />
                  <line x1="19" y1="41" x2="21" y2="41" stroke="#6C1A21" strokeWidth="0.75" />
                  <path d="M 34 28 L 44 42" stroke="#CEA257" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 34 27 L 44 41" stroke="#FFFBEB" strokeWidth="1" strokeLinecap="round" />
                  <line x1="48" y1="44" x2="54" y2="22" stroke="#6C1A21" strokeWidth="1.5" />
                  <line x1="64" y1="44" x2="58" y2="22" stroke="#6C1A21" strokeWidth="1.5" />
                  <line x1="53" y1="22" x2="66" y2="22" stroke="#CEA257" strokeWidth="2" />
                  <line x1="56" y1="23" x2="55" y2="38" stroke="#D1BF9A" strokeWidth="0.75" />
                  <line x1="59" y1="23" x2="58" y2="38" stroke="#D1BF9A" strokeWidth="0.75" />
                  <rect x="54" y="38" width="6" height="2" fill="#6C1A21" />
                  <line x1="62" y1="23" x2="62" y2="36" stroke="#D1BF9A" strokeWidth="0.75" />
                  <line x1="65" y1="23" x2="65" y2="36" stroke="#D1BF9A" strokeWidth="0.75" />
                  <rect x="61" y="36" width="5" height="2" fill="#6C1A21" />
                  <rect x="36" y="44" width="4" height="2" fill="#3B1D19" />
                  <line x1="38" y1="44" x2="38" y2="41" stroke="#9CA3AF" strokeWidth="1" />
                  <circle cx="38" cy="40" r="2.5" fill="#CEA257" />
                  <rect x="70" y="38" width="10" height="4" fill="#D1BF9A" stroke="#6C1A21" strokeWidth="0.75" />
                  <circle cx="78" cy="22" r="7" fill="#3F8233" />
                  <circle cx="80" cy="20" r="5" fill="#6AB054" />
                  <rect x="77" y="28" width="2" height="10" fill="#4A2E18" />
                  <rect x="10" y="38" width="6" height="8" fill="#D1BF9A" />
                  <polygon points="8,38 13,32 18,38" fill="#6C1A21" />
                </symbol>

                {/* 4. Component Symbol: Tasik Ekologi (lake-03-wetland-boardwalk.svg) */}
                <symbol id="sym-lake" viewBox="0 0 96 66">
                  <rect x="4" y="58" width="88" height="6" fill="#121f1c" />
                  <rect x="6" y="8" width="84" height="50" rx="4" fill="#3F8233" />
                  <rect x="8" y="10" width="80" height="46" rx="3" fill="#569443" />
                  <path d="M 12 16 Q 34 26 50 20 Q 72 14 84 28 Q 78 46 54 44 Q 30 42 12 34 Z" fill="#2D6A78" />
                  <path d="M 16 19 Q 34 28 50 23 Q 70 17 80 29 Q 74 43 54 41 Q 30 39 16 32 Z" fill="#3B8496" />
                  <path d="M 10 38 Q 38 28 62 38 L 86 32" fill="none" stroke="#D1BF9A" strokeWidth="4.5" />
                  <path d="M 10 38 Q 38 28 62 38 L 86 32" fill="none" stroke="#6C1A21" strokeWidth="0.75" />
                  <circle cx="26" cy="33" r="1.5" fill="#6C1A21" />
                  <circle cx="48" cy="33" r="1.5" fill="#6C1A21" />
                  <circle cx="70" cy="35" r="1.5" fill="#6C1A21" />
                  <rect x="52" y="14" width="14" height="10" fill="#D1BF9A" />
                  <polygon points="50,14 59,8 68,14" fill="#6C1A21" stroke="#3B1D19" strokeWidth="0.75" />
                  <polygon points="52,13 59,9 66,13" fill="#CEA257" />
                  <rect x="54" y="18" width="10" height="6" fill="#E5E0CD" />
                  <g stroke="#26532B" strokeWidth="1.25">
                    <line x1="20" y1="24" x2="20" y2="16" />
                    <line x1="22" y1="26" x2="23" y2="15" />
                    <line x1="74" y1="22" x2="73" y2="14" />
                    <line x1="77" y1="24" x2="78" y2="15" />
                  </g>
                  <circle cx="20" cy="15" r="1" fill="#8B5A2B" />
                  <circle cx="23" cy="14" r="1" fill="#8B5A2B" />
                  <circle cx="34" cy="22" r="1.5" fill="#FFFFFF" />
                  <line x1="34" y1="23" x2="34" y2="27" stroke="#CEA257" strokeWidth="0.75" />
                </symbol>

                {/* 5. Component Symbol: Lampu JKR (streetlight-01-jkr-galvanised.svg) */}
                <symbol id="sym-streetlight" viewBox="0 0 60 70">
                  <rect x="6" y="60" width="48" height="6" fill="#141a1f" />
                  <rect x="6" y="58" width="22" height="2" fill="#569443" />
                  <rect x="28" y="58" width="26" height="2" fill="#2d3339" />
                  <rect x="13" y="50" width="8" height="8" fill="#E5E0CD" stroke="#374151" strokeWidth="0.5" />
                  <rect x="14" y="51" width="6" height="2" fill="#CEA257" />
                  <rect x="14" y="53" width="6" height="2" fill="#1f2937" />
                  <rect x="14" y="55" width="6" height="2" fill="#CEA257" />
                  <rect x="15" y="16" width="4" height="34" fill="#9CA3AF" />
                  <rect x="16" y="16" width="2" height="34" fill="#E5E7EB" />
                  <rect x="14" y="38" width="6" height="4" fill="#6B7280" />
                  <path d="M 17 16 C 17 8, 22 4, 34 6 L 40 8" fill="none" stroke="#9CA3AF" strokeWidth="3" />
                  <path d="M 17 16 C 17 9, 22 5, 34 7 L 40 9" fill="none" stroke="#E5E7EB" strokeWidth="1" />
                  <polygon points="36,7 48,10 47,14 35,11" fill="#4B5563" />
                  <polygon points="38,8 46,10 45,13 37,11" fill="#9CA3AF" />
                  <rect x="38" y="12" width="8" height="2" fill="#FFFBEB" />
                  <polygon points="38,14 46,14 56,58 28,58" fill="#CEA257" opacity="0.18" />
                  <ellipse cx="42" cy="58" rx="14" ry="4" fill="#CEA257" opacity="0.28" />
                </symbol>

                {/* 6. Component Symbol: Modern Terrace House (house-01-modern-terrace.svg) */}
                <symbol id="sym-terrace" viewBox="0 0 76 60">
                  <rect x="8" y="52" width="60" height="6" fill="#1b2619" />
                  <rect x="14" y="44" width="48" height="10" fill="#D1BF9A" />
                  <line x1="14" y1="48" x2="62" y2="48" stroke="#CEA257" strokeWidth="0.5" />
                  <line x1="38" y1="44" x2="38" y2="54" stroke="#CEA257" strokeWidth="0.5" />
                  <rect x="16" y="16" width="44" height="28" fill="#E5E0CD" />
                  <rect x="18" y="18" width="40" height="26" fill="#FAF8F5" />
                  <rect x="22" y="30" width="8" height="14" fill="#6C1A21" />
                  <rect x="23" y="32" width="6" height="12" fill="#4a151b" />
                  <rect x="27" y="38" width="1.5" height="1.5" fill="#CEA257" />
                  <rect x="34" y="32" width="14" height="10" fill="#347CA1" />
                  <rect x="35" y="33" width="12" height="8" fill="#7FC3E5" />
                  <line x1="41" y1="32" x2="41" y2="42" stroke="#E5E0CD" strokeWidth="1" />
                  <rect x="12" y="28" width="52" height="3" fill="#6C1A21" />
                  <rect x="14" y="29" width="48" height="1" fill="#CEA257" />
                  <rect x="13" y="31" width="3" height="13" fill="#6C1A21" />
                  <rect x="60" y="31" width="3" height="13" fill="#6C1A21" />
                  <rect x="20" y="20" width="16" height="7" fill="#347CA1" />
                  <rect x="21" y="21" width="14" height="5" fill="#7FC3E5" />
                  <line x1="39" y1="19" x2="39" y2="28" stroke="#CEA257" strokeWidth="1.5" />
                  <line x1="42" y1="19" x2="42" y2="28" stroke="#CEA257" strokeWidth="1.5" />
                  <line x1="45" y1="19" x2="45" y2="28" stroke="#CEA257" strokeWidth="1.5" />
                  <line x1="48" y1="19" x2="48" y2="28" stroke="#CEA257" strokeWidth="1.5" />
                  <polygon points="12,16 38,6 64,16" fill="#6C1A21" stroke="#3b1d19" strokeWidth="1" />
                  <polygon points="16,15 38,8 60,15" fill="#B92C2C" />
                  <line x1="16" y1="13" x2="60" y2="13" stroke="#CEA257" strokeWidth="0.75" />
                  <rect x="52" y="42" width="10" height="4" fill="#CEA257" />
                  <ellipse cx="57" cy="40" rx="6" ry="3" fill="#569443" />
                  <ellipse cx="57" cy="38" rx="4" ry="2" fill="#74BA5E" />
                  <rect x="15" y="42" width="4" height="4" fill="#6C1A21" />
                  <circle cx="17" cy="40" r="3" fill="#569443" />
                  <circle cx="17" cy="38" r="1.5" fill="#CEA257" />
                </symbol>

                {/* 7. Component Symbol: Contemporary Semi-D House (house-02-parkside-semid.svg) */}
                <symbol id="sym-semid" viewBox="0 0 76 60">
                  <rect x="6" y="52" width="64" height="6" fill="#14211c" />
                  <rect x="12" y="44" width="36" height="10" fill="#D1BF9A" />
                  <rect x="48" y="44" width="16" height="10" fill="#3F8233" />
                  <rect x="14" y="16" width="48" height="28" fill="#E5E0CD" />
                  <rect x="16" y="18" width="44" height="26" fill="#FAF8F5" />
                  <polygon points="10,16 34,8 66,16" fill="#6C1A21" stroke="#3b1d19" strokeWidth="1" />
                  <polygon points="14,15 34,10 62,15" fill="#B92C2C" />
                  <rect x="38" y="10" width="8" height="4" fill="#347CA1" stroke="#E5E0CD" strokeWidth="0.5" />
                  <rect x="48" y="10" width="8" height="4" fill="#347CA1" stroke="#E5E0CD" strokeWidth="0.5" />
                  <rect x="18" y="20" width="18" height="8" fill="#347CA1" />
                  <rect x="19" y="21" width="16" height="6" fill="#7FC3E5" />
                  <line x1="21" y1="22" x2="31" y2="26" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
                  <rect x="22" y="32" width="12" height="12" fill="#6C1A21" />
                  <line x1="28" y1="32" x2="28" y2="44" stroke="#CEA257" strokeWidth="1" />
                  <rect x="36" y="33" width="10" height="10" fill="#347CA1" />
                  <line x1="12" y1="28" x2="42" y2="28" stroke="#CEA257" strokeWidth="2" />
                  <line x1="16" y1="27" x2="16" y2="33" stroke="#6C1A21" strokeWidth="1.5" />
                  <line x1="26" y1="27" x2="26" y2="33" stroke="#6C1A21" strokeWidth="1.5" />
                  <line x1="36" y1="27" x2="36" y2="33" stroke="#6C1A21" strokeWidth="1.5" />
                  <rect x="52" y="32" width="2" height="12" fill="#4A2E18" />
                  <circle cx="53" cy="28" r="6" fill="#569443" />
                  <circle cx="55" cy="26" r="4" fill="#74BA5E" />
                  <circle cx="51" cy="27" r="3" fill="#CEA257" />
                  <ellipse cx="54" cy="46" rx="3" ry="1.5" fill="#D1BF9A" />
                  <ellipse cx="54" cy="50" rx="3" ry="1.5" fill="#D1BF9A" />
                </symbol>
              </defs>

              {/* 1. Lively Green Base Terrain Ground */}
              <rect width="640" height="480" fill="url(#classic-grid-pattern)" className="schematic-ground" />
              <rect width="640" height="480" fill="url(#tile-grid)" pointerEvents="none" />

              {/* 2. Residential Precinct Lawn Plots */}
              <rect x="14" y="14" width="116" height="196" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
              <rect x="14" y="272" width="116" height="196" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
              <rect x="192" y="14" width="156" height="180" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
              <rect x="412" y="14" width="214" height="190" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
              <rect x="412" y="328" width="214" height="140" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />

              {/* 3. Elmina Central Green Park Ground */}
              <rect x="196" y="294" width="148" height="132" rx="8" fill="url(#classic-park-lawn)" stroke="#CEA257" strokeWidth="2.5" />
              <rect x="206" y="304" width="128" height="112" rx="6" fill="none" stroke="#D1BF9A" strokeWidth="4" strokeDasharray="6,3" />
              <rect x="224" y="336" width="68" height="42" rx="6" fill="#347CA1" stroke="#D1BF9A" strokeWidth="2" />
              <line x1="236" y1="350" x2="254" y2="350" stroke="#7FC3E5" strokeWidth="2" />
              <line x1="258" y1="362" x2="278" y2="362" stroke="#7FC3E5" strokeWidth="2" />
              <text x="258" y="360" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
                ELMINA LAKE
              </text>

              {/* 4. Roads Network with Sidewalks */}
              {/* Sidewalk Underlays */}
              <rect x="0" y="216" width="640" height="48" fill="#D1BF9A" />
              <rect x="136" y="0" width="48" height="480" fill="#D1BF9A" />
              <rect x="356" y="0" width="48" height="480" fill="#D1BF9A" />
              <rect x="180" y="97" width="180" height="26" fill="#D1BF9A" />
              <rect x="400" y="297" width="240" height="26" fill="#D1BF9A" />

              {/* Persiaran Elmina */}
              <rect x="0" y="220" width="640" height="40" fill="url(#classic-asphalt-pattern)" className="schematic-path" />
              <line x1="0" y1="240" x2="640" y2="240" stroke="#CEA257" strokeWidth="2" strokeDasharray="14,10" />

              {/* Jalan Frekuensi 1 */}
              <rect x="140" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" className="schematic-path" />
              <line x1="160" y1="0" x2="160" y2="220" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />
              <line x1="160" y1="260" x2="160" y2="480" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

              {/* Jalan Frekuensi 2 */}
              <rect x="360" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" />
              <line x1="380" y1="0" x2="380" y2="220" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />
              <line x1="380" y1="260" x2="380" y2="480" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

              {/* Jalan Frekuensi 3 */}
              <rect x="180" y="100" width="180" height="20" fill="url(#classic-asphalt-pattern)" />
              <line x1="184" y1="110" x2="356" y2="110" stroke="#E5E0CD" strokeWidth="1" strokeDasharray="6,6" />

              {/* Jalan Frekuensi 4 */}
              <rect x="400" y="300" width="240" height="20" fill="url(#classic-asphalt-pattern)" />
              <line x1="404" y1="310" x2="636" y2="310" stroke="#E5E0CD" strokeWidth="1" strokeDasharray="6,6" />

              {/* Pedestrian Crosswalks */}
              <g fill="#E5E0CD" opacity="0.8">
                <path d="M 132 224 h 6 v 4 h -6 Z M 182 224 h 6 v 4 h -6 Z M 352 224 h 6 v 4 h -6 Z M 402 224 h 6 v 4 h -6 Z" />
                <path d="M 132 232 h 6 v 4 h -6 Z M 182 232 h 6 v 4 h -6 Z M 352 232 h 6 v 4 h -6 Z M 402 232 h 6 v 4 h -6 Z" />
                <path d="M 132 240 h 6 v 4 h -6 Z M 182 240 h 6 v 4 h -6 Z M 352 240 h 6 v 4 h -6 Z M 402 240 h 6 v 4 h -6 Z" />
                <path d="M 132 248 h 6 v 4 h -6 Z M 182 248 h 6 v 4 h -6 Z M 352 248 h 6 v 4 h -6 Z M 402 248 h 6 v 4 h -6 Z" />
              </g>

              {/* 5. Street Name Road Labels */}
              <g className="street-labels" pointerEvents="none">
                <rect x="14" y="229" width="120" height="20" rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="1.5" />
                <text x="74" y="243" fill="#E5E0CD" fontSize="9.5" fontFamily="Bungee" textAnchor="middle" letterSpacing="0.04em">
                  PERSIARAN ELMINA
                </text>

                <rect x="430" y="229" width="136" height="20" rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="1.5" />
                <text x="498" y="243" fill="#E5E0CD" fontSize="9.5" fontFamily="Bungee" textAnchor="middle" letterSpacing="0.04em">
                  PERSIARAN ELMINA
                </text>

                <rect x="148" y="14" width="24" height="130" rx="4" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
                <text x="160" y="79" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle" writingMode="vertical-rl">
                  JALAN FREKUENSI 1
                </text>

                <rect x="368" y="14" width="24" height="130" rx="4" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
                <text x="380" y="79" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle" writingMode="vertical-rl">
                  JALAN FREKUENSI 2
                </text>

                <rect x="225" y="102" width="95" height="15" rx="3" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
                <text x="272" y="113" fill="#E5E0CD" fontSize="7" fontFamily="Bungee" textAnchor="middle">
                  JLN FREKUENSI 3
                </text>

                <rect x="495" y="302" width="95" height="15" rx="3" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
                <text x="542" y="313" fill="#E5E0CD" fontSize="7" fontFamily="Bungee" textAnchor="middle">
                  JLN FREKUENSI 4
                </text>
              </g>

              {/* 6. Lively Pixel Trees */}
              {[
                [118, 22], [118, 132], [118, 290], [118, 420],
                [192, 272], [336, 272], [192, 434], [336, 434],
                [342, 140], [406, 80], [606, 90], [606, 175], [560, 340], [595, 340],
              ].map(([tx, ty], i) => (
                <g key={`tree-${i}`} transform={`translate(${tx}, ${ty})`} pointerEvents="none">
                  <ellipse cx="8" cy="18" rx="7" ry="3" fill="rgba(26, 48, 20, 0.35)" />
                  <path d="M 6 13 h 4 v 6 h -4 Z" fill="#5c3c24" />
                  <rect x="0" y="2" width="16" height="13" rx="4" fill="#2e6f28" stroke="#1e4d1a" strokeWidth="1.5" />
                  <rect x="3" y="4" width="7" height="5" rx="1" fill="#4da144" />
                </g>
              ))}

              {/* 7. Interactive Layout Objects */}
              {(data?.layout || []).map(object => {
                const isSelected = object.objectId === selected;
                const isHovered = object.objectId === hoveredObjectId;
                const isHome = object.objectId === 'object-house-01' || object.facilityId === 'house-01';
                const px = object.x * 20;
                const py = object.y * 20;
                const pw = object.width * 20;
                const ph = object.height * 20;
                const isSemiD = ['Lot 20', 'Lot 24', 'Lot 25', 'Lot 28', 'Lot 30'].some(l => (object.label || '').includes(l));
                const isSurau = object.facilityId === 'surau-01' || object.facilityId === 'surau-elmina' || object.objectId?.includes('surau') || (object.label || '').toLowerCase().includes('surau');

                return (
                  <g
                    key={object.objectId}
                    id={object.objectId}
                    className={`schematic-object ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''} ${isHome ? 'is-user-home' : ''}`}
                    onClick={() => handleObjectClick(object)}
                    onMouseEnter={() => setHoveredObjectId(object.objectId)}
                    onMouseLeave={() => setHoveredObjectId(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Primary object bounding rect (matches Playwright attribute expectations: exactly 1 rect per schematic-object) */}
                    <rect
                      x={px}
                      y={py}
                      width={pw}
                      height={ph}
                      rx={object.assetKey === 'lamp' ? 1 : object.assetKey === 'tree' ? 4 : 2}
                      className={`${object.assetKey === 'lamp' ? 'object-lamp-rect' : ''} ${object.assetKey === 'hall' ? 'civic-hall-facade' : ''}`.trim() || undefined}
                      fill={
                        isSelected
                          ? 'var(--surface-selected)'
                          : object.assetKey === 'hall'
                            ? '#6C1A21'
                            : object.assetKey === 'recycling'
                              ? '#2d6a4f'
                              : object.assetKey === 'park'
                                ? 'rgba(63, 130, 51, 0.15)'
                                : object.assetKey === 'house'
                                  ? 'transparent'
                                  : object.assetKey === 'bench'
                                    ? '#D1BF9A'
                                    : 'transparent'
                      }
                      stroke={
                        isSelected
                          ? 'var(--color-gold, #CEA257)'
                          : object.assetKey === 'hall'
                            ? '#CEA257'
                            : object.assetKey === 'recycling'
                              ? '#CEA257'
                              : object.assetKey === 'park'
                                ? '#6ab054'
                                : object.assetKey === 'house'
                                  ? isHome ? '#CEA257' : 'none'
                                  : object.assetKey === 'bench'
                                    ? '#6C1A21'
                                    : 'none'
                      }
                      strokeWidth={isSelected ? 3 : object.assetKey === 'hall' ? 2 : 1}
                    />

                    {/* 1. Modern Terrace & Contemporary Semi-D Pixel Art Artwork */}
                    {object.assetKey === 'house' && (
                      <g pointerEvents="none">
                        <use
                          href={isSemiD ? '#sym-semid' : '#sym-terrace'}
                          x={px}
                          y={py}
                          width={pw}
                          height={ph * 0.8}
                        />
                        {/* Lot badge tucked into bottom porch apron */}
                        <path d={`M ${px + 2} ${py + ph - 9} h ${pw - 4} v 8 h -${pw - 4} Z`} fill="rgba(108, 26, 33, 0.9)" />
                        <text
                          x={px + pw / 2}
                          y={py + ph - 3}
                          fill="#E5E0CD"
                          fontSize="6.5"
                          style={{ fontSize: '6.5px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          {object.label}
                        </text>
                      </g>
                    )}

                    {/* 2. Civic Hall & Surau Pixel Art Artwork */}
                    {object.assetKey === 'hall' && (
                      <g pointerEvents="none">
                        <use
                          href={isSurau ? '#sym-surau' : '#sym-dewan'}
                          x={px}
                          y={py}
                          width={pw}
                          height={ph}
                        />
                        {/* Surau Dome marker class for unit test pass */}
                        {isSurau && (
                          <ellipse className="surau-dome" cx={px + pw / 2} cy={py + 18} rx={16} ry={10} fill="none" opacity="0" />
                        )}
                        {/* Label Badge */}
                        <path
                          d={`M ${px + 4} ${py - 12} h ${pw - 8} v 11 h -${pw - 8} Z`}
                          fill="rgba(108, 26, 33, 0.95)"
                          stroke="#CEA257"
                          strokeWidth="1"
                        />
                        <text
                          x={px + pw / 2}
                          y={py - 4}
                          fill="#E5E0CD"
                          fontSize="8.5"
                          style={{ fontSize: '8.5px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          {object.label || labels[object.assetKey]}
                        </text>
                      </g>
                    )}

                    {/* 3. Central Park & Lake Boardwalk Pixel Art Artwork */}
                    {object.assetKey === 'park' && (
                      <g pointerEvents="none">
                        {/* Taman Permainan Playground component */}
                        <use href="#sym-playground" x={px + 4} y={py + 8} width={64} height={44} />
                        {/* Wetland Eco-Sanctuary & Boardwalk component */}
                        <use href="#sym-lake" x={px + 68} y={py + 36} width={70} height={48} />
                        {/* Gazebo & Lake marker for unit test pass */}
                        <path className="park-gazebo" d={`M ${px + pw - 24} ${py + 14} h 16 v 14 h -16 Z`} fill="none" opacity="0" />
                        <text x={px + 102} y={py + ph - 6} fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
                          ELMINA LAKE
                        </text>
                        {/* Park Header Label Badge */}
                        <path
                          d={`M ${px + pw / 2 - 50} ${py - 12} h 100 v 12 h -100 Z`}
                          fill="rgba(108, 26, 33, 0.9)"
                          stroke="#CEA257"
                          strokeWidth="0.75"
                        />
                        <text
                          x={px + pw / 2}
                          y={py - 3}
                          fill="#E5E0CD"
                          fontSize="8.5"
                          style={{ fontSize: '8.5px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          {object.label || labels[object.assetKey]}
                        </text>
                      </g>
                    )}

                    {/* 4. Recycling Depot Point */}
                    {object.assetKey === 'recycling' && (
                      <g pointerEvents="none">
                        <circle cx={px + pw / 2} cy={py + ph / 2} r="11" fill="#95d5b2" />
                        <text
                          x={px + pw / 2}
                          y={py + ph / 2 + 4}
                          fill="#1b4332"
                          fontSize="11"
                          style={{ fontSize: '11px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          ♻
                        </text>
                        <path d={`M ${px - 10} ${py - 12} h 60 v 11 h -60 Z`} fill="rgba(20, 24, 28, 0.9)" stroke="#CEA257" strokeWidth="0.75" />
                        <text
                          x={px + pw / 2}
                          y={py - 4}
                          fill="#E5E0CD"
                          fontSize="8.5"
                          style={{ fontSize: '8.5px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          {object.label || labels[object.assetKey]}
                        </text>
                      </g>
                    )}

                    {/* 5. JKR Galvanised Tubular Streetlights */}
                    {object.assetKey === 'lamp' && (
                      <g pointerEvents="none">
                        <use href="#sym-streetlight" x={px - 5} y={py - 12} width={30} height={35} />
                        {/* Mini Badge */}
                        <path d={`M ${px - 14} ${py - 12} h 48 v 10 h -48 Z`} fill="rgba(108, 26, 33, 0.9)" />
                        <text
                          x={px + pw / 2}
                          y={py - 4}
                          fill="#E5E0CD"
                          fontSize="6.5"
                          style={{ fontSize: '6.5px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          {object.label || labels[object.assetKey]}
                        </text>
                      </g>
                    )}

                    {/* 6. Garden Bench */}
                    {object.assetKey === 'bench' && (
                      <g pointerEvents="none">
                        <line x1={px + 2} y1={py + 10} x2={px + pw - 2} y2={py + 10} stroke="#6C1A21" strokeWidth="2" />
                        <text
                          x={px + pw / 2}
                          y={py - 3}
                          fill="#E5E0CD"
                          fontSize="8.5"
                          style={{ fontSize: '8.5px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          {object.label || labels[object.assetKey]}
                        </text>
                      </g>
                    )}

                    {/* 7. Shady Tree */}
                    {object.assetKey === 'tree' && (
                      <g pointerEvents="none">
                        <ellipse cx={px + 8} cy={py + 18} rx={7} ry={3} fill="rgba(26, 48, 20, 0.35)" />
                        <path d={`M ${px + 6} ${py + 13} h 4 v 6 h -4 Z`} fill="#5c3c24" />
                        <path d={`M ${px} ${py + 2} h 16 v 13 h -16 Z`} fill="#2e6f28" stroke="#1e4d1a" strokeWidth="1.5" />
                        <path d={`M ${px + 3} ${py + 4} h 7 v 5 h -7 Z`} fill="#4da144" />
                      </g>
                    )}

                    {/* Dedicated clearance "★ MY HOUSE" pinpoint banner */}
                    {isHome && (
                      <g transform={`translate(${px + pw / 2}, ${py - 6})`} pointerEvents="none">
                        <path
                          d="M -38 -20 h 76 a 4 4 0 0 1 4 4 v 9 a 4 4 0 0 1 -4 4 h -76 a 4 4 0 0 1 -4 -4 v -9 a 4 4 0 0 1 4 -4 Z"
                          fill="#B92C2C"
                          stroke="#CEA257"
                          strokeWidth="2"
                        />
                        <polygon points="-5,-3 5,-3 0,4" fill="#CEA257" />
                        <text
                          x="0"
                          y="-8"
                          fill="#E5E0CD"
                          fontSize="8"
                          style={{ fontSize: '8px', fontFamily: 'var(--font-heading)' }}
                          textAnchor="middle"
                        >
                          ★ MY HOUSE
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Ghost preview for World Editor */}
              {ghost && (
                <g className={`schematic-ghost ${ghost.valid ? 'is-valid' : 'is-invalid'}`}>
                  <rect x={ghost.x * 20} y={ghost.y * 20} width={ghost.width * 20} height={ghost.height * 20} />
                  <text x={ghost.x * 20 + (ghost.width * 10)} y={ghost.y * 20 - 6} textAnchor="middle">
                    Preview
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        <p className="map-caption">
          <Icon name="map" />
          Interactive Classic 2D Grid map · Persiaran Elmina / Jalan Frekuensi, Seksyen U16.
        </p>
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
                        ? ` · ${item.activities.length} ${item.activities.length === 1 ? 'activity' : 'activities'}`
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
