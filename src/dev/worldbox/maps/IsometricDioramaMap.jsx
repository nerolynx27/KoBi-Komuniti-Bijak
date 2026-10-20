import React from 'react';

// Isometric transformation helper: converts grid (x, y) to diorama (screenX, screenY)
function toIso(x, y, elevation = 0) {
  const originX = 320;
  const originY = 80;
  const tileW = 18;
  const tileH = 9;
  return {
    x: originX + (x - y) * tileW,
    y: originY + (x + y) * tileH - elevation,
  };
}

export function IsometricDioramaMap({
  layout = [],
  facilities = [],
  selectedObjectId,
  userHomeObjectId = 'obj-house-12',
  onSelect = () => {},
}) {
  return (
    <svg
      className="worldbox-svg-canvas isometric-diorama-map"
      viewBox="0 0 640 480"
      width="100%"
      height="100%"
      role="img"
      aria-label="Approach 2: Angled 2.5D Isometric Diorama Map of Elmina Seksyen U16"
      style={{ background: '#2c1e19', border: '3px solid #CEA257' }}
    >
      <defs>
        {/* Shadow filter for 2.5D depth */}
        <filter id="iso-shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* 1. Base Isometric Ground Plinth */}
      <polygon
        points="320,40 620,190 320,340 20,190"
        fill="#3d2b22"
        stroke="#5a4235"
        strokeWidth="2"
      />
      {/* Plinth Thickness / Cutaway side */}
      <polygon points="20,190 320,340 320,360 20,210" fill="#241913" />
      <polygon points="620,190 320,340 320,360 620,210" fill="#1b130e" />

      {/* 2. Central Park Green Lawn Zone */}
      <polygon
        points="320,220 440,280 340,330 220,270"
        fill="#314723"
        stroke="#476933"
        strokeWidth="2"
      />
      {/* Lake in park */}
      <polygon
        points="330,260 370,280 340,295 300,275"
        fill="#24404d"
        stroke="#182c35"
        strokeWidth="1.5"
      />

      {/* 3. Isometric Road Boulevards */}
      {/* Persiaran Elmina (Boulevard running NW to SE) */}
      <polygon
        points="170,115 470,265 440,280 140,130"
        fill="#1f1c1b"
        stroke="#CEA257"
        strokeWidth="1.5"
      />
      {/* Dashed center line */}
      <line x1="155" y1="122" x2="455" y2="272" stroke="#CEA257" strokeWidth="1.5" strokeDasharray="8,6" />

      {/* Jalan Frekuensi (Avenue running SW to NE) */}
      <polygon
        points="220,90 250,75 450,175 420,190"
        fill="#1f1c1b"
        stroke="#D1BF9A"
        strokeWidth="1"
      />

      {/* 4. Road Street Names */}
      <g transform="translate(190, 160) rotate(26)" pointerEvents="none">
        <rect x="0" y="-12" width="130" height="18" rx="3" fill="#6C1A21" stroke="#CEA257" strokeWidth="1" />
        <text x="65" y="0" fill="#E5E0CD" fontSize="9" fontFamily="Bungee" textAnchor="middle">
          PERSIARAN ELMINA
        </text>
      </g>

      <g transform="translate(310, 105) rotate(-26)" pointerEvents="none">
        <rect x="0" y="-12" width="115" height="18" rx="3" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
        <text x="57" y="0" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
          JALAN FREKUENSI
        </text>
      </g>

      {/* 5. 2.5D Isometric Trees */}
      {[
        [2, 2], [3, 14], [8, 18], [15, 2], [18, 15]
      ].map(([tx, ty], i) => {
        const pt = toIso(tx, ty);
        return (
          <g key={`iso-tree-${i}`} transform={`translate(${pt.x}, ${pt.y})`} filter="url(#iso-shadow)">
            {/* Trunk */}
            <line x1="0" y1="0" x2="0" y2="-10" stroke="#3d271d" strokeWidth="3" />
            {/* 3D Foliage cone */}
            <circle cx="0" cy="-14" r="9" fill="#2d4a22" />
            <circle cx="-2" cy="-16" r="6" fill="#3c612e" />
          </g>
        );
      })}

      {/* 6. Interactive 2.5D Isometric Buildings and Amenities */}
      {layout.map(obj => {
        const isSelected = obj.objectId === selectedObjectId;
        const isHome = obj.objectId === userHomeObjectId;
        const facility = facilities.find(f => f.id === obj.facilityId);
        const pt = toIso(obj.x, obj.y);
        const w = obj.width * 14;
        const h = 22; // Building 3D height

        return (
          <g
            key={obj.objectId}
            id={obj.objectId}
            className={`iso-object ${isSelected ? 'is-selected' : ''}`}
            transform={`translate(${pt.x}, ${pt.y})`}
            onClick={() => onSelect(obj)}
            style={{ cursor: 'pointer' }}
          >
            {/* Selection Base Indicator */}
            {isSelected && (
              <ellipse cx="0" cy="4" rx={w + 6} ry={w / 2 + 3} fill="none" stroke="#CEA257" strokeWidth="2.5" strokeDasharray="3,2" />
            )}

            {/* 2.5D Extruded Building Mesh */}
            {obj.assetKey === 'house' && (
              <g filter="url(#iso-shadow)">
                {/* Left Wall */}
                <polygon points={`0,0 -${w},-${w/2} -${w},-${w/2 + h} 0,-${h}`} fill={isHome ? '#821f24' : '#573d32'} />
                {/* Right Wall */}
                <polygon points={`0,0 ${w},-${w/2} ${w},-${w/2 + h} 0,-${h}`} fill={isHome ? '#5c161a' : '#3d2b23'} />
                {/* Roof Pitch Top */}
                <polygon points={`0,-${h + 10} -${w},-${w/2 + h} 0,-${h} ${w},-${w/2 + h}`} fill={isHome ? '#CEA257' : '#D1BF9A'} />
                {/* Door on right wall */}
                <polygon points={`3,-2 10,-5 10,-12 3,-9`} fill="#1f1612" />
              </g>
            )}

            {obj.assetKey === 'hall' && (
              <g filter="url(#iso-shadow)">
                {/* Dewan Komuniti / Surau 2.5D civic model */}
                <polygon points={`0,0 -${w * 1.3},-${w * 0.65} -${w * 1.3},-${w * 0.65 + h * 1.2} 0,-${h * 1.2}`} fill="#6C1A21" />
                <polygon points={`0,0 ${w * 1.3},-${w * 0.65} ${w * 1.3},-${w * 0.65 + h * 1.2} 0,-${h * 1.2}`} fill="#4a1217" />
                {/* Arched Roof */}
                <polygon points={`0,-${h * 1.2 + 12} -${w * 1.3},-${w * 0.65 + h * 1.2} 0,-${h * 1.2} ${w * 1.3},-${w * 0.65 + h * 1.2}`} fill="#CEA257" />
                {/* Decorative dome or cupola if surau */}
                {obj.facilityId === 'surau-elmina' && (
                  <circle cx="0" cy={-(h * 1.2 + 16)} r="7" fill="#CEA257" stroke="#6C1A21" strokeWidth="1.5" />
                )}
              </g>
            )}

            {obj.assetKey === 'park' && (
              <g filter="url(#iso-shadow)">
                <ellipse cx="0" cy="0" rx="22" ry="11" fill="#2d4a22" stroke="#486938" strokeWidth="1.5" />
                <circle cx="-5" cy="-6" r="8" fill="#3c612e" />
                <circle cx="6" cy="-8" r="7" fill="#4d7c3b" />
              </g>
            )}

            {obj.assetKey === 'recycling' && (
              <g filter="url(#iso-shadow)">
                <polygon points="0,0 -10,-5 -10,-18 0,-13" fill="#2e4f35" />
                <polygon points="0,0 10,-5 10,-18 0,-13" fill="#1e3423" />
                <polygon points="0,-13 -10,-18 0,-23 10,-18" fill="#a3b18a" />
              </g>
            )}

            {obj.assetKey === 'lamp' && (
              <g>
                <line x1="0" y1="0" x2="0" y2="-18" stroke="#D1BF9A" strokeWidth="2" />
                <circle cx="0" cy="-20" r="3" fill="#CEA257" />
                <ellipse cx="0" cy="2" rx="10" ry="5" fill="rgba(206, 162, 87, 0.3)" />
              </g>
            )}

            {/* "MY HOUSE" 2.5D Pin */}
            {isHome && (
              <g transform="translate(0, -42)" filter="url(#iso-shadow)">
                <rect x="-36" y="-12" width="72" height="18" rx="4" fill="#B92C2C" stroke="#CEA257" strokeWidth="1.5" />
                <text x="0" y="0" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
                  ★ MY HOUSE
                </text>
                <polygon points="0,6 -4,0 4,0" fill="#B92C2C" />
              </g>
            )}

            {/* Label */}
            {!isHome && obj.label && (
              <text
                x="0"
                y={-(h + 8)}
                fill="#E5E0CD"
                fontSize="8"
                fontFamily="Bungee"
                textAnchor="middle"
                style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000' }}
              >
                {obj.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
