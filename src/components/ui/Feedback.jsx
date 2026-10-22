import { statusLabels } from '../../content/uiText.js';
import { Icon } from './Icon.jsx';
import { Button } from './Button.jsx';
import { useRef } from 'react';
import { PixelFrame } from './PixelFrame.jsx';
import { useFrameStyle } from './FrameStyle.jsx';

export function Card({ children, className = '', folded = false, tone = 'panel', frameShape = 'panel', ...props }) {
  const ref = useRef(null);
  const style = useFrameStyle();
  const panelTone = tone === 'strong' ? 'strong' : 'panel';
  return <section {...props} ref={ref} data-frame-style={style} data-frame-tone={panelTone} className={`card ${className}`}>{['gateway', 'sdp'].includes(style) && <PixelFrame targetRef={ref} shape={frameShape} folded={folded} tone={panelTone} />}{children}</section>;
}
export function StatusBadge({ status }) {
  const { label, icon, tone } = statusLabels[status];
  return <span className={`status-badge tone-${tone}`}><Icon name={icon} />{label}</span>;
}
export function FeedbackState({ title, children, icon = 'warning', action, onAction, error = false }) {
  return <section className={`feedback ${error ? 'feedback-error' : ''}`} role={error ? 'alert' : undefined}><Icon name={icon} /><div><h2>{title}</h2><p>{children}</p>{action && <div className="paint-space"><Button size="sm" onClick={onAction}>{action}</Button></div>}</div></section>;
}
export function Toast({ children }) { return <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">{children && <p className="toast"><Icon name="check" />{children}</p>}</div>; }
