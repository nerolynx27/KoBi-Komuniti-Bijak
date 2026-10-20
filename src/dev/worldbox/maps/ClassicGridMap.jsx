import React from 'react';

export function ClassicGridMap({
  layout = [],
  facilities = [],
  selectedObjectId,
  userHomeObjectId = 'obj-house-12',
  onSelect = () => {},
}) {
  return (
    <svg
      className="worldbox-svg-canvas classic-grid-map"
      viewBox="0 0 640 480"
      width="100%"
      height="100%"
      role="img"
      aria-label="Approach 1: Classic 2D Orthographic Pixel Map of Elmina Seksyen U16"
      style={{ background: '#543d2b', border: '3px solid #CEA257' }}
    >
      <defs>
        {/* Pixel Tile Grid Pattern */}
        <pattern id="classic-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#423024" />
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#33241b" strokeWidth="1" />
          {/* Subtle grass speckles */}
          <rect x="5" y="5" width="2" height="2" fill="#4d382b" />
          <rect x="14" y="12" width="2" height="2" fill="#3a2a20" />
        </pattern>

        {/* Road Asphalt Pattern */}
        <pattern id="classic-asphalt-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#262220" />
          <rect x="0" y="0" width="20" height="2" fill="#1c1918" />
        </pattern>

        {/* Park Lawn Pattern */}
        <pattern id="classic-park-lawn" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#3d4a2b" />
          <rect x="4" y="4" width="3" height="3" fill="#4b5c33" />
          <rect x="12" y="14" width="3" height="3" fill="#333f24" />
        </pattern>
      </defs>

      {/* 1. Base Terrain Ground */}
      <rect width="640" height="480" fill="url(#classic-grid-pattern)" />

      {/* 2. Elmina Central Green Park Ground */}
      <rect x="190" y="280" width="130" height="110" rx="6" fill="url(#classic-park-lawn)" stroke="#CEA257" strokeWidth="2" />
      {/* Park pond / water feature */}
      <rect x="220" y="320" width="50" height="30" rx="4" fill="#2b4754" stroke="#1d303a" strokeWidth="2" />
      <text x="245" y="338" fill="#D1BF9A" fontSize="9" fontFamily="Bungee" textAnchor="middle">LAKE</text>

      {/* 3. Roads Network (Real Elmina layout) */}
      {/* Persiaran Elmina (Horizontal Primary Arterial) */}
      <rect x="0" y="210" width="640" height="50" fill="url(#classic-asphalt-pattern)" stroke="#D1BF9A" strokeWidth="2" strokeDasharray="0,640,0" />
      <line x1="0" y1="235" x2="640" y2="235" stroke="#CEA257" strokeWidth="2" strokeDasharray="14,10" />

      {/* Jalan Frekuensi 1 (Vertical West Avenue) */}
      <rect x="130" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" />
      <line x1="150" y1="0" x2="150" y2="210" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />
      <line x1="150" y1="260" x2="150" y2="480" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

      {/* Jalan Frekuensi 2 (Vertical East Avenue) */}
      <rect x="340" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" />
      <line x1="360" y1="0" x2="360" y2="210" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />
      <line x1="360" y1="260" x2="360" y2="480" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

      {/* Jalan Frekuensi 3 (Connecting Cross Street) */}
      <rect x="130" y="70" width="250" height="35" fill="url(#classic-asphalt-pattern)" />
      <line x1="170" y1="87" x2="340" y2="87" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

      {/* 4. Street Name Road Labels */}
      <g className="street-labels" pointerEvents="none">
        <rect x="20" y="222" width="160" height="22" rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="1.5" />
        <text x="100" y="237" fill="#E5E0CD" fontSize="11" fontFamily="Bungee" textAnchor="middle" letterSpacing="0.05em">
          PERSIARAN ELMINA
        </text>

        <rect x="135" y="14" width="30" height="150" rx="4" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
        <text x="151" y="28" fill="#E5E0CD" fontSize="9" fontFamily="Bungee" textAnchor="middle" writingMode="vertical-rl">
          JALAN FREKUENSI 1
        </text>

        <rect x="345" y="14" width="30" height="150" rx="4" fill="#6C1A21" stroke="#D1BF9A" strokeWidth="1" />
        <text x="361" y="28" fill="#E5E0CD" fontSize="9" fontFamily="Bungee" textAnchor="middle" writingMode="vertical-rl">
          JALAN FREKUENSI 2
        </text>
      </g>

      {/* 5. Decorative Pixel Trees */}
      {[[90, 40], [90, 150], [90, 310], [90, 420], [315, 305], [315, 365], [420, 120], [420, 290]].map(([tx, ty], i) => (
        <g key={`tree-${i}`} transform={`translate(${tx}, ${ty})`}>
          <rect x="6" y="14" width="4" height="6" fill="#382618" />
          <rect x="0" y="2" width="16" height="14" rx="3" fill="#2d4222" stroke="#1c2d14" strokeWidth="1.5" />
          <rect x="4" y="4" width="6" height="4" fill="#3c572e" />
        </g>
      ))}

      {/* 6. Interactive Layout Objects & Amenities */}
      {layout.map(obj => {
        const isSelected = obj.objectId === selectedObjectId;
        const isHome = obj.objectId === userHomeObjectId;
        const facility = facilities.find(f => f.id === obj.facilityId);
        const px = obj.x * 20;
        const py = obj.y * 20;
        const pw = obj.width * 20;
        const ph = obj.height * 20;

        return (
          <g
            key={obj.objectId}
            id={obj.objectId}
            className={`map-object ${isSelected ? 'is-selected' : ''} ${isHome ? 'is-user-home' : ''}`}
            onClick={() => onSelect(obj)}
            style={{ cursor: 'pointer' }}
          >
            {/* Selection Halo */}
            {isSelected && (
              <rect
                x={px - 4}
                y={py - 4}
                width={pw + 8}
                height={ph + 8}
                rx="4"
                fill="none"
                stroke="#CEA257"
                strokeWidth="3"
                strokeDasharray="4,2"
              />
            )}

            {/* Building / Amenity Base */}
            {obj.assetKey === 'house' && (
              <g>
                {/* House Base */}
                <rect x={px} y={py} width={pw} height={ph} rx="2" fill={isHome ? '#B92C2C' : '#8A3C38'} stroke="#1a1412" strokeWidth="2" />
                {/* Roof Ridge */}
                <polygon points={`${px},${py + 8} ${px + pw / 2},${py} ${px + pw},${py + 8}`} fill={isHome ? '#CEA257' : '#D1BF9A'} />
                {/* Door & Window */}
                <rect x={px + pw / 2 - 3} y={py + ph - 8} width="6" height="8" fill="#3b2820" />
                <rect x={px + 4} y={py + 10} width="6" height="6" fill="#E5E0CD" />
              </g>
            )}

            {obj.assetKey === 'hall' && (
              <g>
                <rect x={px} y={py} width={pw} height={ph} rx="3" fill="#6C1A21" stroke="#CEA257" strokeWidth="2" />
                {/* Columns */}
                <line x1={px + 8} y1={py + 10} x2={px + 8} y2={py + ph} stroke="#D1BF9A" strokeWidth="3" />
                <line x1={px + pw - 8} y1={py + 10} x2={px + pw - 8} y2={py + ph} stroke="#D1BF9A" strokeWidth="3" />
                {/* Arched pediment */}
                <polygon points={`${px},${py + 10} ${px + pw / 2},${py} ${px + pw},${py + 10}`} fill="#CEA257" />
              </g>
            )}

            {obj.assetKey === 'park' && (
              <g>
                <rect x={px} y={py} width={pw} height={ph} rx="6" fill="#2d4a25" stroke="#486938" strokeWidth="2" />
                <circle cx={px + pw / 2} cy={py + ph / 2} r="14" fill="#3f6634" />
                <rect x={px + pw / 2 - 8} y={py + ph / 2 - 4} width="16" height="8" rx="2" fill="#D1BF9A" />
              </g>
            )}

            {obj.assetKey === 'recycling' && (
              <g>
                <rect x={px} y={py} width={pw} height={ph} rx="3" fill="#3a5a40" stroke="#CEA257" strokeWidth="2" />
                <circle cx={px + pw / 2} cy={py + ph / 2} r="10" fill="#a3b18a" />
                <text x={px + pw / 2} y={py + ph / 2 + 4} fill="#1b2e21" fontSize="11" fontFamily="Bungee" textAnchor="middle">♻</text>
              </g>
            )}

            {obj.assetKey === 'lamp' && (
              <g>
                {/* Light glow pool */}
                <circle cx={px + 10} cy={py + 10} r="18" fill="rgba(206, 162, 87, 0.25)" />
                <circle cx={px + 10} cy={py + 10} r="4" fill="#CEA257" stroke="#6C1A21" strokeWidth="1.5" />
                <line x1={px + 10} y1={py + 10} x2={px + 10} y2={py + 18} stroke="#D1BF9A" strokeWidth="2" />
              </g>
            )}

            {/* "MY HOUSE" Banner if user's home */}
            {isHome && (
              <g transform={`translate(${px + pw / 2}, ${py - 12})`}>
                <rect x="-35" y="-14" width="70" height="18" rx="4" fill="#B92C2C" stroke="#CEA257" strokeWidth="2" />
                <text x="0" y="-2" fill="#E5E0CD" fontSize="9" fontFamily="Bungee" textAnchor="middle">
                  ★ MY HOUSE
                </text>
              </g>
            )}

            {/* Object Label */}
            {!isHome && obj.label && (
              <text
                x={px + pw / 2}
                y={py - 6}
                fill="#E5E0CD"
                fontSize="8"
                fontFamily="Bungee"
                textAnchor="middle"
                style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000' }}
              >
                {obj.label}
              </text>
            )}

            {/* Condition Dot */}
            {facility?.state && (
              <circle
                cx={px + pw - 4}
                cy={py + 4}
                r="4"
                fill={facility.state === 'reported' ? '#B92C2C' : facility.state === 'repairing' ? '#CEA257' : '#588157'}
                stroke="#E5E0CD"
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
