import { useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { WorldboxFacilitySheet } from './WorldboxFacilitySheet.jsx';
import {
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
  ELMINA_PERSONAS,
  ELMINA_TOWNSHIP,
} from './worldboxData.js';

import { ClassicGridMap } from './maps/ClassicGridMap.jsx';
import { IsometricDioramaMap } from './maps/IsometricDioramaMap.jsx';
import { CartographicBlueprintMap } from './maps/CartographicBlueprintMap.jsx';
import { StickerboardPatchMap } from './maps/StickerboardPatchMap.jsx';

export const APPROACHES = [
  {
    id: 'classic-grid',
    name: 'Classic 2D Grid',
    subtitle: 'Retro RPG GameBoy style',
    description: 'Flat top-down orthogonal pixel grid with high-contrast road tiles, pixel tree clusters, and crisp parcel outlines.',
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
  const [zoom, setZoom] = useState(1);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const viewportRef = useRef(null);

  const activePersona = ELMINA_PERSONAS.find(p => p.id === activePersonaId) || ELMINA_PERSONAS[0];
  const isResident = activePersona.role === 'resident';

  // Find user's home object
  const userHomeObject = isResident
    ? ELMINA_LAYOUT.find(o => o.objectId === activePersona.homeObjectId)
    : null;

  // Selected item and facility
  const selectedObject = ELMINA_LAYOUT.find(o => o.objectId === selectedObjectId);
  const selectedFacility = selectedObject?.facilityId
    ? ELMINA_FACILITIES.find(f => f.id === selectedObject.facilityId)
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
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
      viewportRef.current.scrollTop = 0;
    }
  }

  function handleFindMyHouse() {
    if (!userHomeObject || !viewportRef.current) return;
    const newZoom = Math.max(zoom, 1.75);
    setZoom(newZoom);
    const view = viewportRef.current;

    let targetX, targetY;
    if (activeApproach === 'isometric-25d') {
      // Isometric projection coordinate
      targetX = 320 + (userHomeObject.x - userHomeObject.y) * 18;
      targetY = 80 + (userHomeObject.x + userHomeObject.y) * 9;
    } else {
      // Orthogonal grid coordinate
      targetX = (userHomeObject.x + userHomeObject.width / 2) * 20;
      targetY = (userHomeObject.y + userHomeObject.height / 2) * 20;
    }

    setTimeout(() => {
      view.scrollTo({
        left: targetX * newZoom - view.clientWidth / 2,
        top: targetY * newZoom - view.clientHeight / 2,
        behavior: 'smooth',
      });
      setSelectedObjectId(userHomeObject.objectId);
    }, 50);
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

        {/* Viewport Canvas Area */}
        <div className="worldbox-viewport" ref={viewportRef}>
          <div
            id="map-canvas-container"
            style={{
              width: `${640 * zoom}px`,
              height: `${480 * zoom}px`,
              position: 'relative',
              transition: 'width 0.15s ease-out, height 0.15s ease-out',
            }}
          >
            <ActiveMapComponent
              layout={ELMINA_LAYOUT}
              facilities={ELMINA_FACILITIES}
              selectedObjectId={selectedObjectId}
              userHomeObjectId={userHomeObject?.objectId}
              onSelect={obj => setSelectedObjectId(obj.objectId)}
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
