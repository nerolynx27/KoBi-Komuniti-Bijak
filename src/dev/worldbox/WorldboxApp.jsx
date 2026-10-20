import { useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { WorldboxFacilitySheet } from './WorldboxFacilitySheet.jsx';
import {
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
  ELMINA_PERSONAS,
  ELMINA_TOWNSHIP,
  calculateDistanceMeters,
  formatWalkingDistance,
  resolveObjectFacility,
} from './worldboxData.js';

import { ClassicGridMap } from './maps/ClassicGridMap.jsx';
import { IsometricDioramaMap } from './maps/IsometricDioramaMap.jsx';
import { CartographicBlueprintMap } from './maps/CartographicBlueprintMap.jsx';
import { StickerboardPatchMap } from './maps/StickerboardPatchMap.jsx';

export const APPROACHES = [
  {
    id: 'classic-grid',
    name: 'Classic 2D Grid',
    subtitle: 'Selected · Retro RPG style',
    description: 'Lively green top-down pixel grid with roadside streetlights, 20+ terrace houses, hover tooltips, and click-and-drag panning.',
  },
  {
    id: 'isometric-25d',
    name: 'Isometric 2.5D',
    subtitle: 'SimCity / Habbo style',
    description: 'Angled diorama projection showcasing architectural volume, building facades, and dynamic pixel depth cues.',
  },
  {
    id: 'cartographic',
    name: 'Cartographic',
    subtitle: 'Civic Blueprint style',
    description: 'Chunky pixel transit/blueprint map emphasizing arterial road hierarchy and high-visibility landmark nodes.',
  },
  {
    id: 'pixel-stickers',
    name: 'Pixel Stickers',
    subtitle: 'Tactile Patch style',
    description: 'Tactile community pinboard featuring chunky die-cut badge amenities and organic stitched neighborhood greenery.',
  },
];

const MAP_COMPONENTS = {
  'classic-grid': ClassicGridMap,
  'isometric-25d': IsometricDioramaMap,
  'cartographic': CartographicBlueprintMap,
  'pixel-stickers': StickerboardPatchMap,
};

export function WorldboxApp() {
  const [activeApproach, setActiveApproach] = useState('classic-grid');
  const [activePersonaId, setActivePersonaId] = useState('resident-alex');
  const [zoom, setZoom] = useState(1.25);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [hoveredObjectId, setHoveredObjectId] = useState(null);

  const viewportRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
    moved: false,
  });

  const activePersona = ELMINA_PERSONAS.find(p => p.id === activePersonaId) || ELMINA_PERSONAS[0];
  const isResident = activePersona.role === 'resident';

  // Find user's home object
  const userHomeObject = isResident
    ? ELMINA_LAYOUT.find(o => o.objectId === activePersona.homeObjectId)
    : null;

  // Selected item and facility (supports both public amenities and residential houses)
  const selectedObject = ELMINA_LAYOUT.find(o => o.objectId === selectedObjectId);
  const selectedFacility = resolveObjectFacility(selectedObject, ELMINA_FACILITIES);

  // Hovered item for floating HUD preview
  const hoveredObject = ELMINA_LAYOUT.find(o => o.objectId === hoveredObjectId);
  const hoveredFacility = resolveObjectFacility(hoveredObject, ELMINA_FACILITIES);
  const hoveredDistance =
    isResident && userHomeObject && hoveredObject
      ? hoveredObject.objectId === userHomeObject.objectId
        ? 'Your registered home'
        : formatWalkingDistance(calculateDistanceMeters(userHomeObject, hoveredObject))
      : null;

  const isUserHome = Boolean(
    isResident && selectedObject && userHomeObject && selectedObject.objectId === userHomeObject.objectId
  );

  function handleZoomIn() {
    setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)));
  }

  function handleZoomOut() {
    setZoom(z => Math.max(1, +(z - 0.25).toFixed(2)));
  }

  function handleResetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
      viewportRef.current.scrollTop = 0;
    }
  }

  function handleFindMyHouse() {
    if (!userHomeObject) return;
    const targetZoom = Math.max(zoom, 1.75);
    setZoom(targetZoom);

    let targetX, targetY;
    if (activeApproach === 'isometric-25d') {
      targetX = 320 + (userHomeObject.x - userHomeObject.y) * 18;
      targetY = 80 + (userHomeObject.x + userHomeObject.y) * 9;
    } else {
      targetX = (userHomeObject.x + userHomeObject.width / 2) * 20;
      targetY = (userHomeObject.y + userHomeObject.height / 2) * 20;
    }

    // Center the house relative to the 640x480 map center (320, 240)
    const offsetX = (320 - targetX) * targetZoom;
    const offsetY = (240 - targetY) * targetZoom;
    setPan({ x: offsetX, y: offsetY });
    setSelectedObjectId(userHomeObject.objectId);
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

  function handleObjectSelect(obj) {
    // Do not trigger click selection if the user was dragging the map
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }
    setSelectedObjectId(obj.objectId);
  }

  const currentApproachMeta = APPROACHES.find(a => a.id === activeApproach) || APPROACHES[0];
  const ActiveMapComponent = MAP_COMPONENTS[activeApproach] || ClassicGridMap;

  return (
    <div className="worldbox-container">
      {/* Top Header */}
      <header className="worldbox-header">
        <div className="worldbox-top-row">
          <div className="worldbox-brand">
            <span className="worldbox-badge">SANDBOX</span>
            <div>
              <h1 className="worldbox-title">Worldbox · Elmina 4-Map Prototype</h1>
              <p className="worldbox-subtitle">{ELMINA_TOWNSHIP.address}</p>
            </div>
          </div>

          {/* Persona Switcher */}
          <div className="worldbox-persona-toggle">
            <span className="persona-label">Persona:</span>
            {ELMINA_PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                className={`persona-btn ${p.id === activePersonaId ? 'is-active' : ''}`}
                onClick={() => {
                  setActivePersonaId(p.id);
                  setSelectedObjectId(null);
                }}
              >
                {p.name} ({p.role === 'resident' ? 'Resident' : 'Staff'})
              </button>
            ))}
          </div>
        </div>

        {/* 4 Approaches Tab Bar */}
        <div className="approaches-bar" role="tablist" aria-label="Map design approaches">
          {APPROACHES.map(app => (
            <button
              key={app.id}
              role="tab"
              aria-selected={activeApproach === app.id}
              className={`approach-tab ${activeApproach === app.id ? 'is-active' : ''}`}
              onClick={() => setActiveApproach(app.id)}
            >
              <span>{app.name}</span>
              <span className="approach-sub">{app.subtitle}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Toolbar */}
      <main className="worldbox-main">
        <div className="worldbox-toolbar">
          <div className="approach-info">
            <h3>{currentApproachMeta.name}</h3>
            <p>{currentApproachMeta.description}</p>
          </div>

          <div className="map-controls-group">
            {isResident && userHomeObject && (
              <Button size="sm" variant="primary" icon="map" onClick={handleFindMyHouse}>
                Find my house
              </Button>
            )}
            <IconButton
              icon="minus"
              label="Zoom out"
              disabled={zoom <= 1}
              onClick={handleZoomOut}
            />
            <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
            <IconButton
              icon="plus"
              label="Zoom in"
              disabled={zoom >= 3}
              onClick={handleZoomIn}
            />
            <Button size="sm" icon="reset-view" onClick={handleResetView}>
              Reset view
            </Button>
          </div>
        </div>

        {/* Interactive Drag-to-Pan Viewport Canvas Area */}
        <div
          className={`worldbox-viewport ${isDragging ? 'is-dragging' : ''}`}
          ref={viewportRef}
          data-draggable="true"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
        >
          {/* Floating Hover HUD Readout */}
          <div className="worldbox-hover-hud" aria-live="polite">
            {hoveredFacility ? (
              <>
                <strong>{hoveredFacility.name}</strong>
                <span>
                  {hoveredFacility.category}
                  {hoveredDistance ? ` · ${hoveredDistance}` : ''} · Click to inspect
                </span>
              </>
            ) : (
              <span>✋ Drag anywhere to pan · Hover over any house or amenity · Click to inspect</span>
            )}
          </div>

          <div
            id="map-canvas-container"
            style={{
              width: `${640 * zoom}px`,
              height: `${480 * zoom}px`,
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              position: 'relative',
              transition: isDragging ? 'none' : 'width 0.15s ease-out, height 0.15s ease-out, transform 0.2s ease-out',
            }}
          >
            <ActiveMapComponent
              layout={ELMINA_LAYOUT}
              facilities={ELMINA_FACILITIES}
              selectedObjectId={selectedObjectId}
              hoveredObjectId={hoveredObjectId}
              userHomeObjectId={userHomeObject?.objectId}
              onSelect={handleObjectSelect}
              onHover={obj => setHoveredObjectId(obj ? obj.objectId : null)}
            />
          </div>
        </div>
      </main>

      {/* Amenity Detail Sheet Modal */}
      {selectedFacility && (
        <WorldboxFacilitySheet
          facility={selectedFacility}
          location={selectedObject}
          userHome={userHomeObject}
          isUserHome={isUserHome}
          onClose={() => setSelectedObjectId(null)}
        />
      )}
    </div>
  );
}
