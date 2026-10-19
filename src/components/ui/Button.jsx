import { useRef } from 'react';
import { PixelFrame } from './PixelFrame.jsx';
import { Icon } from './Icon.jsx';
import './Button.css';
import { uiText } from '../../content/uiText.js';

function Action({ as: Element = 'button', children, variant = 'secondary', size = 'md', fullWidth = false, icon, loading = false, loadingLabel = uiText.saving, disabled = false, type = 'button', onClick, className = '', ...props }) {
  const ref = useRef(null);
  const framed = variant !== 'text';
  return <Element {...props} ref={ref} type={Element === 'button' ? type : undefined} disabled={Element === 'button' ? disabled : undefined} href={Element === 'a' && disabled ? undefined : props.href} aria-disabled={loading || disabled || undefined} aria-busy={loading || undefined} className={`button ${framed ? 'framed' : ''} button-${variant} button-${size} ${fullWidth ? 'button-full' : ''} ${className}`} onClick={event => { if (loading || disabled) { event.preventDefault(); return; } onClick?.(event); }}>
    {framed && <PixelFrame targetRef={ref} shape={variant === 'primary' ? 'ticket' : 'sticker'} />}
    <span className="control-content">
      <span className={`button-label ${loading ? 'button-label-hidden' : ''}`} aria-hidden={loading || undefined}>{icon && <Icon name={icon} />}{children}</span>
      {loading && <span className="button-pending"><Icon name="progress" className="progress-icon" />{loadingLabel}</span>}
    </span>
  </Element>;
}
export function Button(props) { return <Action {...props} />; }
export function ActionLink(props) { return <Action {...props} as="a" />; }
export function IconButton({ label, icon, ...props }) { return <Action {...props} size="icon" aria-label={label} icon={icon}><span className="sr-only">{label}</span></Action>; }
