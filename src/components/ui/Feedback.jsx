import { statusLabels } from '../../content/uiText.js';
import { Icon } from './Icon.jsx';
import { Button } from './Button.jsx';

export function Card({ children, className = '', ...props }) { return <section {...props} className={`card ${className}`}>{children}</section>; }
export function StatusBadge({ status }) {
  const { label, icon, tone } = statusLabels[status];
  return <span className={`status-badge tone-${tone}`}><Icon name={icon} />{label}</span>;
}
export function FeedbackState({ title, children, icon = 'warning', action, onAction, error = false }) {
  return <section className={`feedback ${error ? 'feedback-error' : ''}`} role={error ? 'alert' : undefined}><Icon name={icon} /><div><h2>{title}</h2><p>{children}</p>{action && <div className="paint-space"><Button size="sm" onClick={onAction}>{action}</Button></div>}</div></section>;
}
export function Toast({ children }) { return <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">{children && <p className="toast"><Icon name="check" />{children}</p>}</div>; }
