import React from 'react';

export function CartographicBlueprintMap({
  layout = [],
  facilities = [],
  selectedObjectId,
  userHomeObjectId = 'obj-house-12',
  onSelect = () => {},
}) {
  return (
    <svg
      className="worldbox-svg-canvas cartographic-blueprint-map"
      viewBox="0 0 640 480"
      width="100%"
      height="100%"
      role="img"
      aria-label="Approach 3: Pixel Cartographic Blueprint Map of Elmina Seksyen U16"
      style={{ background: '#221317', border: '3px solid #CEA257' }}
    >
      <defs>
        {/* Blueprint Grid Lines */}
        <pattern id="carto-blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#221317" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3d222a" strokeWidth="1" />
          <path d="M 20 0 L 20 40 M 0 20 L 40 20" fill="none" stroke="#2d181e" strokeWidth="0.5" strokeDasharray="2,2" />
        </pattern>
      </defs>

      {/* 1. Blueprint Grid Background */}
      <rect width="640" height="480" fill="url(#carto-blueprint-grid)" />

      {/* 2. Zoned Area Underlays */}
      {/* Green Corridor Zone */}
      <rect x="180" y="270" width="160" height="130" rx="8" fill="rgba(69, 102, 60, 0.25)" stroke="#588157" strokeWidth="1.5" strokeDasharray="6,4" />
      <text x="195" y="290" fill="#a3b18a" fontSize="9" fontFamily="Bungee">ZONE: GREEN BUFFER</text>

      {/* Residential Enclave Zone */}
      <rect x="50" y="30" width="120" height="160" rx="6" fill="rgba(185, 44, 44, 0.15)" stroke="#B92C2C" strokeWidth="1" strokeDasharray="4,4" />
      <text x="60" y="48" fill="#D1BF9A" fontSize="8" fontFamily="Bungee">SECTOR: FREKUENSI</text>

      {/* Civic Zone */}
      <rect x="360" y="50" width="140" height="130" rx="6" fill="rgba(206, 162, 87, 0.15)" stroke="#CEA257" strokeWidth="1" strokeDasharray="4,4" />
      <text x="370" y="68" fill="#CEA257" fontSize="8" fontFamily="Bungee">SECTOR: CIVIC &amp; COMMUNITY</text>

      {/* 3. Bold Arterial Corridors */}
      {/* Persiaran Elmina (Horizontal Primary Arterial) */}
      <rect x="0" y="215" width="640" height="40" fill="#150a0d" stroke="#CEA257" strokeWidth="2.5" />
      <line x1="0" y1="235" x2="640" y2="235" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="12,8" />

      {/* Jalan Frekuensi 1 (Vertical Avenue) */}
      <rect x="140" y="0" width="30" height="480" fill="#150a0d" stroke="#D1BF9A" strokeWidth="1.5" />
      {/* Jalan Frekuensi 2 (Vertical Avenue) */}
      <rect x="340" y="0" width="30" height="480" fill="#150a0d" stroke="#D1BF9A" strokeWidth="1.5" />

      {/* 4. Cartographic Route Badges */}
      <g className="carto-badges" pointerEvents="none">
        <rect x="25" y="223" width="170" height="24" rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="2" />
        <text x="110" y="239" fill="#E5E0CD" fontSize="10" fontFamily="Bungee" textAnchor="middle">
          PERSIARAN ELMINA
        </text>

        <rect x="135" y="440" width="150" height="22" rx="4" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1.5" />
        <text x="210" y="455" fill="#E5E0CD" fontSize="9" fontFamily="Bungee" textAnchor="middle">
          JALAN FREKUENSI
        </text>
      </g>

      {/* 5. Cartographic Nodes & Amenities */}
      {layout.map(obj => {
        const isSelected = obj.objectId === selectedObjectId;
        const isHome = obj.objectId === userHomeObjectId;
        const facility = facilities.find(f => f.id === obj.facilityId);
        const px = obj.x * 20 + 10;
        const py = obj.y * 20 + 10;

        return (
          <g
            key={obj.objectId}
            id={obj.objectId}
            className={`carto-node ${isSelected ? 'is-selected' : ''}`}
            transform={`translate(${px}, ${py})`}
            onClick={() => onSelect(obj)}
            style={{ cursor: 'pointer' }}
          >
            {/* Halo */}
            {isSelected && (
              <circle cx="0" cy="0" r="22" fill="none" stroke="#CEA257" strokeWidth="2.5" strokeDasharray="4,2" />
            )}

            {/* Node Symbol */}
            {obj.assetKey === 'house' && (
              <g>
                <circle cx="0" cy="0" r={isHome ? "16" : "12"} fill={isHome ? "#B92C2C" : "#6C1A21"} stroke="#CEA257" strokeWidth={isHome ? "2.5" : "1.5"} />
                <text x="0" y="4" fill="#E5E0CD" fontSize="10" fontFamily="Bungee" textAnchor="middle">⌂</text>
              </g>
            )}

            {obj.assetKey === 'hall' && (
              <g>
                <rect x="-16" y="-14" width="32" height="28" rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="2" />
                <text x="0" y="4" fill="#CEA257" fontSize="11" fontFamily="Bungee" textAnchor="middle">🏛</text>
              </g>
            )}

            {obj.assetKey === 'park' && (
              <g>
                <circle cx="0" cy="0" r="18" fill="#2d4a25" stroke="#CEA257" strokeWidth="2" />
                <text x="0" y="4" fill="#E5E0CD" fontSize="11" fontFamily="Bungee" textAnchor="middle">🌲</text>
              </g>
            )}

            {obj.assetKey === 'recycling' && (
              <g>
                <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#38543d" stroke="#D1BF9A" strokeWidth="1.5" />
                <text x="0" y="4" fill="#E5E0CD" fontSize="10" fontFamily="Bungee" textAnchor="middle">♻</text>
              </g>
            )}

            {obj.assetKey === 'lamp' && (
              <g>
                <circle cx="0" cy="0" r="7" fill="#CEA257" stroke="#6C1A21" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#CEA257" strokeWidth="0.8" strokeDasharray="2,2" />
              </g>
            )}

            {/* "MY HOUSE" Banner */}
            {isHome && (
              <g transform="translate(0, -22)">
                <rect x="-42" y="-12" width="84" height="18" rx="3" fill="#B92C2C" stroke="#CEA257" strokeWidth="1.5" />
                <text x="0" y="0" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
                  ★ MY HOUSE
                </text>
              </g>
            )}

            {/* Node Label */}
            {!isHome && obj.label && (
              <g transform="translate(0, 22)">
                <rect x="-40" y="-10" width="80" height="15" rx="3" fill="#150a0d" stroke="#D1BF9A" strokeWidth="0.8" />
                <text x="0" y="1" fill="#E5E0CD" fontSize="7" fontFamily="Bungee" textAnchor="middle">
                  {obj.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
