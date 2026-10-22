export function buildSteppedRect(x, y, w, h, step = 4) {
  return [
    `M ${x + step},${y}`,
    `H ${x + w - step}`,
    `V ${y + step}`,
    `H ${x + w}`,
    `V ${y + h - step}`,
    `H ${x + w - step}`,
    `V ${y + h}`,
    `H ${x + step}`,
    `V ${y + h - step}`,
    `H ${x}`,
    `V ${y + step}`,
    `H ${x + step}`,
    'Z',
  ].join(' ');
}

export const ARTWORK_IMAGE_MAP = {
  'garden-harvest': '/assets/activities/poster-garden-20261022.webp',
  'ewaste-bins': '/assets/activities/poster-ewaste-20261022.webp',
  'upcycling-craft': '/assets/activities/poster-craft-20261022.webp',
  'tai-chi': '/assets/activities/poster-taichi-20261022.webp',
  'cleanup-event': '/assets/activities/gallery-cleanup.png',
  'harvest-day': '/assets/activities/gallery-harvest.png',
  'recycling-drive': '/assets/activities/gallery-recycling.png',
  'tree-planting': '/assets/activities/gallery-planting.png',
};

export function ActivityMiniPosterSvg({
  artworkKey = 'garden-harvest',
  title = 'Activity illustration',
  large = false,
}) {
  const src =
    ARTWORK_IMAGE_MAP[artworkKey] || '/assets/activities/gallery-cleanup.png';

  return (
    <div
      className={`act-illustration-frame ${large ? 'is-large' : 'is-mini'}`}
      role="img"
      aria-label={`${title} pixel illustration`}
    >
      <img
        src={src}
        alt={title}
        className="act-illustration-img"
        loading="eager"
        draggable={false}
      />
    </div>
  );
}
