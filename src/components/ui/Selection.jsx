import { useId, useRef } from 'react';
import { PixelFrame } from './PixelFrame.jsx';
import { Icon } from './Icon.jsx';

export function FilterChip({ selected = false, children, ...props }) {
  const ref = useRef(null);
  return <button {...props} ref={ref} type="button" className={`filter-chip framed ${selected ? 'is-selected' : ''}`} aria-pressed={selected}><PixelFrame targetRef={ref} shape="folded-tab" /><span className="control-content">{children}</span></button>;
}

export function SegmentedControl({ label, value, onChange, options }) {
  const name = useId();
  return <fieldset className="segmented"><legend>{label}</legend><div className="segmented-options">{options.map(option => <label key={option.value} className={value === option.value ? 'is-selected' : ''}><input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /><span>{value === option.value && <Icon name="check" />}{option.label}</span></label>)}</div></fieldset>;
}
