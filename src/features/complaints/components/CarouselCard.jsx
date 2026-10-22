import { useEffect, useRef, useState } from 'react';
import { PaperTexture } from '../../../components/ui/PaperTexture.jsx';
import { observeSize } from '../../../components/ui/PixelFrame.jsx';

function buildSteppedRect(w, h, inset = 0, threeStep = true) {
  const i = inset;
  if (threeStep) {
    const c1 = Math.max(2, 8 - i);
    const c2 = Math.max(2, 4 - Math.floor(i / 2));
    const c3 = 2;
    return [
      `M${i + c1},${i}`,
      `H${w - i - c1}`,
      `V${i + 2}`,
      `H${w - i - c2}`,
      `V${i + 4}`,
      `H${w - i - c3}`,
      `V${i + c1}`,
      `H${w - i}`,
      `V${h - i - c1}`,
      `H${w - i - c3}`,
      `V${h - i - 4}`,
      `H${w - i - c2}`,
      `V${h - i - 2}`,
      `H${w - i - c1}`,
      `V${h - i}`,
      `H${i + c1}`,
      `V${h - i - 2}`,
      `H${i + c2}`,
      `V${h - i - 4}`,
      `H${i + c3}`,
      `V${h - i - c1}`,
      `H${i}`,
      `V${i + c1}`,
      `H${i + c3}`,
      `V${i + 4}`,
      `H${i + c2}`,
      `V${i + 2}`,
      `H${i + c1}`,
      'Z',
    ].join(' ');
  }
  return [
    `M${i + 4},${i}`,
    `H${w - i - 4}`,
    `V${i + 2}`,
    `H${w - i - 2}`,
    `V${i + 4}`,
    `H${w - i}`,
    `V${h - i - 4}`,
    `H${w - i - 2}`,
    `V${h - i - 2}`,
    `H${w - i - 4}`,
    `V${h - i}`,
    `H${i + 4}`,
    `V${h - i - 2}`,
    `H${i + 2}`,
    `V${h - i - 4}`,
    `H${i}`,
    `V${i + 4}`,
    `H${i + 2}`,
    `V${i + 2}`,
    `H${i + 4}`,
    'Z',
  ].join(' ');
}

