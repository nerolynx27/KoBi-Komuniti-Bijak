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
    const targetX = (userHomeObject.x + userHomeObject.width / 2) * 20;
    const targetY = (userHomeObject.y + userHomeObject.height / 2) * 20;
    const offsetX = (320 - targetX) * targetZoom;
    const offsetY = (240 - targetY) * targetZoom;
    setPan({ x: offsetX, y: offsetY });
    setSelection(userHomeObject.objectId);
  }

  // Pointer drag-to-pan handlers
  function handlePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originPanX: pan.x,
      originPanY: pan.y,
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
    setPan({
      x: dragStateRef.current.originPanX + dx,
      y: dragStateRef.current.originPanY + dy,
    });
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
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              position: 'relative',
              transition: isDragging ? 'none' : 'width 0.15s ease-out, height 0.15s ease-out, transform 0.2s ease-out',
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
              </defs>

              {/* 1. Lively Green Base Terrain Ground */}
              <rect width="640" height="480" fill="url(#classic-grid-pattern)" className="schematic-ground" />

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
              <rect x="0" y="220" width="640" height="40" fill="url(#classic-asphalt-pattern)" />
              <line x1="0" y1="240" x2="640" y2="240" stroke="#CEA257" strokeWidth="2" strokeDasharray="14,10" />

              {/* Jalan Frekuensi 1 */}
              <rect x="140" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" />
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
                    {/* Primary object bounding rect (matches Playwright attribute expectations) */}
                    <rect
                      x={px}
                      y={py}
                      width={pw}
                      height={ph}
                      rx={object.assetKey === 'lamp' ? 1 : object.assetKey === 'tree' ? 4 : 2}
                      className={object.assetKey === 'lamp' ? 'object-lamp-rect' : undefined}
                    />

                    {/* Architectural & Amenity Glyphs */}
                    {object.assetKey === 'house' && (
                      <g pointerEvents="none">
                        <polygon
                          points={`${px - 1},${py + 10} ${px + pw / 2},${py} ${px + pw + 1},${py + 10}`}
                          fill={isHome ? '#CEA257' : '#D1BF9A'}
                          stroke="#3b1d19"
                          strokeWidth="1.5"
                        />
                        <path d={`M ${px + pw / 2 - 3} ${py + ph - 8} h 6 v 8 h -6 Z`} fill="#4a1d17" />
                        {!isHome && object.label && (
                          <text
                            x={px + pw / 2}
                            y={py + ph - 2}
                            fill="#E5E0CD"
                            fontSize="6.5"
                            fontFamily="Bungee"
                            textAnchor="middle"
                          >
                            {object.label}
                          </text>
                        )}
                      </g>
                    )}

                    {object.assetKey === 'hall' && (
                      <g pointerEvents="none">
                        <polygon
                          points={`${px},${py + 14} ${px + pw / 2},${py + 2} ${px + pw},${py + 14}`}
                          fill="#CEA257"
                        />
                        <line x1={px + 8} y1={py + 14} x2={px + 8} y2={py + ph - 2} stroke="#E5E0CD" strokeWidth="2.5" />
                        <line x1={px + pw - 8} y1={py + 14} x2={px + pw - 8} y2={py + ph - 2} stroke="#E5E0CD" strokeWidth="2.5" />
                      </g>
                    )}

                    {object.assetKey === 'park' && (
                      <g pointerEvents="none">
                        <polygon
                          points={`${px + pw - 44},${py + 20} ${px + pw - 28},${py + 10} ${px + pw - 12},${py + 20}`}
                          fill="#CEA257"
                        />
                      </g>
                    )}

                    {object.assetKey === 'recycling' && (
                      <g pointerEvents="none">
                        <circle cx={px + pw / 2} cy={py + ph / 2} r="11" fill="#95d5b2" />
                        <text x={px + pw / 2} y={py + ph / 2 + 4} fill="#1b4332" fontSize="11" fontFamily="Bungee" textAnchor="middle">
                          ♻
                        </text>
                      </g>
                    )}

                    {object.assetKey === 'lamp' && (
                      <g pointerEvents="none">
                        <circle cx={px + pw / 2} cy={py + ph / 2} r="14" fill="rgba(206, 162, 87, 0.28)" />
                        <line x1={px + pw / 2} y1={py + 4} x2={px + pw / 2} y2={py + ph - 2} stroke="#6C1A21" strokeWidth="2" />
                        <circle cx={px + pw / 2} cy={py + 4} r="4" fill="#CEA257" stroke="#6C1A21" strokeWidth="1.2" />
                      </g>
                    )}

                    {/* Object Label */}
                    <text x={px + pw / 2} y={py - 6} textAnchor="middle">
                      {object.label || labels[object.assetKey]}
                    </text>

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
                        <text x="0" y="-8" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
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
          This location is no longer available. Choose another place below.
        </p>
      )}

      {/* Place selection button list */}
      <section className="section-stack">
        <div className="section-heading">
          <h2>{compact ? 'Select a component' : 'Explore your places'}</h2>
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
    </div>
  );
}
