import React from 'react';

export function StickerboardPatchMap({
  layout = [],
  facilities = [],
  selectedObjectId,
  userHomeObjectId = 'obj-house-12',
  onSelect = () => {},
}) {
  return (
    <svg
      className="worldbox-svg-canvas stickerboard-patch-map"
      viewBox="0 0 640 480"
      width="100%"
      height="100%"
      role="img"
      aria-label="Approach 4: Pixel Stickerboard Patch Map of Elmina Seksyen U16"
      style={{ background: '#E5E0CD', border: '4px solid #6C1A21' }}
    >
      <defs>
        {/* Die-cut Sticker Drop Shadow */}
        <filter id="sticker-shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="2" dy="4" stdDeviation="0" floodColor="#6C1A21" floodOpacity="0.35" />
        </filter>

        {/* Selected Sticker Glow */}
        <filter id="sticker-selected-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="2" floodColor="#CEA257" floodOpacity="0.8" />
        </filter>

        {/* Tactile Canvas Texture */}
        <pattern id="sticker-patch-canvas" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#E5E0CD" />
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D1BF9A" strokeWidth="1" strokeDasharray="3,3" />
        </pattern>
      </defs>

      {/* 1. Tactile Quilted Canvas Ground */}
      <rect width="640" height="480" fill="url(#sticker-patch-canvas)" />

      {/* 2. Stitched Park Patch */}
      <g filter="url(#sticker-shadow)">
        <rect x="180" y="270" width="160" height="120" rx="14" fill="#606c38" stroke="#E5E0CD" strokeWidth="3" />
        <path d="M 183 273 L 337 273 L 337 387 L 183 387 Z" fill="none" stroke="#283618" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="260" y="335" fill="#E5E0CD" fontSize="11" fontFamily="Bungee" textAnchor="middle">
          ★ ELMINA PARK ★
        </text>
      </g>

      {/* 3. Stitched Ribbon Roads */}
      {/* Persiaran Elmina (Horizontal Ribbon Road) */}
      <g filter="url(#sticker-shadow)">
        <rect x="-10" y="215" width="660" height="42" rx="4" fill="#6C1A21" stroke="#E5E0CD" strokeWidth="3" />
        <line x1="0" y1="236" x2="640" y2="236" stroke="#CEA257" strokeWidth="3" strokeDasharray="8,6" />
      </g>

      {/* Jalan Frekuensi 1 (Vertical Ribbon Road) */}
      <g filter="url(#sticker-shadow)">
        <rect x="135" y="-10" width="36" height="500" rx="4" fill="#6C1A21" stroke="#E5E0CD" strokeWidth="3" />
        <line x1="153" y1="0" x2="153" y2="480" stroke="#D1BF9A" strokeWidth="2" strokeDasharray="6,6" />
      </g>

      {/* Jalan Frekuensi 2 (Vertical Ribbon Road) */}
      <g filter="url(#sticker-shadow)">
        <rect x="345" y="-10" width="36" height="500" rx="4" fill="#6C1A21" stroke="#E5E0CD" strokeWidth="3" />
        <line x1="363" y1="0" x2="363" y2="480" stroke="#D1BF9A" strokeWidth="2" strokeDasharray="6,6" />
      </g>

      {/* 4. Sticker Labels */}
      <g transform="translate(18, 222)" filter="url(#sticker-shadow)" pointerEvents="none">
        <rect x="0" y="0" width="165" height="26" rx="6" fill="#CEA257" stroke="#E5E0CD" strokeWidth="2.5" />
        <text x="82" y="17" fill="#6C1A21" fontSize="10" fontFamily="Bungee" textAnchor="middle">
          PERSIARAN ELMINA
        </text>
      </g>

      {/* 5. Die-Cut Sticker Amenities & Buildings */}
      {layout.map(obj => {
        const isSelected = obj.objectId === selectedObjectId;
        const isHome = obj.objectId === userHomeObjectId;
        const facility = facilities.find(f => f.id === obj.facilityId);
        const px = obj.x * 20;
        const py = obj.y * 20;
        const pw = Math.max(30, obj.width * 20);
        const ph = Math.max(30, obj.height * 20);

        return (
          <g
            key={obj.objectId}
            id={obj.objectId}
            className={`sticker-badge ${isSelected ? 'is-selected' : ''}`}
            transform={`translate(${px}, ${py}) ${isSelected ? 'scale(1.08)' : ''}`}
            filter={isSelected ? 'url(#sticker-selected-glow)' : 'url(#sticker-shadow)'}
            onClick={() => onSelect(obj)}
            style={{ cursor: 'pointer', transformOrigin: `${pw/2}px ${ph/2}px`, transition: 'transform 0.15s ease' }}
          >
            {/* White / Cream Die-Cut Border (Sticker Edge) */}
            <rect
              x="-3"
              y="-3"
              width={pw + 6}
              height={ph + 6}
              rx="8"
              fill="#E5E0CD"
              stroke="#D1BF9A"
              strokeWidth="2"
            />

            {/* Sticker Core Graphic */}
            {obj.assetKey === 'house' && (
              <g>
                <rect x="0" y="0" width={pw} height={ph} rx="6" fill={isHome ? "#B92C2C" : "#6C1A21"} />
                {/* Roof */}
                <polygon points={`0,12 ${pw/2},0 ${pw},12`} fill={isHome ? "#CEA257" : "#D1BF9A"} />
                {/* Door & Window */}
                <rect x={pw/2 - 4} y={ph - 12} width="8" height="12" rx="2" fill="#E5E0CD" />
              </g>
            )}

            {obj.assetKey === 'hall' && (
              <g>
                <rect x="0" y="0" width={pw} height={ph} rx="6" fill="#6C1A21" />
                <polygon points={`0,14 ${pw/2},0 ${pw},14`} fill="#CEA257" />
                <circle cx={pw/2} cy={ph/2 + 2} r="6" fill="#CEA257" />
                <text x={pw/2} y={ph/2 + 6} fill="#6C1A21" fontSize="9" fontFamily="Bungee" textAnchor="middle">★</text>
              </g>
            )}

            {obj.assetKey === 'park' && (
              <g>
                <rect x="0" y="0" width={pw} height={ph} rx="8" fill="#40633b" />
                <circle cx={pw/2} cy={ph/2} r="12" fill="#63915c" />
                <text x={pw/2} y={ph/2 + 5} fill="#E5E0CD" fontSize="12" fontFamily="Bungee" textAnchor="middle">🌲</text>
              </g>
            )}

            {obj.assetKey === 'recycling' && (
              <g>
                <rect x="0" y="0" width={pw} height={ph} rx="6" fill="#2d6a4f" />
                <text x={pw/2} y={ph/2 + 6} fill="#E5E0CD" fontSize="14" fontFamily="Bungee" textAnchor="middle">♻</text>
              </g>
            )}

            {obj.assetKey === 'lamp' && (
              <g>
                <rect x="0" y="0" width={pw} height={ph} rx="6" fill="#CEA257" />
                <circle cx={pw/2} cy={ph/2} r="6" fill="#E5E0CD" stroke="#6C1A21" strokeWidth="1" />
              </g>
            )}

            {/* Condition Dot */}
            {facility?.state && (
              <circle
                cx={pw - 2}
                cy={2}
                r="4.5"
                fill={facility.state === 'reported' ? '#B92C2C' : facility.state === 'repairing' ? '#CEA257' : '#588157'}
                stroke="#E5E0CD"
                strokeWidth="1.5"
              />
            )}

            {/* "MY HOUSE" Die-cut Sticker Header */}
            {isHome && (
              <g transform={`translate(${pw / 2}, -14)`}>
                <rect x="-38" y="-12" width="76" height="20" rx="6" fill="#CEA257" stroke="#E5E0CD" strokeWidth="2" />
                <text x="0" y="2" fill="#6C1A21" fontSize="9" fontFamily="Bungee" textAnchor="middle">
                  ★ MY HOUSE ★
                </text>
              </g>
            )}

            {/* Sticker Label Banner */}
            {!isHome && obj.label && (
              <g transform={`translate(${pw / 2}, ${ph + 12})`}>
                <rect x="-35" y="-10" width="70" height="16" rx="4" fill="#6C1A21" stroke="#E5E0CD" strokeWidth="1.5" />
                <text x="0" y="2" fill="#E5E0CD" fontSize="7" fontFamily="Bungee" textAnchor="middle">
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