export function TemporaryFacilityArtwork({ artworkKey, title }) {
  const key = (artworkKey || '').toLowerCase();

  return (
    <svg
      className="sandbox-facility-art"
      viewBox="0 0 96 96"
      role="img"
      aria-label={title || `Pixel illustration for ${artworkKey || 'facility'}`}
      shapeRendering="crispEdges"
    >
      {key === 'playground' && (
        <g>
          {/* L-shaped sandbox border (outer wine, gold/sand timber rim, sand interior) */}
          <path
            d="M12 20h72v60H42V60H12V20z"
            fill="var(--color-wine)"
          />
          <path
            d="M14 22h68v52H44V54H14V22z"
            fill="var(--color-gold)"
          />
          <path
            d="M14 52h32v4H14v-4zm30 18h38v6H44v-6z"
            fill="var(--color-sand)"
          />
          <path
            d="M16 24h64v46H46V50H16V24z"
            fill="var(--color-wine)"
          />
          <path
            d="M18 26h60v42H48V48H18V26z"
            fill="var(--color-sand)"
          />
          {/* Sand pixel pebbles */}
          <rect x="24" y="42" width="4" height="2" fill="var(--color-gold)" />
          <rect x="64" y="34" width="6" height="2" fill="var(--color-gold)" />
          <rect x="54" y="60" width="6" height="2" fill="var(--color-gold)" />

          {/* Swing set on upper-left */}
          <rect x="22" y="12" width="28" height="4" fill="var(--color-wine)" />
          <rect x="24" y="13" width="24" height="2" fill="var(--color-gold)" />
          <rect x="22" y="12" width="4" height="28" fill="var(--color-wine)" />
          <rect x="23" y="14" width="2" height="24" fill="var(--color-gold)" />
          <rect x="34" y="12" width="3" height="26" fill="var(--color-wine)" />
          <rect x="46" y="12" width="4" height="28" fill="var(--color-wine)" />
          <rect x="47" y="14" width="2" height="24" fill="var(--color-gold)" />
          {/* Swing chains & seats */}
          <rect x="27" y="16" width="1" height="14" fill="var(--color-wine)" />
          <rect x="31" y="16" width="1" height="14" fill="var(--color-wine)" />
          <rect x="26" y="30" width="7" height="3" fill="var(--color-cherry)" />
          <rect x="39" y="16" width="1" height="14" fill="var(--color-wine)" />
          <rect x="43" y="16" width="1" height="14" fill="var(--color-wine)" />
          <rect x="38" y="30" width="7" height="3" fill="var(--color-cherry)" />

          {/* Slide on lower-right */}
          <rect x="66" y="30" width="8" height="26" fill="var(--color-wine)" />
          <rect x="68" y="34" width="4" height="2" fill="var(--color-gold)" />
          <rect x="68" y="40" width="4" height="2" fill="var(--color-gold)" />
          <rect x="68" y="46" width="4" height="2" fill="var(--color-gold)" />
          {/* Stepped diagonal slide chute */}
          <path
            d="M64 30h8v6h-4v4h-4v4h-4v4h-4v4h-4v4h-8v-6h4v-4h4v-4h4v-4h4v-4h4v-4z"
            fill="var(--color-wine)"
          />
          <path
            d="M66 32h4v4h-4v4h-4v4h-4v4h-4v4h-4v2h-4v-4h4v-4h4v-4h4v-4h4v-4h4v-2z"
            fill="var(--color-cherry)"
          />
          <path
            d="M64 32h2v2h-2v4h-4v4h-4v4h-4v4h-4v2h-2v-2h4v-4h4v-4h4v-4h4v-4h2v-2z"
            fill="var(--color-gold)"
          />
        </g>
      )}

      {key === 'hall' && (
        <g>
          {/* Pitched roof in cherry & wine */}
          <path
            d="M20 18h56v4h6v4h6v6H8v-6h6v-4h6v-4z"
            fill="var(--color-wine)"
          />
          <path
            d="M22 20h52v4h6v4H16v-4h6v-4z"
            fill="var(--color-cherry)"
          />
          {/* Hall body */}
          <rect x="14" y="32" width="68" height="44" fill="var(--color-wine)" />
          <rect x="16" y="34" width="64" height="40" fill="var(--color-gold)" />
          {/* Signboard: COMMUNITY HALL */}
          <rect x="20" y="38" width="56" height="10" fill="var(--color-wine)" />
          <rect x="22" y="40" width="52" height="6" fill="var(--color-vanilla)" />
          <rect x="26" y="42" width="18" height="2" fill="var(--color-wine)" />
          <rect x="48" y="42" width="22" height="2" fill="var(--color-cherry)" />
          {/* Windows & entrance doors */}
          <rect x="22" y="52" width="14" height="14" fill="var(--color-wine)" />
          <rect x="24" y="54" width="10" height="10" fill="var(--color-vanilla)" />
          <rect x="40" y="52" width="16" height="22" fill="var(--color-wine)" />
          <rect x="42" y="54" width="5" height="18" fill="var(--color-cherry)" />
          <rect x="49" y="54" width="5" height="18" fill="var(--color-cherry)" />
          <rect x="60" y="52" width="14" height="14" fill="var(--color-wine)" />
          <rect x="62" y="54" width="10" height="10" fill="var(--color-vanilla)" />
          {/* Stepped foundation base */}
          <rect x="10" y="74" width="76" height="6" fill="var(--color-wine)" />
          <rect x="12" y="76" width="72" height="2" fill="var(--color-sand)" />
        </g>
      )}

      {key === 'recycling' && (
        <g>
          {/* Shelter header banner */}
          <rect x="12" y="20" width="72" height="14" fill="var(--color-wine)" />
          <rect x="14" y="22" width="68" height="10" fill="var(--color-gold)" />
          <rect x="20" y="25" width="56" height="4" fill="var(--color-wine)" />
          {/* Shelter posts and back wall */}
          <rect x="14" y="34" width="68" height="40" fill="var(--color-wine)" />
          <rect x="18" y="36" width="60" height="36" fill="var(--color-sand)" />
          {/* Three sorting bins */}
          {/* Bin 1 */}
          <rect x="22" y="44" width="14" height="26" fill="var(--color-wine)" />
          <rect x="24" y="46" width="10" height="4" fill="var(--color-vanilla)" />
          <rect x="24" y="52" width="10" height="16" fill="var(--color-cherry)" />
          <rect x="27" y="57" width="4" height="4" fill="var(--color-vanilla)" />
          {/* Bin 2 */}
          <rect x="41" y="44" width="14" height="26" fill="var(--color-wine)" />
          <rect x="43" y="46" width="10" height="4" fill="var(--color-vanilla)" />
          <rect x="43" y="52" width="10" height="16" fill="var(--color-gold)" />
          <rect x="46" y="57" width="4" height="4" fill="var(--color-wine)" />
          {/* Bin 3 */}
          <rect x="60" y="44" width="14" height="26" fill="var(--color-wine)" />
          <rect x="62" y="46" width="10" height="4" fill="var(--color-vanilla)" />
          <rect x="62" y="52" width="10" height="16" fill="var(--color-vanilla)" />
          <rect x="65" y="57" width="4" height="4" fill="var(--color-cherry)" />
          {/* Base */}
          <rect x="10" y="72" width="76" height="6" fill="var(--color-wine)" />
          <rect x="12" y="74" width="72" height="2" fill="var(--color-gold)" />
        </g>
      )}

      {(key === 'park' || key === 'garden') && (
        <g>
          {/* Two raised planter beds */}
          <rect x="14" y="22" width="68" height="22" fill="var(--color-wine)" />
          <rect x="16" y="24" width="64" height="18" fill="var(--color-gold)" />
          <rect x="20" y="28" width="56" height="10" fill="var(--color-wine)" />
          {/* Pixel sprouts & flowers in top bed */}
          <rect x="24" y="16" width="8" height="12" fill="var(--color-cherry)" />
          <rect x="26" y="14" width="4" height="4" fill="var(--color-gold)" />
          <rect x="44" y="14" width="8" height="14" fill="var(--color-wine)" />
          <rect x="46" y="16" width="4" height="6" fill="var(--color-gold)" />
          <rect x="64" y="16" width="8" height="12" fill="var(--color-cherry)" />

          {/* Stepping stone path */}
          <rect x="22" y="48" width="12" height="6" fill="var(--color-sand)" />
          <rect x="42" y="48" width="12" height="6" fill="var(--color-sand)" />
          <rect x="62" y="48" width="12" height="6" fill="var(--color-sand)" />

          {/* Bottom planter bed */}
          <rect x="14" y="58" width="68" height="20" fill="var(--color-wine)" />
          <rect x="16" y="60" width="64" height="16" fill="var(--color-gold)" />
          <rect x="20" y="64" width="56" height="8" fill="var(--color-sand)" />
          <rect x="28" y="54" width="8" height="10" fill="var(--color-wine)" />
          <rect x="48" y="54" width="8" height="10" fill="var(--color-cherry)" />
          <rect x="62" y="54" width="8" height="10" fill="var(--color-wine)" />
        </g>
      )}

      {key === 'lamp' && (
        <g>
          {/* Twin street lamp */}
          <rect x="44" y="16" width="8" height="54" fill="var(--color-wine)" />
          <rect x="46" y="18" width="4" height="50" fill="var(--color-gold)" />
          {/* Crossbar */}
          <rect x="24" y="22" width="48" height="4" fill="var(--color-wine)" />
          {/* Left lantern */}
          <rect x="24" y="26" width="12" height="14" fill="var(--color-wine)" />
          <rect x="26" y="28" width="8" height="10" fill="var(--color-gold)" />
          <rect x="28" y="30" width="4" height="6" fill="var(--color-vanilla)" />
          {/* Right lantern */}
          <rect x="60" y="26" width="12" height="14" fill="var(--color-wine)" />
          <rect x="62" y="28" width="8" height="10" fill="var(--color-gold)" />
          <rect x="64" y="30" width="4" height="6" fill="var(--color-vanilla)" />
          {/* Walkway pavers */}
          <rect x="12" y="70" width="72" height="10" fill="var(--color-wine)" />
          <rect x="14" y="72" width="20" height="6" fill="var(--color-sand)" />
          <rect x="38" y="72" width="20" height="6" fill="var(--color-gold)" />
          <rect x="62" y="72" width="20" height="6" fill="var(--color-sand)" />
        </g>
      )}

      {key === 'bench' && (
        <g>
          {/* Garden Bench Pixel Illustration */}
          {/* Backrest horizontal wooden slats */}
          <rect x="18" y="22" width="60" height="6" fill="var(--color-wine)" />
          <rect x="20" y="24" width="56" height="3" fill="var(--color-gold)" />
          <rect x="18" y="31" width="60" height="6" fill="var(--color-wine)" />
          <rect x="20" y="33" width="56" height="3" fill="var(--color-gold)" />
          <rect x="18" y="40" width="60" height="6" fill="var(--color-wine)" />
          <rect x="20" y="42" width="56" height="3" fill="var(--color-gold)" />

          {/* Cast iron back vertical supports & armrests */}
          <rect x="22" y="20" width="6" height="30" fill="var(--color-wine)" />
          <rect x="68" y="20" width="6" height="30" fill="var(--color-wine)" />
          <rect x="16" y="44" width="12" height="6" fill="var(--color-wine)" />
          <rect x="18" y="46" width="8" height="2" fill="var(--color-sand)" />
          <rect x="68" y="44" width="12" height="6" fill="var(--color-wine)" />
          <rect x="70" y="46" width="8" height="2" fill="var(--color-sand)" />

          {/* Seat wooden bench planks */}
          <rect x="14" y="50" width="68" height="10" fill="var(--color-wine)" />
          <rect x="16" y="52" width="64" height="6" fill="var(--color-gold)" />
          <rect x="16" y="55" width="64" height="1" fill="var(--color-cherry)" />

          {/* Bench legs and cast iron frame base */}
          <rect x="20" y="60" width="6" height="16" fill="var(--color-wine)" />
          <rect x="22" y="62" width="2" height="12" fill="var(--color-gold)" />
          <rect x="70" y="60" width="6" height="16" fill="var(--color-wine)" />
          <rect x="72" y="62" width="2" height="12" fill="var(--color-gold)" />
          <rect x="20" y="68" width="56" height="4" fill="var(--color-wine)" />

          {/* Paved path underneath bench */}
          <rect x="10" y="76" width="76" height="6" fill="var(--color-wine)" />
          <rect x="12" y="78" width="22" height="2" fill="var(--color-sand)" />
          <rect x="37" y="78" width="22" height="2" fill="var(--color-gold)" />
          <rect x="62" y="78" width="22" height="2" fill="var(--color-sand)" />
        </g>
      )}

      {key !== 'playground' && key !== 'hall' && key !== 'recycling' && key !== 'park' && key !== 'garden' && key !== 'lamp' && key !== 'bench' && (
        <g>
          {/* Generic Township Facility Kiosk / Pavilion Fallback */}
          {/* Stepped roof canopy */}
          <path
            d="M16 20h64v4h4v4h4v6H8v-6h4v-4h4v-4z"
            fill="var(--color-wine)"
          />
          <path
            d="M18 22h60v4h4v4H14v-4h4v-4z"
            fill="var(--color-cherry)"
          />
          <rect x="22" y="24" width="52" height="2" fill="var(--color-gold)" />

          {/* Kiosk Structure Body */}
          <rect x="14" y="34" width="68" height="40" fill="var(--color-wine)" />
          <rect x="18" y="36" width="60" height="36" fill="var(--color-sand)" />

          {/* Inner Bulletin / Community Board */}
          <rect x="24" y="40" width="48" height="26" fill="var(--color-wine)" />
          <rect x="26" y="42" width="44" height="22" fill="var(--color-vanilla)" />
          {/* Mini stickers/cards on board */}
          <rect x="30" y="46" width="10" height="14" fill="var(--color-gold)" />
          <rect x="32" y="48" width="6" height="2" fill="var(--color-wine)" />
          <rect x="32" y="52" width="6" height="2" fill="var(--color-wine)" />
          <rect x="44" y="46" width="12" height="10" fill="var(--color-cherry)" />
          <rect x="46" y="48" width="8" height="2" fill="var(--color-vanilla)" />
          <rect x="60" y="50" width="8" height="10" fill="var(--color-wine)" />

          {/* Foundation */}
          <rect x="10" y="74" width="76" height="6" fill="var(--color-wine)" />
          <rect x="12" y="76" width="72" height="2" fill="var(--color-gold)" />
        </g>
      )}
    </svg>
  );
}

