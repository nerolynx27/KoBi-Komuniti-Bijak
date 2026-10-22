import { approvedArtwork, approvedPlacements, approvedScenery } from './approvedMap.generated.js';
import { selectPublicObject } from './worldSelectors.js';

const baseline = new Map(approvedPlacements.map(object => [object.objectId, object]));
const symbols = { house: 'sym-terrace', hall: 'sym-dewan', park: 'sym-playground', lamp: 'sym-streetlight' };

function AddedArtwork({ object }) {
  const x = object.x * 20, y = object.y * 20, width = object.width * 20, height = object.height * 20;
  if (symbols[object.assetKey]) return <use href={`#${symbols[object.assetKey]}`} x={x} y={y} width={width} height={height} />;
  if (object.assetKey === 'tree') return <><rect x={x + width * 0.4} y={y + height * 0.5} width={width * 0.2} height={height * 0.5} fill="#6C1A21" /><rect x={x} y={y} width={width} height={height * 0.7} rx="4" fill="#569443" stroke="#6C1A21" /></>;
  return <><rect x={x} y={y} width={width} height={height} rx="2" fill="#D1BF9A" stroke="#6C1A21" /><text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="#6C1A21" fontSize="10" fontFamily="Bungee">{object.assetKey === 'recycling' ? '♻' : '═'}</text></>;
}

export function ApprovedMap({ data, selected, hovered, onSelect, onHover, controls, ghost }) {
  const objects = [...data.layout].sort((a, b) => (approvedArtwork[a.objectId]?.order ?? Infinity) - (approvedArtwork[b.objectId]?.order ?? Infinity));
  return <svg className="schematic approved-map" data-map-id={data.township.map_id} viewBox="0 0 640 480" width="100%" height="100%" role="group" aria-label="Interactive Elmina neighbourhood map">
    <g aria-hidden="true" pointerEvents="none" dangerouslySetInnerHTML={{ __html: approvedScenery }} />
    <g aria-hidden="true" pointerEvents="none" clipPath="url(#road-light-clip)">
      {data.layout.map(object => {
        const original = baseline.get(object.objectId), art = approvedArtwork[object.objectId];
        if (!original || !art?.light || original.assetKey !== object.assetKey) return null;
        return <g key={object.objectId} transform={`translate(${(object.x - original.x) * 20}, ${(object.y - original.y) * 20})`} dangerouslySetInnerHTML={{ __html: art.light }} />;
      })}
    </g>
    {objects.map(object => {
      const original = baseline.get(object.objectId);
      const art = original?.assetKey === object.assetKey ? approvedArtwork[object.objectId] : null;
      const dx = art ? (object.x - original.x) * 20 : 0, dy = art ? (object.y - original.y) * 20 : 0;
      const [x, y, width, height] = art?.hit || [object.x * 20, object.y * 20, object.width * 20, object.height * 20];
      const item = selectPublicObject(data, object.objectId);
      return <g
        key={object.objectId}
        id={object.objectId}
        ref={element => { controls.current[object.objectId] = element; }}
        className={`schematic-object ${selected === object.objectId ? 'is-selected' : ''} ${hovered === object.objectId ? 'is-hovered' : ''}`}
        transform={`translate(${dx}, ${dy})`}
        role="button"
        tabIndex={0}
        aria-label={item.name}
        aria-pressed={selected === object.objectId}
        onClick={() => onSelect(object)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(object); }
        }}
        onFocus={() => onHover(object.objectId)}
        onBlur={() => onHover(null)}
        onMouseEnter={() => onHover(object.objectId)}
        onMouseLeave={() => onHover(null)}
      >
        <rect className="approved-map-hit" x={x} y={y} width={width} height={height} rx="2" />
        {art ? <g aria-hidden="true" pointerEvents="none" dangerouslySetInnerHTML={{ __html: art.markup }} /> : <g aria-hidden="true" pointerEvents="none"><AddedArtwork object={object} /></g>}
      </g>;
    })}
    {ghost && <g className={`schematic-ghost ${ghost.valid ? 'is-valid' : 'is-invalid'}`} pointerEvents="none">
      <rect x={ghost.x * 20} y={ghost.y * 20} width={ghost.width * 20} height={ghost.height * 20} />
      <text x={(ghost.x + ghost.width / 2) * 20} y={ghost.y * 20 - 6} textAnchor="middle">Preview</text>
    </g>}
  </svg>;
}
