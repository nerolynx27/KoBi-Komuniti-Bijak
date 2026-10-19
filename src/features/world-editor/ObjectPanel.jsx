import { Button } from '../../components/ui/Button.jsx';
import { getRemovalBlockers } from './layoutValidation.js';
import { componentCatalog } from './componentCatalog.js';
export function ObjectPanel({ object, data, onMove, onRemove, onClose, disabled }) {
  const catalog = componentCatalog.find(row => row.assetKey === object.assetKey);
  const blockers = getRemovalBlockers(data, object.objectId);
  return <section className="card section-stack"><div><span className="eyebrow">Selected component</span><h2>{catalog.label}</h2><p className="helper">{object.objectId}</p></div><p>Tile {object.x}, {object.y} · {object.width} × {object.height} footprint</p>{blockers.length > 0 && <div className="part-notice"><strong>Removal blocked</strong>{blockers.map(reason => <p key={reason}>{reason}</p>)}</div>}<div className="form-actions"><Button icon="move" onClick={onMove} disabled={disabled}>Move</Button><Button variant="danger" icon="trash" onClick={onRemove} disabled={disabled || blockers.length > 0}>Remove</Button><Button variant="quiet" onClick={onClose} disabled={disabled}>Close selection</Button></div></section>;
}