function CarouselArrowButton({ direction, label, onClick }) {
  const isPrev = direction === 'prev';
  const frameOuter = buildSteppedRect(38, 38, 0, false);
  const frameRim = buildSteppedRect(38, 38, 2, false);
  const frameFill = buildSteppedRect(38, 38, 4, false);

  return (
    <button
      type="button"
      className={`sandbox-carousel-arrow sandbox-carousel-arrow-${direction}`}
      aria-label={label}
      onClick={onClick}
    >
      <svg
        className="sandbox-carousel-arrow-svg"
        width="42"
        height="42"
        viewBox="0 0 42 42"
        aria-hidden="true"
        focusable="false"
        shapeRendering="crispEdges"
      >
        <path className="carousel-arrow-shadow" d={frameOuter} transform="translate(3 3)" />
        <g className="carousel-arrow-face">
          <path className="carousel-arrow-ink" d={frameOuter} />
          <path className="carousel-arrow-rim" d={frameRim} />
          <path className="carousel-arrow-fill" d={frameFill} />
          <PaperTexture facePath={frameFill} role="control" />
          {isPrev ? (
            <path
              className="carousel-arrow-glyph"
              d="M21 11h3v3h-3v3h-3v4h3v3h3v3h-3v-3h-3v-3h-3v-4h3v-3h3v-3z"
            />
          ) : (
            <path
              className="carousel-arrow-glyph"
              d="M15 11h3v3h3v3h3v4h-3v3h-3v3h-3v-3h3v-3h3v-4h-3v-3h-3v-3z"
            />
          )}
        </g>
      </svg>
    </button>
  );
}

