import { Icon } from '../../components/ui/Icon.jsx';
import { componentCatalog } from './componentCatalog.js';
export function ComponentCatalog({ onSelect }) {
  return <div className="section-stack"><p>Choose one of seven available components. Footprints are provisional simulation sizes.</p><div className="catalog-grid">{componentCatalog.map(item => <button className="catalog-card" key={item.assetKey} type="button" onClick={() => onSelect(item)}><span className="catalog-art"><Icon name={item.icon} /></span><strong>{item.label}</strong><span>{item.width} × {item.height} tiles</span><span className="helper">Artwork pending</span></button>)}</div><p className="helper">Use the live schematic to preview placement. Final pixel artwork and access routes are deferred.</p></div>;
}
