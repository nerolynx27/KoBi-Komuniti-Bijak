import React, { useState } from 'react';

export function ClassicGridMap({
  layout = [],
  facilities = [],
  selectedObjectId,
  hoveredObjectId,
  userHomeObjectId = 'obj-house-12',
  onSelect = () => {},
  onHover = () => {},
}) {
  const [localHoverId, setLocalHoverId] = useState(null);
  const activeHoverId = hoveredObjectId !== undefined ? hoveredObjectId : localHoverId;

  function handleEnter(obj) {
    setLocalHoverId(obj.objectId);
    onHover(obj);
  }

  function handleLeave() {
    setLocalHoverId(null);
    onHover(null);
  }

  return (
    <svg
      className="worldbox-svg-canvas classic-grid-map"
      viewBox="0 0 640 480"
      width="100%"
      height="100%"
      role="img"
      aria-label="Approach 1: Classic 2D Orthographic Pixel Map of Elmina Seksyen U16"
      style={{ background: '#569443', border: '3px solid #CEA257' }}
    >
      <defs>
        {/* Lively Pixel Meadow Grass Pattern */}
        <pattern id="classic-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#569443" />
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4c873b" strokeWidth="1" />
          {/* Sunlit pixel grass blades */}
          <rect x="3" y="4" width="2" height="2" fill="#6ab054" />
          <rect x="5" y="3" width="2" height="2" fill="#6ab054" />
          <rect x="13" y="11" width="2" height="2" fill="#467d36" />
          <rect x="15" y="10" width="2" height="2" fill="#6ab054" />
          <rect x="8" y="16" width="2" height="2" fill="#467d36" />
        </pattern>

        {/* Residential Lawn Sub-Plot Pattern */}
        <pattern id="classic-yard-lawn" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#609e4c" />
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#538f40" strokeWidth="0.75" />
          <rect x="6" y="6" width="2" height="2" fill="#74ba5e" />
          <rect x="14" y="14" width="2" height="2" fill="#4e873c" />
        </pattern>

        {/* Road Asphalt Pattern */}
        <pattern id="classic-asphalt-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#2e2b2a" />
          <rect x="2" y="4" width="2" height="2" fill="#383433" />
          <rect x="12" y="14" width="2" height="2" fill="#242120" />
        </pattern>

        {/* Lush Botanical Park Lawn Pattern */}
        <pattern id="classic-park-lawn" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#3f8233" />
          <rect x="3" y="3" width="3" height="3" fill="#529c44" />
          <rect x="13" y="12" width="3" height="3" fill="#346e29" />
          <rect x="9" y="6" width="2" height="2" fill="#CEA257" />
        </pattern>
      </defs>

      {/* 1. Lively Green Base Terrain Ground */}
      <rect width="640" height="480" fill="url(#classic-grid-pattern)" />

      {/* 2. Residential Precinct Lawn Plots (Subtle manicured grass zones) */}
      {/* Precinct 1: North-West Frekuensi */}
      <rect x="14" y="14" width="116" height="196" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
      {/* Precinct 2: South-West Frekuensi */}
      <rect x="14" y="272" width="116" height="196" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
      {/* Precinct 3: Central Frekuensi */}
      <rect x="192" y="14" width="156" height="180" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
      {/* Precinct 4: East Elmina */}
      <rect x="412" y="14" width="214" height="190" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />
      <rect x="412" y="328" width="214" height="140" rx="4" fill="url(#classic-yard-lawn)" stroke="#437a34" strokeWidth="1.5" />

      {/* 3. Elmina Central Green Park Ground (x=10..17 -> px=200..340, y=15..21 -> py=300..420) */}
      <rect x="196" y="294" width="148" height="132" rx="8" fill="url(#classic-park-lawn)" stroke="#CEA257" strokeWidth="2.5" />
      {/* Park internal jogging loop path */}
      <rect x="206" y="304" width="128" height="112" rx="6" fill="none" stroke="#D1BF9A" strokeWidth="4" strokeDasharray="6,3" />
      {/* Sparkling Blue Park Lake */}
      <rect x="224" y="336" width="68" height="42" rx="6" fill="#347CA1" stroke="#D1BF9A" strokeWidth="2" />
      <line x1="236" y1="350" x2="254" y2="350" stroke="#7FC3E5" strokeWidth="2" />
      <line x1="258" y1="362" x2="278" y2="362" stroke="#7FC3E5" strokeWidth="2" />
      <text x="258" y="360" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">ELMINA LAKE</text>

      {/* 4. Roads Network (Tile-aligned to ELMINA_ROADS with paved sidewalks) */}
      {/* Sidewalk underlays */}
      <rect x="0" y="216" width="640" height="48" fill="#D1BF9A" />
      <rect x="136" y="0" width="48" height="480" fill="#D1BF9A" />
      <rect x="356" y="0" width="48" height="480" fill="#D1BF9A" />
      <rect x="180" y="97" width="180" height="26" fill="#D1BF9A" />
      <rect x="400" y="297" width="240" height="26" fill="#D1BF9A" />

      {/* Persiaran Elmina (Horizontal Primary Arterial: y=11..13 -> py=220..260) */}
      <rect x="0" y="220" width="640" height="40" fill="url(#classic-asphalt-pattern)" />
      <line x1="0" y1="240" x2="640" y2="240" stroke="#CEA257" strokeWidth="2" strokeDasharray="14,10" />

      {/* Jalan Frekuensi 1 (West Vertical Avenue: x=7..9 -> px=140..180) */}
      <rect x="140" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" />
      <line x1="160" y1="0" x2="160" y2="220" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />
      <line x1="160" y1="260" x2="160" y2="480" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

      {/* Jalan Frekuensi 2 (East Vertical Avenue: x=18..20 -> px=360..400) */}
      <rect x="360" y="0" width="40" height="480" fill="url(#classic-asphalt-pattern)" />
      <line x1="380" y1="0" x2="380" y2="220" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />
      <line x1="380" y1="260" x2="380" y2="480" stroke="#E5E0CD" strokeWidth="1.5" strokeDasharray="8,8" />

      {/* Jalan Frekuensi 3 (North Residential Cross Street: x=9..18, y=5..6 -> px=180..360, py=100..120) */}
      <rect x="180" y="100" width="180" height="20" fill="url(#classic-asphalt-pattern)" />
      <line x1="184" y1="110" x2="356" y2="110" stroke="#E5E0CD" strokeWidth="1" strokeDasharray="6,6" />

      {/* Jalan Frekuensi 4 (East Residential Cross Street: x=20..32, y=15..16 -> px=400..640, py=300..320) */}
      <rect x="400" y="300" width="240" height="20" fill="url(#classic-asphalt-pattern)" />
      <line x1="404" y1="310" x2="636" y2="310" stroke="#E5E0CD" strokeWidth="1" strokeDasharray="6,6" />

      {/* Pedestrian Crosswalks at Intersections */}
      <g fill="#E5E0CD" opacity="0.8">
        {[224, 232, 240, 248].map(cy => (
          <React.Fragment key={`cw-${cy}`}>
            <rect x="132" y={cy} width="6" height="4" />
            <rect x="182" y={cy} width="6" height="4" />
            <rect x="352" y={cy} width="6" height="4" />
            <rect x="402" y={cy} width="6" height="4" />
          </React.Fragment>
        ))}
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

      {/* 6. Lively Pixel Trees & Greenery */}
      {[
        [118, 22], [118, 132], [118, 290], [118, 420],
        [192, 272], [336, 272], [192, 434], [336, 434],
        [342, 140], [406, 80], [606, 90], [606, 175], [560, 340], [595, 340],
      ].map(([tx, ty], i) => (
        <g key={`tree-${i}`} transform={`translate(${tx}, ${ty})`} pointerEvents="none">
          <ellipse cx="8" cy="18" rx="7" ry="3" fill="rgba(26, 48, 20, 0.35)" />
          <rect x="6" y="13" width="4" height="6" fill="#5c3c24" />
          <rect x="0" y="2" width="16" height="13" rx="4" fill="#2e6f28" stroke="#1e4d1a" strokeWidth="1.5" />
          <rect x="3" y="4" width="7" height="5" rx="1" fill="#4da144" />
        </g>
      ))}

      {/* 7. Interactive Layout Objects & Amenities */}
      {layout.map(obj => {
        const isSelected = obj.objectId === selectedObjectId;
        const isHovered = obj.objectId === activeHoverId;
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
            className={`map-object ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''} ${isHome ? 'is-user-home' : ''}`}
            onClick={() => onSelect(obj)}
            onMouseEnter={() => handleEnter(obj)}
            onMouseLeave={handleLeave}
            style={{ cursor: 'pointer' }}
          >
            {/* Hover Highlight Halo */}
            {isHovered && !isSelected && (
              <rect
                x={px - 3}
                y={py - 3}
                width={pw + 6}
                height={ph + 6}
                rx="4"
                fill="rgba(229, 224, 205, 0.2)"
                stroke="#E5E0CD"
                strokeWidth="2"
              />
            )}

            {/* Active Selection Halo */}
            {isSelected && (
              <rect
                x={px - 4}
                y={py - 4}
                width={pw + 8}
                height={ph + 8}
                rx="5"
                fill="rgba(206, 162, 87, 0.2)"
                stroke="#CEA257"
                strokeWidth="3"
                strokeDasharray="4,2"
              />
            )}

            {/* Residential House */}
            {obj.assetKey === 'house' && (
              <g>
                {/* Driveway apron & garden border */}
                <rect
                  x={px - 2}
                  y={py - 2}
                  width={pw + 4}
                  height={ph + 4}
                  rx="3"
                  fill={isHome ? 'rgba(206, 162, 87, 0.35)' : 'rgba(209, 191, 154, 0.25)'}
                  stroke={isHome ? '#CEA257' : '#3d6e2f'}
                  strokeWidth={isHome ? '2' : '1'}
                />
                {/* House Wall Body */}
                <rect
                  x={px}
                  y={py + 4}
                  width={pw}
                  height={ph - 4}
                  rx="2"
                  fill={isHome ? '#B92C2C' : '#9E473B'}
                  stroke="#3b1d19"
                  strokeWidth="1.5"
                />
                {/* Pitched Pixel Roof */}
                <polygon
                  points={`${px - 1},${py + 12} ${px + pw / 2},${py} ${px + pw + 1},${py + 12}`}
                  fill={isHome ? '#CEA257' : '#D1BF9A'}
                  stroke="#3b1d19"
                  strokeWidth="1.5"
                />
                {/* Chimney */}
                <rect x={px + pw - 9} y={py + 1} width="4" height="6" fill="#6C1A21" />
                {/* Front Door & Windows */}
                <rect x={px + pw / 2 - 3} y={py + ph - 9} width="6" height="9" fill="#4a1d17" />
                <rect x={px + 4} y={py + 15} width="7" height="6" rx="1" fill="#E5E0CD" stroke="#6C1A21" strokeWidth="1" />
                <rect x={px + pw - 11} y={py + 15} width="7" height="6" rx="1" fill="#E5E0CD" stroke="#6C1A21" strokeWidth="1" />

                {/* Compact Lot Label inside bottom apron so it NEVER collides with adjacent rows */}
                {!isHome && obj.label && (
                  <g pointerEvents="none">
                    <rect x={px + 3} y={py + ph - 10} width={pw - 6} height="10" rx="2" fill="rgba(108, 26, 33, 0.9)" />
                    <text
                      x={px + pw / 2}
                      y={py + ph - 2.5}
                      fill="#E5E0CD"
                      fontSize="6.5"
                      fontFamily="Bungee"
                      textAnchor="middle"
                    >
                      {obj.label}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Community Hall & Surau */}
            {obj.assetKey === 'hall' && (
              <g>
                <rect x={px} y={py} width={pw} height={ph} rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="2" />
                {/* Forecourt plaza */}
                <rect x={px + 6} y={py + ph - 10} width={pw - 12} height="8" rx="2" fill="#D1BF9A" />
                {/* Columns */}
                <line x1={px + 10} y1={py + 14} x2={px + 10} y2={py + ph - 4} stroke="#E5E0CD" strokeWidth="3" />
                <line x1={px + pw - 10} y1={py + 14} x2={px + pw - 10} y2={py + ph - 4} stroke="#E5E0CD" strokeWidth="3" />
                {/* Roof / Dome */}
                {obj.facilityId === 'surau-elmina' ? (
                  <>
                    <ellipse cx={px + pw / 2} cy={py + 14} rx={pw * 0.35} ry="10" fill="#CEA257" stroke="#6C1A21" strokeWidth="1.5" />
                    <circle cx={px + pw / 2} cy={py + 3} r="2.5" fill="#E5E0CD" />
                  </>
                ) : (
                  <polygon points={`${px},${py + 14} ${px + pw / 2},${py + 2} ${px + pw},${py + 14}`} fill="#CEA257" />
                )}
                <text
                  x={px + pw / 2}
                  y={py - 5}
                  fill="#E5E0CD"
                  fontSize="8.5"
                  fontFamily="Bungee"
                  textAnchor="middle"
                  style={{ textShadow: '1px 1px 0 #1f1612, -1px -1px 0 #1f1612' }}
                >
                  {obj.label}
                </text>
              </g>
            )}

            {/* Central Park Facility Pavilion */}
            {obj.assetKey === 'park' && (
              <g>
                <rect
                  x={px}
                  y={py}
                  width={pw}
                  height={ph}
                  rx="6"
                  fill="rgba(63, 130, 51, 0.15)"
                  stroke="#6ab054"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                {/* Park Gazebo / Pavilion */}
                <rect x={px + pw - 42} y={py + 14} width="28" height="24" rx="4" fill="#6C1A21" stroke="#CEA257" strokeWidth="2" />
                <polygon
                  points={`${px + pw - 44},${py + 20} ${px + pw - 28},${py + 10} ${px + pw - 12},${py + 20}`}
                  fill="#CEA257"
                />
                <text
                  x={px + pw / 2}
                  y={py - 6}
                  fill="#E5E0CD"
                  fontSize="9"
                  fontFamily="Bungee"
                  textAnchor="middle"
                  style={{ textShadow: '1px 1px 0 #1b3814, -1px -1px 0 #1b3814' }}
                >
                  {obj.label}
                </text>
              </g>
            )}

            {/* Recycling Point */}
            {obj.assetKey === 'recycling' && (
              <g>
                <rect x={px} y={py} width={pw} height={ph} rx="4" fill="#2d6a4f" stroke="#CEA257" strokeWidth="2" />
                <circle cx={px + pw / 2} cy={py + ph / 2} r="11" fill="#95d5b2" />
                <text x={px + pw / 2} y={py + ph / 2 + 4} fill="#1b4332" fontSize="11" fontFamily="Bungee" textAnchor="middle">
                  ♻
                </text>
                <text
                  x={px + pw / 2}
                  y={py - 5}
                  fill="#E5E0CD"
                  fontSize="7.5"
                  fontFamily="Bungee"
                  textAnchor="middle"
                  style={{ textShadow: '1px 1px 0 #000' }}
                >
                  {obj.label}
                </text>
              </g>
            )}

            {/* Roadside Streetlight (Anchored on Sidewalk Verge, Never in Middle of Road) */}
            {obj.assetKey === 'lamp' && (
              <g>
                {/* Warm illumination halo */}
                <circle cx={px + 10} cy={py + 10} r="15" fill="rgba(206, 162, 87, 0.28)" />
                {/* Verge concrete pad */}
                <rect x={px + 6} y={py + 14} width="8" height="4" rx="1" fill="#D1BF9A" stroke="#6C1A21" strokeWidth="1" />
                {/* Vertical lamppost mast */}
                <line x1={px + 10} y1={py + 5} x2={px + 10} y2={py + 15} stroke="#6C1A21" strokeWidth="2.5" />
                {/* Luminaire lantern head */}
                <circle cx={px + 10} cy={py + 5} r="4.5" fill="#CEA257" stroke="#6C1A21" strokeWidth="1.5" />
                <text
                  x={px + 10}
                  y={py - 3}
                  fill="#E5E0CD"
                  fontSize="6.5"
                  fontFamily="Bungee"
                  textAnchor="middle"
                  style={{ textShadow: '1px 1px 0 #1f1612' }}
                >
                  {obj.label}
                </text>
              </g>
            )}

            {/* Condition Dot */}
            {facility?.state && (
              <circle
                cx={px + pw - 3}
                cy={py + 3}
                r="4"
                fill={
                  facility.state === 'reported'
                    ? '#B92C2C'
                    : facility.state === 'repairing'
                      ? '#CEA257'
                      : '#52b788'
                }
                stroke="#E5E0CD"
                strokeWidth="1.2"
              />
            )}

            {/* "★ MY HOUSE" Pinpoint Banner in dedicated courtyard clearance above Lot 12 */}
            {isHome && (
              <g transform={`translate(${px + pw / 2}, ${py - 6})`} pointerEvents="none">
                <rect x="-38" y="-20" width="76" height="17" rx="4" fill="#B92C2C" stroke="#CEA257" strokeWidth="2" />
                <polygon points="-5,-3 5,-3 0,4" fill="#CEA257" />
                <text x="0" y="-8" fill="#E5E0CD" fontSize="8" fontFamily="Bungee" textAnchor="middle">
                  ★ MY HOUSE
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