export function CarouselFrameBox({ selected = true, children, className = '', onClick, ariaLabel }) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: selected ? 148 : 92, height: selected ? 148 : 104 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    return observeSize(el, rect => {
      const width = Math.max(64, Math.round(rect.width));
      const height = Math.max(64, Math.round(rect.height));
      setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }));
    });
  }, []);

  const { width: w, height: h } = size;
  const OuterTag = onClick ? 'button' : 'div';

  const outerPath = buildSteppedRect(w, h, 0, selected);
  const goldBandPath = buildSteppedRect(w, h, 2, selected);
  const innerWinePath = buildSteppedRect(w, h, 8, false);
  const innerCanvasPath = buildSteppedRect(w, h, 10, false);
  const neighbourFillPath = buildSteppedRect(w, h, 2, false);

  return (
    <OuterTag
      ref={ref}
      type={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`sandbox-carousel-box ${selected ? 'is-selected' : 'is-neighbour'} ${className}`}
    >
      <svg
        className="sandbox-carousel-frame-svg"
        width={w + 4}
        height={h + 4}
        viewBox={`0 0 ${w + 4} ${h + 4}`}
        aria-hidden="true"
        focusable="false"
        shapeRendering="crispEdges"
      >
        {selected ? (
          <>
            <path className="carousel-frame-shadow" d={outerPath} transform="translate(4 4)" />
            <path className="carousel-frame-ink" d={outerPath} />
            <path className="carousel-frame-gold" d={goldBandPath} />
            <path className="carousel-frame-ink" d={innerWinePath} />
            <path className="carousel-frame-canvas" d={innerCanvasPath} />
          <PaperTexture facePath={innerCanvasPath} role="panel" />
          </>
        ) : (
          <>
            <path className="carousel-neighbour-rim" d={outerPath} />
            <path className="carousel-neighbour-fill" d={neighbourFillPath} />
          <PaperTexture facePath={neighbourFillPath} role="panel" />
          </>
        )}
      </svg>
      <div className="sandbox-carousel-artwork-slot">
        {children}
      </div>
    </OuterTag>
  );
}

