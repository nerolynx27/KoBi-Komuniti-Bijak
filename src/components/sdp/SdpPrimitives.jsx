import { Button, ActionLink } from '../ui/Button.jsx';
import { Card } from '../ui/Feedback.jsx';
import { FrameStyleProvider } from '../ui/FrameStyle.jsx';
import './sdp-components.css';

export function SdpButton({ className = '', variant = 'primary', ...props }) {
  return <FrameStyleProvider value="sdp"><Button {...props} variant={variant} className={`sdp-button ${className}`} /></FrameStyleProvider>;
}

export function SdpActionLink({ className = '', variant = 'primary', ...props }) {
  return <FrameStyleProvider value="sdp"><ActionLink {...props} variant={variant} className={`sdp-button ${className}`} /></FrameStyleProvider>;
}

export function SdpCard({ kind = 'panel', tone = 'vanilla', folded = ['welcome', 'panel', 'shortcut'].includes(kind), className = '', children, ...props }) {
  return <FrameStyleProvider value="sdp"><Card {...props} frameShape={`sdp-${kind}`} folded={folded} data-sdp-kind={kind} className={`sdp-card sdp-card-${kind} sdp-tone-${tone} ${className}`}>{children}</Card></FrameStyleProvider>;
}
