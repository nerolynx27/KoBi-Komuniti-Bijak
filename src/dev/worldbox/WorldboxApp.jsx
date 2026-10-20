import { useRef, useState } from 'react';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { WorldboxFacilitySheet } from './WorldboxFacilitySheet.jsx';
import {
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
  ELMINA_PERSONAS,
  ELMINA_TOWNSHIP,
} from './worldboxData.js';

export const APPROACHES = [
  {
    id: 'classic-grid',
    name: 'Classic 2D Grid',
    subtitle: 'Retro RPG GameBoy style',
    description: 'Flat top-down orthogonal pixel grid with high-contrast road tiles and precise parcel outlines.',
  },
  {
    id: 'isometric-25d',
    name: 'Isometric 2.5D',
    subtitle: 'SimCity / Habbo style',
    description: 'Angled diorama projection showcasing architectural height, facade details, and dynamic pixel shadows.',
  },
  {
    id: 'cartographic',
    name: 'Cartographic',
    subtitle: 'Civic Blueprint style',
    description: 'Chunky pixel transit/blueprint map emphasizing arterial road hierarchy and prominent landmark badges.',
  },
  {
    id: 'pixel-stickers',
    name: 'Pixel Stickers',
    subtitle: 'Tactile Patch style',
    description: 'Tactile community pinboard featuring chunky die-cut badge amenities and organic neighborhood greenery.',
  },
];

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
    setZoom(z => Math.max(z, 1.75));
    const view = viewportRef.current;
    // Map is 640x480 width/height
    const targetX = (userHomeObject.x + userHomeObject.width / 2) * 20;
    const targetY = (userHomeObject.y + userHomeObject.height / 2) * 20;
    const scale = Math.max(zoom, 1.75);

    setTimeout(() => {
      view.scrollTo({
        left: targetX * scale - view.clientWidth / 2,
        top: targetY * scale - view.clientHeight / 2,
        behavior: 'smooth',
      });
      setSelectedObjectId(userHomeObject.objectId);
    }, 50);
  }

  const currentApproachMeta = APPROACHES.find(a => a.id === activeApproach) || APPROACHES[0];

  return (
    <div className="worldbox-container">
      {/* Top Header */}
      <header className="worldbox-header">
        <div className="worldbox-top-row">
          <div className="worldbox-brand">
            <span className="worldbox-badge">SANDBOX</span>
            <div>
              <h1 className="worldbox-title">Worldbox · Elmina Prototype</h1>
              <p className="worldbox-subtitle">{ELMINA_TOWNSHIP.address}</p>
            </div>
          </div>

          {/* Persona Switcher */}
          <div className="worldbox-persona-toggle">
            <span className="persona-label">Testing as:</span>
            {ELMINA_PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                className={`persona-btn ${p.id === activePersonaId ? 'is-active' : ''}`}
                onClick={() => setActivePersonaId(p.id)}
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
            <h3>Approach: {currentApproachMeta.name}</h3>
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
            }}
          >
            {/* The active map renderer will be mounted here in Task 3 */}
            <div
              className="map-placeholder"
              style={{
                width: '100%',
                height: '100%',
                background: '#4a3b32',
                border: '3px solid #CEA257',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E5E0CD',
                fontFamily: 'Bungee',
              }}
            >
              Active Map: {currentApproachMeta.name} (Loading Renderers...)
            </div>
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