export function CarouselCard({
  facilities = [],
  selectedId,
  onSelectFacility,
  showArtworkNotice = false,
}) {
  const count = facilities.length;
  if (count === 0) return null;

  const currentIndex = Math.max(0, facilities.findIndex(item => item.id === selectedId));
  const current = facilities[currentIndex] || facilities[0];
  const prevFacility = facilities[(currentIndex - 1 + count) % count];
  const nextFacility = facilities[(currentIndex + 1) % count];

  const currentArtworkKey = current.artworkKey || current.type || 'township';
  const prevArtworkKey = prevFacility.artworkKey || prevFacility.type || 'township';
  const nextArtworkKey = nextFacility.artworkKey || nextFacility.type || 'township';

  return (
    <section className="sandbox-carousel" aria-label="Neighbourhood places">
      <div className="sandbox-carousel-stage">
        {/* Left smaller neighbour preview */}
        <CarouselFrameBox
          selected={false}
          className="sandbox-carousel-neighbour-left"
          ariaLabel={`Select previous facility: ${prevFacility.name}`}
          onClick={() => onSelectFacility?.(prevFacility.id)}
        >
          <TemporaryFacilityArtwork
            artworkKey={prevArtworkKey}
            title={prevFacility.name}
          />
        </CarouselFrameBox>

        {/* Previous facility arrow control */}
        <CarouselArrowButton
          direction="prev"
          label={`Previous facility (${prevFacility.name})`}
          onClick={() => onSelectFacility?.(prevFacility.id)}
        />

        {/* Prominent selected facility card */}
        <CarouselFrameBox selected className="sandbox-carousel-center">
          <TemporaryFacilityArtwork
            artworkKey={currentArtworkKey}
            title={current.name}
          />
        </CarouselFrameBox>

        {/* Next facility arrow control */}
        <CarouselArrowButton
          direction="next"
          label={`Next facility (${nextFacility.name})`}
          onClick={() => onSelectFacility?.(nextFacility.id)}
        />

        {/* Right smaller neighbour preview */}
        <CarouselFrameBox
          selected={false}
          className="sandbox-carousel-neighbour-right"
          ariaLabel={`Select next facility: ${nextFacility.name}`}
          onClick={() => onSelectFacility?.(nextFacility.id)}
        >
          <TemporaryFacilityArtwork
            artworkKey={nextArtworkKey}
            title={nextFacility.name}
          />
        </CarouselFrameBox>
      </div>

      {/* Selected facility live name — no Block X labels */}
      <div className="sandbox-carousel-caption" aria-live="polite">
        <h2 className="sandbox-carousel-name">{current.name}</h2>
      </div>

      {showArtworkNotice && (
        <p className="sandbox-artwork-gap-note">
          <strong>Temporary facility illustration:</strong> Inspected <code>public/assets/</code> and <code>art/</code>; world facility PNG sprites are not yet in the repository, so this separate artwork slot renders clearly labelled temporary pixel-art SVG illustrations.
        </p>
      )}
    </section>
  );
}
